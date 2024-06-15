const router = require("express").Router();
const passport = require("passport");

require("dotenv").config();

// localhost:1234/api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
// localhost:1234/api/auth/google/callback
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      if (err) {
        return res.redirect(`${process.env.URL_REACT_APP}/error`);
      }
      req.user = profile;
      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(
      `${process.env.URL_REACT_APP}/login-google/${req.user?.email}/${req.user?.password}`
    );
  }
);

module.exports = router;
