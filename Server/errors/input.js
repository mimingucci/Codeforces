class MissingFieldsError extends Error {
  constructor(message) {
    super(message);
    this.name = "Missing Fields Error";
    this.status = 404; // Set the status code for "Not Found" errors
  }
}

module.exports = { MissingFieldsError };
