import { cookies } from "next/headers";

import {
  Account,
  Databases,
  Messaging,
  Permission,
  Role,
  Storage,
  TablesDB,
  Users,
} from "node-appwrite";

import { createBaseClient } from "./base";

import { AppError } from "../../errors";
import { ErrorCode } from "../../errors";
import { parseCookieHeader } from "../../utils/utils";

export async function createSessionClient() {
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

  return {
    account: new Account(client),
    databases: new Databases(client),
    tablesDB: new TablesDB(client),
    storage: new Storage(client),
    messaging: new Messaging(client),
    permissions: Permission.read(Role.any()),
  };
}

export function createServerClient() {
  const client = createBaseClient().setKey(process.env.API_KEY!);
  return {
    account: new Account(client),
    users: new Users(client),
    tablesDB: new TablesDB(client),
    databases: new Databases(client),
    storage: new Storage(client),
    messaging: new Messaging(client),
    permissions: Permission.read(Role.any()),
  };
}

export const createSessionClientFromMiddleware = (cookieHeader: string) => {
  const client = createBaseClient();

  const cookies = parseCookieHeader(cookieHeader);

  const session = cookies["my-custom-session"];

  if (!session) {
    throw new AppError({
      code: ErrorCode.AUTH_REQUIRED,
      message: "Authentication required",
      statusCode: 401,
    });
  }

  client.setSession(session);

  return {
    account: new Account(client),
  };
};
