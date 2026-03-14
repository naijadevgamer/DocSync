import { Client, Account, Databases, Storage, Users } from "node-appwrite";
import { parseCookieHeader } from "../utils";

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!)
    .setKey(process.env.API_KEY!);

  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
};

export const createSessionClient = (cookieHeader?: string) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  if (cookieHeader) {
    const cookies = parseCookieHeader(cookieHeader);
    const sessionKey = `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}`;
    if (cookies[sessionKey]) {
      client.headers["x-appwrite-session"] = cookies[sessionKey];
    }
  }

  return {
    account: new Account(client),
    databases: new Databases(client),
  };
};
