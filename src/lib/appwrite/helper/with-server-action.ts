import { handleServerError } from "../../errors";
import { ActionResponse } from "../../errors";

export function withServerAction<TArgs extends any[], TResult>(
  handler: (...args: TArgs) => Promise<ActionResponse<TResult>>,
) {
  return async (...args: TArgs): Promise<ActionResponse<TResult>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleServerError(error) as ActionResponse<TResult>;
    }
  };
}
