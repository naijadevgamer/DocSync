"use server";

import { ID, Query } from "node-appwrite";

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
  } catch (error) {
    console.error("An error occurred while fetching the user:", error);
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string,
        );

      console.log("Input file:", inputFile);

      // file = await storage.createFile({
      //   bucketId: BUCKET_ID!,
      //   fileId: ID.unique(),
      //   file: inputFile,
      //   // permissions: ['read("*" )'],
      //   permissions: [permissions],
      // });
    }

    // const result = storage.getFileDownload({
    //   bucketId: BUCKET_ID!,
    //   fileId: file?.$id || "",
    // });

    // console.log(result); // Resource URL

    // const newPatient = await databases.createDocument({
    //   databaseId: DATABASE_ID!,
    //   collectionId: PATIENT_TABLE_ID!,
    //   documentId: ID.unique(),
    //   data: {
    //     identificationDocumentId: file?.$id ? file.$id : null,
    //     identificationDocumentUrl: file?.$id
    //       ? // ?  `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
    //         result
    //       : null,
    //     ...patient,
    //   },
    //   permissions: [permissions],
    // });

    // const newPatient = await tablesDB.createRow({
    //   databaseId: DATABASE_ID!,
    //   tableId: PATIENT_TABLE_ID!,
    //   rowId: ID.unique(),
    //   data: {
    //     identificationDocumentId: file?.$id ?? null,
    //     identificationDocumentUrl: file?.$id ? result : null,
    //     ...patient,
    //   },
    //   permissions: [permissions], // optional
    // });

    return parseStringify(false);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};
