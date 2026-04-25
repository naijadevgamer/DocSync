import LoginForm from "@/components/forms/LoginForm";
import FullLogo from "@/components/FullLogo";
import Image from "next/image";
import Link from "next/link";

export default async function LoginPage({ searchParams }: SearchParamProps) {
  const { admin, callbackUrl } = await searchParams;
  const isAdminFlow = admin === "true";
  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-124">
          <div className="mb-12">
            <FullLogo />
          </div>

          <LoginForm
            isAdminFlow={isAdminFlow}
            callbackUrl={callbackUrl as string}
          />

          <div className="text-14-regular flex justify-between py-12">
            <p className="text-dark-600 justify-items-end xl:text-left">
              © {new Date().getFullYear()} DocSync
            </p>
            <Link
              href="/login?admin=true"
              className="text-green-500 transition-colors hover:text-green-400"
            >
              Admin
            </Link>
          </div>
        </div>
      </section>

      <div className="side-img relative h-full w-[50%]">
        <Image
          src="/assets/images/onboarding-img.png"
          alt="Healthcare professionals"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="from-dark-300/80 absolute inset-0 bg-linear-to-t to-transparent" />
        <div className="absolute right-12 bottom-12 left-12">
          <blockquote className="space-y-2">
            <q className="text-18-bold block text-white">
              DocSync has transformed how we manage patient care. The efficiency
              gains are remarkable.
            </q>

            <footer className="text-14-regular text-dark-700">
              — Dr. Sarah Johnson, Medical Director
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

// import LoginForm from "@/components/forms/LoginForm";
// import FullLogo from "@/components/FullLogo";
// import Image from "next/image";
// import Link from "next/link";

// export default async function LoginPage({ searchParams }: SearchParamProps) {
//   const { admin } = await searchParams;

//   return (
//     <div className="flex h-screen">
//       <section className="remove-scrollbar container my-auto">
//         <div className="sub-container max-w-[496px]">
//           <div className="mb-12">
//             <FullLogo />
//           </div>

//           <LoginForm />

//           <div className="text-14-regular mt-6 flex justify-between">
//             <p className="text-dark-600">
//               © {new Date().getFullYear()} DocSync
//             </p>
//             <Link href="/?admin=true" className="text-green-500">
//               Admin
//             </Link>
//           </div>
//         </div>
//       </section>

//       <div className="side-img relative hidden h-full w-[50%] md:block">
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

// app/login/page.tsx
// import LoginForm from "@/components/forms/LoginForm";
// import FullLogo from "@/components/FullLogo";
// import Image from "next/image";
// import Link from "next/link";

// export default async function LoginPage({ searchParams }: SearchParamProps) {
//   const { admin, callbackUrl } = await searchParams;
//   const isAdminFlow = admin === "true";

//   return (
//     <div className="flex min-h-screen">
//       {/* Left Side - Form */}
//       <section className="remove-scrollbar container my-auto flex w-full items-center lg:w-[50%]">
//         <div className="sub-container max-w-[496px] mx-auto">
//           <div className="mb-12">
//             <FullLogo />
//           </div>

//           <LoginForm isAdminFlow={isAdminFlow} callbackUrl={callbackUrl as string} />

//           <div className="text-14-regular mt-12 flex flex-col gap-2 sm:flex-row sm:justify-between">
//             <p className="text-dark-600">
//               © {new Date().getFullYear()} DocSync
//             </p>
//             <div className="flex gap-4">
//               <Link
//                 href="/login?admin=true"
//                 className="text-green-500 hover:text-green-400 transition-colors"
//               >
//                 Admin Portal
//               </Link>
//               <Link
//                 href="/register"
//                 className="text-blue-500 hover:text-blue-400 transition-colors"
//               >
//                 Create Account
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Right Side - Image with Overlay */}
//       <div className="side-img relative hidden h-screen w-[50%] lg:block">
//         <Image
//           src="/assets/images/onboarding-img.png"
//           alt="Healthcare professionals"
//           fill
//           sizes="50vw"
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-dark-300/80 to-transparent" />
//         <div className="absolute bottom-12 left-12 right-12">
//           <blockquote className="space-y-2">
//             <p className="text-18-bold text-white">
//               "DocSync has transformed how we manage patient care. The efficiency gains are remarkable."
//             </p>
//             <footer className="text-14-regular text-dark-600">
//               — Dr. Sarah Johnson, Medical Director
//             </footer>
//           </blockquote>
//         </div>
//       </div>
//     </div>
//   );
// }
