import { notFound } from "next/navigation";

import { requireAuth } from "./require-auth";
import { AppError } from "@/lib/errors/app-error";
import { ErrorCode } from "@/lib/errors";

export async function requireAdmin() {
  const { user, account } = await requireAuth();

  if (!user.labels?.includes("admin")) {
    throw new AppError({
      code: ErrorCode.AUTH_FORBIDDEN,
      message: "You are not allowed to access this resource",
      statusCode: 403,
    });
  }

  return { user, account };
}

export async function requireOwnership(resourceUserId: string) {
  const { user, account } = await requireAuth();

  if (user.$id !== resourceUserId) {
    notFound();
  }

  return { user, account };
}
