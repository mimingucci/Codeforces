class StateNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "StateNotFoundError";
    this.status = 404; // Set the status code for "Not Found" errors
  }
}

module.exports = StateNotFoundError;
