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
import { parseCookieHeader } from "../utils";
import { createBaseClient } from "./config";
import { cache } from "react";
import { permissions } from "../appwrite.client";
import { messaging } from "../appwrite.config";
import { handleError } from "../errors";

export const createServerClient = () => {
  const client = createBaseClient().setKey(process.env.API_KEY!);
  return {
    account: new Account(client),
    users: new Users(client),
    databases: new Databases(client),
    storage: new Storage(client),
    messaging: new Messaging(client),
  };
};

export const createSessionClient = async () => {
  const client = createBaseClient();

  // 🔑 This is the important part
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("my-custom-session");

  if (!sessionCookie) {
    throw new Error("No session cookie found");
  }

  // Inject session into Appwrite client
  client.setSession(sessionCookie.value);

  console.log("Session cookie found and set in Appwrite client");

  return {
    account: new Account(client),
    databases: new Databases(client),
    tablesDB: new TablesDB(client),

    permissions: Permission.read(Role.any()),
  };
};

export const createSessionClientFromMiddleware = (cookieHeader: string) => {
  const client = createBaseClient();

  const cookies = parseCookieHeader(cookieHeader);

  const session = cookies["my-custom-session"];

  if (!session) {
    throw new Error("No session found");
  }

  client.setSession(session);

  return {
    account: new Account(client),
  };
};

export const getCurrentUser = async () => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    console.log("Current user fetched:", user);
    return { success: true, data: { user } };
  } catch (error: any) {
    return handleError(error);
  }
};
