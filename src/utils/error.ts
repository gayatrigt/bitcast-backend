export abstract class HttpError extends Error {
  abstract readonly statusCode: number;

  constructor(message: string) {
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

export class BadRequestError extends HttpError {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends HttpError {
  readonly statusCode = 401;

  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends HttpError {
  readonly statusCode = 403;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends HttpError {
  readonly statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}

export const httpErrorHandler = (error: unknown, res: Response) => {
  if (error instanceof HttpError) {
    console.error(
      `Error occurred: ${error.message} (Status Code: ${error.statusCode})`
    );
    // Handle specific HTTP errors based on their status code
  } else {
    console.error("Unexpected error:", error);
    // Handle other types of errors
  }
};
