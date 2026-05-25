import ClientHome from "@/components/home/ClientHome";
import { getCurrentUser } from "@/lib/appwrite/actions/auth.actions";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { createMetadata } from "@/lib/utils/metadata";

import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Home",
  description:
    "Manage appointments, patient records, and healthcare services seamlessly.",
});

export default async function HomePage() {
  const result = await unwrapAction(getCurrentUser, {
    onError: {
      AUTH_REQUIRED: "ignore",
      AUTH_SESSION_EXPIRED: "ignore",
    },
    defaultValue: null,
  });

  const user = result?.user ?? null;

  return <ClientHome user={user} />;
}
