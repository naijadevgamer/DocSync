import ClientHome from "@/components/home/ClientHome";
import { getCurrentUser } from "@/lib/appwrite/server";
import { cookies } from "next/headers";

export default async function HomePage() {
  let user = null;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("my-custom-session");

    if (sessionCookie) {
      const result = await getCurrentUser();

      if (result.success) {
        user = result.data.user;
      }
    }
  } catch (error) {
    console.log("No active session");
  }

  return <ClientHome user={user} />;
}
