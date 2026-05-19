import { ErrorCode } from "./error-codes";

type AppErrorOptions = {
  code: ErrorCode;
  message: string;
  statusCode?: number;
  details?: unknown;
};

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor({ code, message, statusCode = 500, details }: AppErrorOptions) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
