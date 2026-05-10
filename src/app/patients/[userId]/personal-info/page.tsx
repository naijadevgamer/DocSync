import PatientForm from "@/components/forms/PatientInfoForm";
import FullLogo from "@/components/utils/FullLogo";
import { getAuthorizedUser } from "@/lib/actions/auth.actions";
import Image from "next/image";

export default async function PersonalInfo({ params }: SearchParamProps) {
  const { userId } = await params;

  const user = (await getAuthorizedUser(userId)) as User;

  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <div className="mb-12">
            <FullLogo />
          </div>

          <PatientForm user={user} />

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
