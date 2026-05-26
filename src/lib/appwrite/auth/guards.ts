import { notFound, redirect } from "next/navigation";

import { requireAuth } from "./require-auth";

export async function requireAdmin() {
  const user = await requireAuth();

  if (!user.labels?.includes("admin")) {
    // throw new AppError({
    //   code: ErrorCode.AUTH_FORBIDDEN,
    //   message: "You are not allowed to access this resource",
    //   statusCode: 403,
    // });
    redirect(`/patients/${user.$id}/dashboard`);
  }

  return user;
}

export async function requireOwnership(resourceUserId: string) {
  const user = await requireAuth();

  if (user.$id !== resourceUserId) {
    notFound();
  }

  return user;
}
