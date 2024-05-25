class CommentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "CommentNotFoundError";
    this.status = 404; // Set the status code for "Not Found" errors
  }
}
module.exports = { CommentNotFoundError };
