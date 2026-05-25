import { notFound, redirect } from "next/navigation";

import { ActionResponse, AppError, ErrorCode } from "@/lib/errors";

type ErrorBehavior = "notFound" | "redirect" | "ignore" | "throw";

type QueryOptions<T> = {
  onError?: Partial<Record<ErrorCode, ErrorBehavior>>;
  redirectTo?: string;
  defaultValue?: T;
};

export async function unwrapAction<T>(
  action: () => Promise<ActionResponse<T>>,
  options: QueryOptions<T> = {},
): Promise<T> {
  const result = await action();

  if (result.success) {
    console.log("Action succeeded:", result.data);
    return result.data;
  }

  const errorCode = result.error.code;
  const behavior = options.onError?.[errorCode] || "throw";

  switch (behavior) {
    case "notFound":
      notFound();

    case "redirect":
      redirect(options.redirectTo || "/");

    case "ignore":
      return options.defaultValue as T;

    case "throw":
    default:
      const appError = new AppError(result.error);
      // Add digest for Next.js to identify error types
      (appError as any).digest = errorCode;

      throw appError;
  }
}
