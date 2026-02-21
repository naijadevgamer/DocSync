"use server";

import { AppwriteException, ID, Query } from "node-appwrite";

import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_TABLE_ID,
  permissions,
  PROJECT_ID,
  storage,
  tablesDB,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// const result = await users.create(
//   "<USER_ID>", // userId
//   "email@example.com", // email (optional)
//   "+12065550100", // phone (optional)
//   "", // password (optional)
//   "<NAME>", // name (optional)
// );

export const createUser = async (user: CreateUserParams) => {
  try {
    // const newuser = await users.create(
    //   ID.unique(),
    //   user.email,
    //   user.phone,
    //   undefined,
    //   user.name,
    // );
    const newUser = await users.create({
      userId: ID.unique(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      // password: "optional", // only if you want to set one
    });

    return parseStringify(newUser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      // const existingUser = await users.list([
      //   Query.equal("email", [user.email]),
      // ]);

      const existingUser = await users.list({
        queries: [Query.equal("email", [user.email])],
      });

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await users.get({ userId });
    return parseStringify(user);
  } catch (error: any) {
    if (error.code === 404) {
      // Expected "not found" case
      return null;
    }
    throw error; // Unexpected server crash or network error
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    const fileId = identificationDocument?.get("fileId") as string;
    const fileUrl = identificationDocument?.get("fileUrl") as string;

    // const newPatient = await databases.createDocument({
    //   databaseId: DATABASE_ID!,
    //   collectionId: PATIENT_TABLE_ID!,
    //   documentId: ID.unique(),
    //   data: {
    //     identificationDocumentId: fileId ?? null,
    //     identificationDocumentUrl: fileUrl ?? null,
    //     ...patient,
    //   },
    //   permissions: [permissions],
    // });

    const newPatient = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        identificationDocumentId: fileId ?? null,
        identificationDocumentUrl: fileUrl ?? null,
        ...patient,
      },
      permissions: [permissions],
    });

    return parseStringify(newPatient);
  } catch (error: any) {
    console.error("Error code", error.code);
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patient = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: PATIENT_TABLE_ID!,
      queries: [Query.equal("userId", [userId])],
    });

    return parseStringify(patient.rows[0] || null);
  } catch (error: any) {
    if (error.code === 404) {
      // Expected "not found" case
      return null;
    }
    throw error;
  }
};
