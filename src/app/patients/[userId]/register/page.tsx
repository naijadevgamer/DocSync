import RegisterForm from "@/components/forms/RegisterForm";
import { getUserById } from "@/lib/actions/patient.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Register({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  let user;

  try {
    user = await getUserById(userId);
  } catch (err: any) {
    console.error("Error fetching user:", err);
    throw err; // Let Next.js handle the error and show the error page
  }

  if (!user) notFound(); // must be outside the try/catch

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={38}
            width={164}
            alt="DocSync Logo"
            className="mb-12 h-10 w-fit"
          />

          <RegisterForm user={user} />

          <p className="copyright py-12">
            © {new Date().getFullYear()} DocSync
          </p>
        </div>
      </section>

      <div className="side-img relative h-full w-[30%]">
        <Image
          src="/assets/images/register-img.png"
          alt="patient"
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
