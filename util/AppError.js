class AppError extends Error {
  constructor(message, status) {
    super(); // this pulls data from the parent class
    this.message = message;
    this.status = status;
  }
}

module.exports = AppError;
