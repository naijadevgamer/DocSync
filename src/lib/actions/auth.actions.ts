"use server";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { createToken } from "../appwrite/jwt";
import {
  createServerClient,
  createSessionClient,
  getCurrentUser,
} from "../appwrite/server";
import { handleError } from "../errors";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const { users } = createServerClient();

    let newUser;

    // try {
    newUser = await users.create({
      userId: ID.unique(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      password: user.password,
    });

    const session = await users.createSession({
      userId: newUser.$id,
    });

    const isAdmin = newUser.labels?.includes("admin") || false;

    const cookieStore = await cookies();

    cookieStore.set("my-custom-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    const { account } = await createSessionClient();

    await account.createEmailVerification({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
    });

    const token = await createToken({
      userId: newUser.$id,
      role: isAdmin ? "admin" : "user",
    });

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return {
      success: true,
      data: parseStringify(newUser),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const loginUser = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) => {
  try {
    const { account } = createServerClient();

    // 1. Create session
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    const cookieStore = await cookies();

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1; // 30 days or session cookie

    cookieStore.set("my-custom-session", session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    // 2. Create session client
    const { account: sessionAccount, tablesDB } = await createSessionClient();

    // 3. Fetch user
    const user = await sessionAccount.get();
    const isAdmin = user.labels?.includes("admin") || false;

    // 4. Validate env BEFORE DB call
    const patient = await tablesDB.listRows({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      queries: [Query.equal("userId", [user?.$id])],
    });

    const hasPersonalInfo = Boolean(patient.total);

    // 5. Create JWT
    const token = await createToken({
      userId: user.$id,
      role: isAdmin ? "admin" : "user",
    });

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return {
      success: true,
      data: {
        user: {
          $id: user.$id,
          email: user.email,
          name: user.name,
          emailVerification: user.emailVerification,
          phone: user.phone,
          labels: user.labels,
        },
        hasPersonalInfo,
        isAdmin,
        patientId: patient.rows[0]?.$id || null,
      },
    };
  } catch (error: any) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    // const cookieHeader = (await cookies()).toString();
    const { account } = await createSessionClient();
    await account.deleteSessions();

    const cookieStore = await cookies();
    cookieStore.delete("my-custom-session");
    cookieStore.delete("auth_token");

    redirect("/login");
  } catch (error) {
    return handleError(error);
  }
};

export const verifyEmail = async () => {
  try {
    const result = await getCurrentUser();

    const user = result.data.user;

    if (user?.emailVerification) {
      return { isVerified: true, error: null };
    }

    return { isVerified: false, error: null };
  } catch (error) {
    return { isVerified: false, error: handleError(error) };
  }
};

// Check if user has completed personal info
export const checkPersonalInfo = async () => {
  console.log("Checking personal info completion...");
  try {
    const { account, tablesDB } = await createSessionClient();

    const user = await account.get();

    console.log("Fetching current user...");
    // const user = await getCurrentUser();

    console.log("Current user:", user);
    // console.log("Querying patient table for user ID:", user.$id);
    const patient = await tablesDB.listRows({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      queries: [Query.equal("userId", [user?.$id])],
    });

    // return parseStringify(patient.rows[0] || null);

    console.log("Patient query result:", patient);
    return {
      success: true,
      data: { hasPersonalInfo: Boolean(patient.rows.length > 0) },
    };
  } catch (error) {
    console.error("Error checking personal info:", error);
    return handleError(error);
  }
};

class AppError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

// 🔐 Require specific user (ownership check)
export async function getAuthorizedUser(userId: string) {
  const result = await getCurrentUser();

  if (!result.success) {
    throw new Error(result.error?.message || "Failed to fetch user");
  }

  const user = result.data.user;

  if (user.$id !== userId) {
    notFound();
  }

  return user;
}

// 🔐 Require admin
export async function getAuthorizedAdmin() {
  const result = await getCurrentUser();

  if (!result.success) {
    console.error(
      "Error fetching current user:",
      result.error?.details || result.error,
    );

    throw new Error(result.error?.message || "Failed to fetch user");
  }

  const user = result.data.user;

  if (!user.labels?.includes("admin")) {
    redirect("/login");
  }

  return user;
}
