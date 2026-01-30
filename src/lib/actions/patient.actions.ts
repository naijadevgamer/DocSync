"use server";

import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
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
