import { Client, Account, Databases, Storage, Users } from "node-appwrite";
import { parseCookieHeader } from "../utils";
import { createBaseClient } from "./config";

export const createAdminClient = () => {
  const client = createBaseClient().setKey(process.env.API_KEY!);
  return {
    users: new Users(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
};

export const createSessionClient = ({
  sessionSecret,
  cookieHeader,
}: {
  sessionSecret?: string;
  cookieHeader?: string;
}) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  // Server actions
  if (sessionSecret) {
    client.setSession(sessionSecret);
  }

  // Middleware / edge runtime
  if (cookieHeader) {
    const cookies = parseCookieHeader(cookieHeader);
    const sessionKey = `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}`;

    if (cookies[sessionKey]) {
      client.setSession(cookies[sessionKey]);
    }
  }

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
};
