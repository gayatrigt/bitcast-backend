"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpErrorHandler = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, HttpError.prototype); // Ensures proper inheritance behavior
    }
    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
        };
    }
}
exports.HttpError = HttpError;
class BadRequestError extends HttpError {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends HttpError {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends HttpError {
    constructor(message) {
        super(message);
        this.statusCode = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends HttpError {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}
exports.NotFoundError = NotFoundError;
const httpErrorHandler = (error, res) => {
    if (error instanceof HttpError) {
        console.error(`Error occurred: ${error.message} (Status Code: ${error.statusCode})`);
        // Handle specific HTTP errors based on their status code
    }
    else {
        console.error("Unexpected error:", error);
        // Handle other types of errors
    }
};
exports.httpErrorHandler = httpErrorHandler;
