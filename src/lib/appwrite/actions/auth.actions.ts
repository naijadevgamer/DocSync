// "use server";

// import { cookies } from "next/headers";
// import { notFound, redirect } from "next/navigation";
// import { ID, Query } from "node-appwrite";
// import { createToken } from "../appwrite/jwt";
// import {
//   createServerClient,
//   createSessionClient,
//   // getCurrentUser,
// } from "../appwrite/server";
// import { ActionResult, handleError } from "../errors/errors";
// import { parseStringify } from "../utils";
// import { withServerAction } from "./with-server-action";
// import { requireAuth } from "./auth-guard";
// import { successResponse } from "../errors";

// export const createUser = async (user: CreateUserParams) => {
//   try {
//     const { users } = createServerClient();

//     let newUser;

//     // try {
//     newUser = await users.create({
//       userId: ID.unique(),
//       email: user.email,
//       phone: user.phone,
//       name: user.name,
//       password: user.password,
//     });

//     const session = await users.createSession({
//       userId: newUser.$id,
//     });

//     const isAdmin = newUser.labels?.includes("admin") || false;

//     const cookieStore = await cookies();

//     cookieStore.set("my-custom-session", session.secret, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 30,
//     });

//     const { account } = await createSessionClient();

//     await account.createEmailVerification({
//       url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify?email=${encodeURIComponent(user.email)}`,
//     });

//     const token = await createToken({
//       userId: newUser.$id,
//       role: isAdmin ? "admin" : "user",
//     });

//     cookieStore.set("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 30,
//     });

//     return {
//       success: true,
//       data: parseStringify(newUser),
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export const loginUser = async ({
//   email,
//   password,
//   rememberMe,
// }: {
//   email: string;
//   password: string;
//   rememberMe?: boolean;
// }) => {
//   try {
//     const { account } = createServerClient();

//     // 1. Create session
//     const session = await account.createEmailPasswordSession({
//       email,
//       password,
//     });

//     const cookieStore = await cookies();

//     const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 1; // 30 days or session cookie

//     cookieStore.set("my-custom-session", session.secret, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge,
//     });

//     // 2. Create session client
//     const { account: sessionAccount, tablesDB } = await createSessionClient();

//     // 3. Fetch user
//     const user = await sessionAccount.get();
//     const isAdmin = user.labels?.includes("admin") || false;

//     // 4. Validate env BEFORE DB call
//     const patient = await tablesDB.listRows({
//       databaseId: process.env.DATABASE_ID!,
//       tableId: process.env.PATIENT_TABLE_ID!,
//       queries: [Query.equal("userId", [user?.$id])],
//     });

//     const hasPersonalInfo = Boolean(patient.total);

//     // 5. Create JWT
//     const token = await createToken({
//       userId: user.$id,
//       role: isAdmin ? "admin" : "user",
//     });

//     cookieStore.set("auth_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge,
//     });

//     return {
//       success: true,
//       data: {
//         user: {
//           $id: user.$id,
//           email: user.email,
//           name: user.name,
//           emailVerification: user.emailVerification,
//           phone: user.phone,
//           labels: user.labels,
//         },
//         hasPersonalInfo,
//         isAdmin,
//         patientId: patient.rows[0]?.$id || null,
//       },
//     };
//   } catch (error: any) {
//     return handleError(error);
//   }
// };

// // export const loginUser = withServerAction(
// //   async ({
// //     email,
// //     password,
// //     rememberMe,
// //   }: {
// //     email: string;
// //     password: string;
// //     rememberMe?: boolean;
// //   }) => {
// //     const { account } = createServerClient();

// //     const session = await account.createEmailPasswordSession({
// //       email,
// //       password,
// //     });

// //     const cookieStore = await cookies();

// //     const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

// //     cookieStore.set("my-custom-session", session.secret, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === "production",
// //       sameSite: "lax",
// //       path: "/",
// //       maxAge,
// //     });

// //     const user = await account.get();

// //     const isAdmin = user.labels?.includes("admin");

// //     const token = await createToken({
// //       userId: user.$id,
// //       role: isAdmin ? "admin" : "user",
// //     });

// //     cookieStore.set("auth_token", token, {
// //       httpOnly: true,
// //       secure: process.env.NODE_ENV === "production",
// //       sameSite: "lax",
// //       path: "/",
// //       maxAge,
// //     });

// //     return successResponse({
// //       user,
// //       isAdmin,
// //     });
// //   },
// // );

// export const logoutUser = async () => {
//   try {
//     const { account } = await createSessionClient();

//     const [_, cookieStore] = await Promise.all([
//       account.deleteSessions(),
//       cookies(),
//     ]);

//     cookieStore.delete("my-custom-session");
//     cookieStore.delete("auth_token");

//     return { success: true };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// export const verifyEmail = async () => {
//   try {
//     const result = await getCurrentUser();

//     const user = result.success ? result.data.user : null;

//     if (user?.emailVerification) {
//       return { isVerified: true, error: null };
//     }

//     return { isVerified: false, error: null };
//   } catch (error) {
//     return { isVerified: false, error: handleError(error) };
//   }
// };

// // Update password
// export const updatePassword = async (
//   currentPassword: string,
//   newPassword: string,
// ): Promise<ActionResult<any>> => {
//   try {
//     const { account } = await createSessionClient();

//     await account.updatePassword({
//       password: newPassword,
//       oldPassword: currentPassword,
//     });

//     return {
//       success: true,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// // Delete account
// export const deleteAccount = async (
//   userId: string,
// ): Promise<ActionResult<any>> => {
//   try {
//     const { users } = createServerClient();

//     await users.delete({ userId });

//     // Also delete session cookies
//     const cookieStore = await cookies();
//     cookieStore.delete("my-custom-session");
//     cookieStore.delete("auth_token");

//     return {
//       success: true,
//     };
//   } catch (error) {
//     return handleError(error);
//   }
// };

// // Check if user has completed personal info
// export const checkPersonalInfo = async () => {
//   try {
//     const { account, tablesDB } = await createSessionClient();

//     const user = await account.get();

//     const patient = await tablesDB.listRows({
//       databaseId: process.env.DATABASE_ID!,
//       tableId: process.env.PATIENT_TABLE_ID!,
//       queries: [Query.equal("userId", [user?.$id])],
//     });

//     return {
//       success: true,
//       data: { hasPersonalInfo: Boolean(patient.rows.length > 0) },
//     };
//   } catch (error) {
//     console.error("Error checking personal info:", error);
//     return handleError(error);
//   }
// };

// class AppError extends Error {
//   code?: string;

//   constructor(message: string, code?: string) {
//     super(message);
//     this.code = code;
//   }
// }

// // 🔐 Require specific user (ownership check)
// export async function getAuthorizedUser(userId: string) {
//   const result = await getCurrentUser();

//   if (!result.success) {
//     throw new Error(result.error?.message || "Failed to fetch user");
//   }

//   const user = result.data.user;

//   if (user.$id !== userId) {
//     notFound();
//   }

//   return user;
// }

// // 🔐 Require admin
// export async function getAuthorizedAdmin() {
//   const result = await getCurrentUser();

//   if (!result.success) {
//     console.error(
//       "Error fetching current user:",
//       result.error?.details || result.error,
//     );

//     throw new Error(result.error?.message || "Failed to fetch user");
//   }

//   const user = result.data.user;

//   if (!user.labels?.includes("admin")) {
//     redirect("/login");
//   }

//   return user;
// }

// export const getCurrentUser = withServerAction(async () => {
//   const { user } = await requireAuth();

//   return successResponse({
//     user,
//   });
// });

"use server";

import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { createToken } from "../helper/jwt";
import { createServerClient, createSessionClient } from "../config/server";
import { ActionResult, handleError } from "../../errors/errors";
import { parseStringify } from "../../utils/utils";
import { withServerAction } from "../helper/with-server-action";
import { requireAuth } from "../auth/require-auth";
import { handleServerError, successResponse } from "../../errors";

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

  const [_, token] = await Promise.all([
    account.createEmailVerification({
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify?email=${encodeURIComponent(user.email)}`,
    }),
    createToken({
      userId: newUser.$id,
      role: isAdmin ? "admin" : "user",
    }),
  ]);

  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return successResponse({ newUser: parseStringify(newUser) });
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

export const verifyEmail = async () => {
  try {
    const result = await getCurrentUser();

    const user = result.success ? result.data.user : null;

    if (user?.emailVerification) {
      return { isVerified: true, error: null };
    }

    return { isVerified: false, error: null };
  } catch (error) {
    return { isVerified: false, error: handleServerError(error) };
  }
};

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

  await users.delete({ userId });

  // Also delete session cookies
  const cookieStore = await cookies();
  cookieStore.delete("my-custom-session");
  cookieStore.delete("auth_token");

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

// 🔐 Require specific user (ownership check)
// export async function getAuthorizedUser(userId: string) {
//   const result = await getCurrentUser();

//   if (!result.success) {
//     throw new Error(result.error?.message || "Failed to fetch user");
//   }

//   const user = result.data.user;

//   if (user.$id !== userId) {
//     notFound();
//   }

//   return user;
// }

// 🔐 Require admin
// export async function getAuthorizedAdmin() {
//   const result = await getCurrentUser();

//   if (!result.success) {
//     console.error(
//       "Error fetching current user:",
//       result.error?.details || result.error,
//     );

//     throw new Error(result.error?.message || "Failed to fetch user");
//   }

//   const user = result.data.user;

//   if (!user.labels?.includes("admin")) {
//     redirect("/login");
//   }

//   return user;
// }

export const getCurrentUser = withServerAction(async () => {
  const { user } = await requireAuth();

  return successResponse({
    user,
  });
});
