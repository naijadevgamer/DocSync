// import PatientForm from "@/components/forms/PatientForm";
// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// export default function Register() {
//   return (
//     <div className="flex h-screen">
//       <section className="remove-scrollbar container my-auto">
//         <div className="sub-container max-w-124">
//           <Image
//             src="/assets/icons/logo-full.svg"
//             height={1000}
//             width={1000}
//             alt="patient"
//             className="mb-12 h-10 w-fit"
//           />

//           <PatientForm />
//           <PatientForm />

//           <div className="text-14-regular mt-20 flex justify-between">
//             <p className="text-dark-600 justify-items-end xl:text-left">
//               © {new Date().getFullYear()} CarePluse
//             </p>
//           </div>
//         </div>
//       </section>

//       <div className="min-h-full max-w-[40%]">
//         <Image
//           src="/assets/images/register-img.png"
//           height={1000}
//           width={1000}
//           alt="patient"
//           className="side-img"
//         />
//       </div>

//       {/* <div className="side-img relative h-full max-w-[50%]">
//         <Image
//           src="/assets/images/onboarding-img.png"
//           alt="patient"
//           fill
//           sizes="(max-width: 768px) 100vw, 50vw"
//           className="object-cover"
//         />
//       </div> */}
//     </div>
//   );
// }

import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";

export default function Register() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-215 flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* <RegisterForm user={user} /> */}

          <PatientForm />
          {/* <PatientForm /> */}

          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-97.5"
      />
    </div>
  );
}
