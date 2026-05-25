import ClientHome from "@/components/home/ClientHome";
import { getCurrentUser } from "@/lib/appwrite/actions/auth.actions";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";

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
