"use server";

import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { successResponse } from "../../errors";
import { requireAuth } from "../auth/require-auth";
import { createServerClient, createSessionClient } from "../config/server";
import { createToken } from "../helper/jwt";
import { withServerAction } from "../helper/with-server-action";

export const createUser = withServerAction(async (user: CreateUserParams) => {
  const { users } = createServerClient();

  const newUser = await users.create({
    userId: ID.unique(),
    email: user.email,
    phone: user.phone,
    name: user.name,
    password: user.password,
  });

  const session = await users.createSession({
    userId: newUser.$id,
  });

  const cookieStore = await cookies();

  const token = await createToken({
    userId: newUser.$id,
    role: "user",
  });

  cookieStore.set("my-custom-session", session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  const { account } = await createSessionClient();
  await account.createEmailVerification({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
  });

  return successResponse({ newUser });
});

export const loginUser = withServerAction(
  async ({
    email,
    password,
    rememberMe,
  }: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
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
    const [patient, token] = await Promise.all([
      tablesDB.listRows({
        databaseId: process.env.DATABASE_ID!,
        tableId: process.env.PATIENT_TABLE_ID!,
        queries: [Query.equal("userId", [user.$id])],
      }),
      createToken({
        userId: user.$id,
        role: isAdmin ? "admin" : "user",
      }),
    ]);

    const hasPersonalInfo = Boolean(patient.total);

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return successResponse({
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
    });
  },
);

export const resendVerificationEmail = withServerAction(async () => {
  const { account } = await createSessionClient();

  // This requires an API key with appropriate permissions
  await account.createEmailVerification({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`,
  });

  return successResponse(null);
});

export const logoutUser = withServerAction(async () => {
  const { account } = await createSessionClient();

  const [_, cookieStore] = await Promise.all([
    account.deleteSessions(),
    cookies(),
  ]);

  cookieStore.delete("my-custom-session");
  cookieStore.delete("auth_token");

  return successResponse(null);
});

export const verifyEmail = withServerAction(async () => {
  const result = await getCurrentUser();

  if (!result.success) {
    return result;
  }

  return successResponse({
    isVerified: Boolean(result.data.user?.emailVerification),
  });
});

// Update password
export const updatePassword = withServerAction(
  async (currentPassword: string, newPassword: string) => {
    const { account } = await createSessionClient();

    await account.updatePassword({
      password: newPassword,
      oldPassword: currentPassword,
    });

    return successResponse(null);
  },
);

// Delete account
export const deleteAccount = withServerAction(async (userId) => {
  const { users } = createServerClient();
  // Delete session cookies
  const cookieStore = await cookies();
  cookieStore.delete("my-custom-session");
  cookieStore.delete("auth_token");

  await users.delete({ userId });

  return successResponse(null);
});

// Check if user has completed personal info
export const checkPersonalInfo = withServerAction(async () => {
  const { account, tablesDB } = await createSessionClient();

  const user = await account.get();

  const patient = await tablesDB.listRows({
    databaseId: process.env.DATABASE_ID!,
    tableId: process.env.PATIENT_TABLE_ID!,
    queries: [Query.equal("userId", [user?.$id])],
  });

  return successResponse({
    hasPersonalInfo: Boolean(patient.rows.length > 0),
  });
});

export const sendPasswordRecovery = withServerAction(async (email: string) => {
  const { account } = createServerClient();

  await account.createRecovery({
    email,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  return successResponse(null);
});

export const resetPassword = withServerAction(
  async (userId: string, secret: string, newPassword: string) => {
    const { account } = createServerClient();

    await account.updateRecovery({
      userId,
      secret,
      password: newPassword,
    });

    return successResponse(null);
  },
);

export const getCurrentUser = withServerAction(async () => {
  const user = await requireAuth();

  return successResponse({
    user,
  });
});
