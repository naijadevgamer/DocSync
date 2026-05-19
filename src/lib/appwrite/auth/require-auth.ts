import { cookies } from "next/headers";

import { Account } from "node-appwrite";

import { createBaseClient } from "../config/base";

import { AppError } from "../../errors";
import { ErrorCode } from "../../errors";

export async function requireAuth() {
  const cookieStore = await cookies();

  const session = cookieStore.get("my-custom-session");

  if (!session) {
    throw new AppError({
      code: ErrorCode.AUTH_REQUIRED,
      message: "Authentication required",
      statusCode: 401,
    });
  }

  const client = createBaseClient();

  client.setSession(session.value);

  const account = new Account(client);

  try {
    const user = await account.get();

    return {
      user,
      account,
    };
  } catch {
    throw new AppError({
      code: ErrorCode.AUTH_SESSION_EXPIRED,
      message: "Session expired",
      statusCode: 401,
    });
  }
}
