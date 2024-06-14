const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
require("dotenv").config();

function HashedString(s) {
  // change M and B if you want
  let M = 1e9 + 9; //(1LL << 61) - 1
  let B = 1;

  // pow[i] contains B^i % M
  let pow = [1];

  // p_hash[i] is the hash of the first i characters of the given string
  let p_hash = new Array(s.length + 1);

  while (pow.length < s.length) {
    pow.push((pow[pow.length - 1] * B) % M);
  }
  p_hash[0] = 0;
  for (let i = 0; i < s.length; i++) {
    p_hash[i + 1] = (((p_hash[i] * B) % M) + s.charCodeAt(i)) % M;
  }

  let raw_val = p_hash[s.length] - p_hash[0] * pow[s.length - 1];
  return ((raw_val % M) + M) % M;
}

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const pass = uuidv4();
        const newUser = new User({
          authenticationType: "GOOGLE",
          enabled: true,
          username: profile.displayName + " " + HashedString(profile.id),
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          avatar: profile.photos[0].value,
          email: profile.emails[0].value,
          password: pass,
        });

        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            if (user?.authenticationType === "DATABASE") {
              done("Email is already used before", null);
            }
            user.password = pass;
            let savedUser = await user.save();
            savedUser.password = pass;
            done(null, savedUser);
          } else {
            user = await newUser.save();
            user.password = pass;
            done(null, user);
          }
        } catch (err) {
          done("Something went wrong, try again!", null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
