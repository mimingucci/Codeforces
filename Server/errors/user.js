class UserNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserNotFoundError";
    this.status = 404; // Set the status code for "Not Found" errors
  }
}

class UsernameExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "UsernameExistsError";
    this.status = 409;
  }
}

class EmailExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailExistsError";
    this.status = 409;
  }
}

module.exports = { UserNotFoundError, UsernameExistsError, EmailExistsError };
