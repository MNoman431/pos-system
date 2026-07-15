export class HttpError extends Error {
  constructor(status = 500, message = "Internal server error", code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
