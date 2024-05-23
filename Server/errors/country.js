class CountryNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "CountryNotFoundError";
    this.status = 404; // Set the status code for "Not Found" errors
  }
}

module.exports = CountryNotFoundError;
