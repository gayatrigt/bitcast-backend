import express, { NextFunction, Response } from "express";
import { AuthRequest } from "../schemas";

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

export const httpErrorHandler = (
  error: any,
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  const errorMsg =
    error instanceof HttpError ? error.message : "Something went wrong";

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errorMsg,
    stack: process.env.NODE_ENV === "development" ? error.stack : {},
  });

  return;
};
