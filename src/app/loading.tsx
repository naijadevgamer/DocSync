// // app/loading.tsx
// import FullLogo from "@/components/FullLogo";
// import { Loader2 } from "lucide-react";

import FullLogo from "@/components/FullLogo";

// export default function Loading() {
//   return (
//     <div className="bg-dark-300 flex min-h-screen items-center justify-center">
//       <div className="text-center">
//         {/* Logo */}
//         <div className="mb-8 flex justify-center">
//           <FullLogo />
//         </div>

//         {/* Loading Animation */}
//         <div className="relative">
//           {/* Pulse Ring */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="h-20 w-20 animate-ping rounded-full bg-green-500/20" />
//           </div>

//           {/* Spinner */}
//           <div className="relative flex items-center justify-center">
//             <Loader2 className="h-12 w-12 animate-spin text-green-500" />
//           </div>
//         </div>

//         {/* Loading Text */}
//         <p className="text-16-medium text-dark-600 mt-8 animate-pulse">
//           Loading your healthcare...
//         </p>

//         {/* Subtle Hint */}
//         <p className="text-12-regular text-dark-500 mt-4">
//           Preparing your personalized experience
//         </p>
//       </div>
//     </div>
//   );
// }

export default function Loading() {
  return (
    <div className="bg-dark-300 flex min-h-screen items-center justify-center">
      <div className="text-center">
        {/* Logo */}

        <div className="mb-8 flex justify-center">
          <FullLogo />
        </div>
        <div className="border-dark-500 relative mx-auto h-16 w-16 animate-spin rounded-full border-2 border-t-green-500" />
        <p className="text-dark-600 mt-4 animate-pulse">Loading...</p>
        {/* Subtle Hint */}
        <p className="text-12-regular text-dark-500 mt-4">
          Preparing your personalized experience{" "}
        </p>
      </div>
    </div>
  );
}
