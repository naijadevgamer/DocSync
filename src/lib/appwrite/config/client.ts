import { Client, Account, Databases, Storage } from "appwrite";

export const createBrowserClient = () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

  return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
};
