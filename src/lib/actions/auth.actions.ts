"use server";

import { Account, Client, ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { handleError } from "../errors";
import { redirect } from "next/navigation";

export const createUser = async (user: CreateUserParams) => {
  try {
    const { users } = createAdminClient();

    let newUser;

    try {
      newUser = await users.create({
        userId: ID.unique(),
        email: user.email,
        phone: user.phone,
        name: user.name,
        password: user.password,
      });
    } catch (error: any) {
      if (error.code === 409) {
        const existing = await users.list({
          queries: [
            Query.or([
              Query.equal("email", [user.email]),
              Query.equal("phone", [user.phone]),
            ]),
          ],
        });

        newUser = existing.users[0];
      } else {
        throw error;
      }
    }

    const session = await users.createSession({
      userId: newUser.$id,
    });

    (await cookies()).set(
      `a_session_${process.env.NEXT_PUBLIC_PROJECT_ID}`,
      session.secret,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      },
    );

    const { account } = createSessionClient({ sessionSecret: session.secret });

    await account.createEmailVerification({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
    });

    return {
      success: true,
      data: parseStringify(newUser),
    };
  } catch (error) {
    return handleError(error);
  }
};
