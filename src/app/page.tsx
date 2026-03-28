// import PatientForm from "@/components/forms/PatientForm";
// import FullLogo from "@/components/FullLogo";
// import PassKeyModal from "@/components/PassKeyModal";
// import Image from "next/image";
// import Link from "next/link";

// export default async function HomePage({ searchParams }: SearchParamProps) {
//   const { admin } = await searchParams;
//   const isAdmin = admin === "true";

//   return (
//     <div className="flex h-screen">
//       {isAdmin && <PassKeyModal />}

//       <section className="remove-scrollbar container">
//         <div className="sub-container max-w-124">
//           <div className="mb-12">
//             <FullLogo />
//           </div>

//           <PatientForm />

//           <div className="text-14-regular flex justify-between py-12">
//             <p className="text-dark-600 justify-items-end xl:text-left">
//               © {new Date().getFullYear()} DocSync
//             </p>
//             <Link href="/?admin=true" className="text-green-500">
//               Admin
//             </Link>
//           </div>
//         </div>
//       </section>

//       <div className="side-img relative h-full w-[50%]">
//         <Image
//           src="/assets/images/onboarding-img.png"
//           alt="patient"
//           fill
//           sizes="(max-width: 768px) 100vw, 50vw"
//           className="object-cover"
//           priority
//         />
//       </div>
//     </div>
//   );
// }

import Link from "next/link";
import FullLogo from "@/components/FullLogo";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-124">
          <div className="mb-12">
            <FullLogo />
          </div>

          <div className="space-y-6">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Welcome to DocSync</p>
            <div className="flex gap-4">
              <Link href="/login" className="shad-primary-btn">
                Login
              </Link>
              <Link href="/register" className="shad-secondary-btn">
                Register
              </Link>
            </div>
          </div>

          <p className="text-14-regular py-12">
            © {new Date().getFullYear()} DocSync
          </p>
        </div>
      </section>

      <div className="side-img relative h-full w-[50%]">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="patient"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
