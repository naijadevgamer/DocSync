import { Client, Storage, ID, Permission, Role, Account } from "appwrite";

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_TABLE_ID,
  DOCTOR_TABLE_ID,
  APPOINTMENT_TABLE_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

export const account = new Account(client);
export const storage = new Storage(client);
export const permissions = Permission.read(Role.any());

export { ID };
