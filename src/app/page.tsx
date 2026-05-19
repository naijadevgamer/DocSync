import ClientHome from "@/components/home/ClientHome";
import { getCurrentUser } from "@/lib/appwrite/actions/auth.actions";

export default async function HomePage() {
  let user = null;

  const result = await getCurrentUser();

  if (!result.success) {
    if (result.error?.code === "NETWORK_ERROR") {
      throw new Error(result.error?.message || "Network error occurred");
    }
  }

  user = result.success ? result.data.user : null;

  return <ClientHome user={user} />;
}
