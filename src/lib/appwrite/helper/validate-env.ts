import { AppError } from "../../errors";
import { ErrorCode } from "../../errors";

export function validateEnv(value: string | undefined, key: string): string {
  if (!value?.trim()) {
    throw new AppError({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      message: `Missing environment variable: ${key}`,
      statusCode: 500,
    });
  }

  return value;
}
