class BlogNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "Blog Not Found Error";
    this.status = 404; // Set the status code for "Not Found" errors
  }
}

module.exports = { BlogNotFoundError };
