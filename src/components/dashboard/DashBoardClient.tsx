// // // "use client";

// // // import FullLogo from "@/components/FullLogo";
// // // import StatusBadge from "@/components/StatusBadge";
// // // import { Button } from "@/components/ui/button";
// // // import { Doctors } from "@/constants";
// // // import { formatDateTime } from "@/lib/utils";
// // // import Image from "next/image";
// // // import Link from "next/link";
// // // import { useRouter } from "next/navigation";
// // // import { AppointmentDB, Patient } from "../../types/appwrite.types";

// // // interface DashboardClientProps {
// // //   user: User;
// // //   patient: Patient | null;
// // //   appointments: AppointmentDB[];
// // // }

// // // export default function DashboardClient({
// // //   user,
// // //   patient,
// // //   appointments,
// // // }: DashboardClientProps) {
// // //   const router = useRouter();

// // //   return (
// // //     <div className="bg-dark-300 min-h-screen">
// // //       <header className="admin-header">
// // //         <Link href="/">
// // //           <FullLogo />
// // //         </Link>
// // //         <div className="flex items-center gap-4">
// // //           <p className="text-16-semibold hidden sm:block">{user.name}</p>
// // //           <Button
// // //             variant="ghost"
// // //             className="text-dark-600 hover:text-white"
// // //             onClick={() => router.push("/api/auth/logout")}
// // //           >
// // //             Logout
// // //           </Button>
// // //         </div>
// // //       </header>

// // //       <main className="admin-main">
// // //         <section className="w-full space-y-4">
// // //           <h1 className="header">Welcome back, {user.name.split(" ")[0]} 👋</h1>
// // //           <p className="text-dark-700">Manage your appointments and profile.</p>
// // //         </section>

// // //         {!patient ? (
// // //           <div className="bg-dark-400 rounded-2xl p-8 text-center">
// // //             <h2 className="text-24-bold mb-4">Complete Your Profile</h2>
// // //             <p className="text-dark-600 mb-6">
// // //               Please provide your personal and medical information to book
// // //               appointments.
// // //             </p>
// // //             <Button asChild className="shad-primary-btn">
// // //               <Link href={`/patients/${user.$id}/personal-info`}>
// // //                 Complete Profile
// // //               </Link>
// // //             </Button>
// // //           </div>
// // //         ) : (
// // //           <>
// // //             <section className="admin-stat">
// // //               <StatCard
// // //                 title="Upcoming Appointments"
// // //                 value={
// // //                   appointments.filter((a) => a.status === "scheduled").length
// // //                 }
// // //                 icon="/assets/icons/appointments.svg"
// // //                 bgClass="bg-blue-600"
// // //               />
// // //               <StatCard
// // //                 title="Pending Requests"
// // //                 value={
// // //                   appointments.filter((a) => a.status === "pending").length
// // //                 }
// // //                 icon="/assets/icons/pending.svg"
// // //                 bgClass="bg-yellow-600/20"
// // //               />
// // //               <StatCard
// // //                 title="Past Appointments"
// // //                 value={
// // //                   appointments.filter((a) => new Date(a.schedule) < new Date())
// // //                     .length
// // //                 }
// // //                 icon="/assets/icons/history.svg"
// // //                 bgClass="bg-dark-400"
// // //               />
// // //             </section>

// // //             <section className="w-full space-y-4">
// // //               <div className="flex items-center justify-between">
// // //                 <h2 className="text-24-bold">Recent Appointments</h2>
// // //                 <Button asChild className="shad-primary-btn">
// // //                   <Link href={`/patients/${user.$id}/new-appointment`}>
// // //                     New Appointment
// // //                   </Link>
// // //                 </Button>
// // //               </div>

// // //               {appointments.length === 0 ? (
// // //                 <div className="bg-dark-400 rounded-xl p-8 text-center">
// // //                   <p className="text-dark-600">No appointments yet.</p>
// // //                 </div>
// // //               ) : (
// // //                 <div className="space-y-4">
// // //                   {appointments.slice(0, 5).map((appointment) => (
// // //                     <div
// // //                       key={appointment.$id}
// // //                       className="bg-dark-400 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
// // //                     >
// // //                       <div className="flex items-center gap-4">
// // //                         <Image
// // //                           src={
// // //                             Doctors.find(
// // //                               (d) => d.name === appointment.primaryPhysician,
// // //                             )?.image || ""
// // //                           }
// // //                           alt="doctor"
// // //                           width={48}
// // //                           height={48}
// // //                           className="rounded-full"
// // //                         />
// // //                         <div>
// // //                           <p className="font-medium">
// // //                             Dr. {appointment.primaryPhysician}
// // //                           </p>
// // //                           <p className="text-dark-600 text-sm">
// // //                             {formatDateTime(appointment.schedule).dateTime}
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                       <div className="flex items-center gap-4">
// // //                         <StatusBadge status={appointment.status} />
// // //                         <Button variant="outline" size="sm" asChild>
// // //                           <Link href={`/appointments/${appointment.$id}`}>
// // //                             View
// // //                           </Link>
// // //                         </Button>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </section>
// // //           </>
// // //         )}
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // function StatCard({ title, value, icon, bgClass }: any) {
// // //   return (
// // //     <div className={`stat-card ${bgClass}`}>
// // //       <div className="flex items-center gap-4">
// // //         <Image src={icon} width={32} height={32} alt={title} />
// // //         <h3 className="text-32-bold">{value}</h3>
// // //       </div>
// // //       <p className="text-14-regular">{title}</p>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useState } from "react";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Button } from "@/components/ui/button";
// // import { logoutUser } from "@/lib/actions/auth.actions";
// // import { useRouter } from "next/navigation";
// // import { toast } from "sonner";
// // import Link from "next/link";
// // import Image from "next/image";
// // import { Calendar, FileText, User, Settings, LogOut } from "lucide-react";
// // import FullLogo from "@/components/FullLogo";
// // import StatusBadge from "@/components/StatusBadge";
// // import { formatDateTime } from "@/lib/utils";
// // import { Doctors } from "@/constants";
// // // import { Patient, User as UserType } from "@/types/appwrite.types";
// // import { AppointmentUI, Patient } from "../../types/appwrite.types";
// // import { StatCard } from "./StatsCard";
// // import { Field } from "./ui/field";
// // // import { AppointmentUI } from "@/types/appwrite.types";
// // // import UpdateProfileModal from "./UpdateProfileModal";

// // interface DashboardClientProps {
// //   user: any;
// //   patient: any;
// //   appointments: any;
// // }

// // export default function DashboardClient({
// //   user,
// //   patient,
// //   appointments,
// // }: DashboardClientProps) {
// //   const router = useRouter();
// //   const [showProfileModal, setShowProfileModal] = useState(false);

// //   const handleLogout = async () => {
// //     const res = await logoutUser();
// //     if (res?.success) {
// //       router.push("/login");
// //     } else {
// //       toast.error("Logout failed");
// //     }
// //   };

// //   const upcoming = appointments.filter(
// //     (a: any) => a.status === "scheduled" && new Date(a.schedule) > new Date(),
// //   );
// //   const pending = appointments.filter((a: any) => a.status === "pending");
// //   const cancelled = appointments.filter((a: any) => a.status === "cancelled");

// //   return (
// //     <div className="bg-dark-300 min-h-screen">
// //       <header className="admin-header">
// //         <Link href="/">
// //           <FullLogo />
// //         </Link>
// //         <div className="flex items-center gap-4">
// //           <span className="text-16-semibold hidden sm:block">{user.name}</span>
// //           <Button variant="ghost" size="icon" onClick={handleLogout}>
// //             <LogOut className="h-5 w-5" />
// //           </Button>
// //         </div>
// //       </header>

// //       <main className="container mx-auto max-w-7xl px-4 py-8">
// //         <h1 className="header mb-8">Welcome, {user.name.split(" ")[0]} 👋</h1>

// //         <Tabs defaultValue="overview" className="w-full">
// //           <TabsList className="bg-dark-400 mb-8">
// //             <TabsTrigger value="overview">Overview</TabsTrigger>
// //             <TabsTrigger value="appointments">Appointments</TabsTrigger>
// //             <TabsTrigger value="records">Medical Records</TabsTrigger>
// //             <TabsTrigger value="settings">Profile & Settings</TabsTrigger>
// //           </TabsList>

// //           <TabsContent value="overview">
// //             <div className="grid gap-6 lg:grid-cols-3">
// //               {/* Stats cards */}
// //               <StatCard
// //                 label="Upcoming"
// //                 count={upcoming.length}
// //                 icon="/assets/icons/appointments.svg"
// //                 type="appointments"
// //               />
// //               <StatCard
// //                 label="Pending"
// //                 count={pending.length}
// //                 icon="/assets/icons/pending.svg"
// //                 type="pending"
// //               />
// //               <StatCard
// //                 label="Cancelled"
// //                 count={cancelled.length}
// //                 icon="/assets/icons/cancelled.svg"
// //                 type="cancelled"
// //               />
// //             </div>
// //             <div className="mt-8">
// //               <h2 className="text-24-bold mb-4">Upcoming Appointments</h2>
// //               {/* ... list similar to previous but with doctor images */}
// //             </div>
// //           </TabsContent>

// //           {/* Appointments tab: list all, filter, etc. */}
// //           <TabsContent value="appointments">
// //             {/* <AppointmentsList appointments={appointments} userId={user.$id} /> */}
// //           </TabsContent>

// //           <TabsContent value="records">
// //             {patient ? (
// //               // <MedicalRecordsView patient={patient} />
// //               <div></div>
// //             ) : (
// //               <div className="py-12 text-center">
// //                 <FileText className="text-dark-500 mx-auto mb-4 h-12 w-12" />
// //                 <p className="text-dark-600">
// //                   Complete your personal info to access records.
// //                 </p>
// //               </div>
// //             )}
// //           </TabsContent>

// //           <TabsContent value="settings">
// //             <div className="mx-auto max-w-md space-y-6">
// //               <div className="bg-dark-400 rounded-xl p-6">
// //                 <h3 className="text-18-bold mb-4">Profile Information</h3>
// //                 <div className="space-y-3">
// //                   {/* <Field label="Name" value={user.name} />
// //                   <Field label="Email" value={user.email} />
// //                   <Field label="Phone" value={user.phone} /> */}
// //                   <Button
// //                     onClick={() => setShowProfileModal(true)}
// //                     className="shad-primary-btn mt-4"
// //                   >
// //                     Edit Profile
// //                   </Button>
// //                 </div>
// //               </div>
// //               <div className="bg-dark-400 rounded-xl p-6">
// //                 <h3 className="text-18-bold mb-4">Security</h3>
// //                 <Button
// //                   variant="outline"
// //                   className="w-full"
// //                   onClick={() => router.push("/forgot-password")}
// //                 >
// //                   Change Password
// //                 </Button>
// //               </div>
// //               <Button
// //                 variant="ghost"
// //                 className="w-full text-red-500"
// //                 onClick={handleLogout}
// //               >
// //                 Sign Out
// //               </Button>
// //             </div>
// //           </TabsContent>
// //         </Tabs>
// //       </main>

// //       {/* <UpdateProfileModal
// //         open={showProfileModal}
// //         onClose={() => setShowProfileModal(false)}
// //         user={user}
// //         patient={patient}
// //       /> */}
// //     </div>
// //   );
// // }

// // app/patients/[userId]/dashboard/DashboardClient.tsx
// "use client";

// import { useState } from "react";
// import FullLogo from "@/components/FullLogo";
// import { StatCard } from "@/components/StatsCard";
// import StatusBadge from "@/components/StatusBadge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Doctors } from "@/constants";
// import { formatDateTime } from "@/lib/utils";
// import { logoutUser } from "@/lib/actions/auth.actions";
// import {
//   Calendar,
//   Clock,
//   FileText,
//   User,
//   Settings,
//   LogOut,
//   ChevronRight,
//   Edit3,
//   Bell,
//   Activity,
//   Shield,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// // import PatientProfileForm from "@/components/forms/PatientProfileForm";

// export default function DashboardClient({ user, patient, appointments }: any) {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState("overview");

//   const upcomingAppointments = appointments
//     .filter(
//       (apt: any) =>
//         apt.status === "scheduled" && new Date(apt.schedule) > new Date(),
//     )
//     .sort(
//       (a: any, b: any) =>
//         new Date(a.schedule).getTime() - new Date(b.schedule).getTime(),
//     );

//   const recentAppointments = appointments
//     .filter(
//       (apt: any) => apt.status === "pending" || apt.status === "cancelled",
//     )
//     .slice(0, 5);

//   const pendingAppointments = appointments.filter(
//     (apt: any) => apt.status === "pending",
//   );
//   const cancelledAppointments = appointments.filter(
//     (apt: any) => apt.status === "cancelled",
//   );
//   const pastAppointments = appointments.filter(
//     (a: any) => new Date(a.schedule) < new Date(),
//   );

//   const quickStats = [
//     {
//       label: "Total",
//       value: appointments.length,
//       icon: "/assets/icons/total.svg",
//       type: "appointments",
//     },
//     {
//       label: "Upcoming",
//       value: upcomingAppointments.length,
//       icon: "/assets/icons/appointments.svg",
//       type: "appointments",
//     },
//     {
//       label: "Pending",
//       value: pendingAppointments.length,
//       icon: "/assets/icons/pending.svg",
//       type: "pending",
//     },
//     {
//       label: "Cancelled",
//       value: cancelledAppointments.length,
//       icon: "/assets/icons/cancelled.svg",
//       type: "cancelled",
//     },
//     {
//       label: "Past",
//       value: pastAppointments.length,
//       icon: "/assets/icons/past.svg",
//       type: "cancelled",
//     },
//   ];

//   const handleLogout = async () => {
//     const result = await logoutUser();
//     if (!result.success) {
//       toast.error("Logout failed");
//       return;
//     }
//     router.push("/login");
//   };

//   return (
//     <div className="bg-dark-300 min-h-screen">
//       {/* Header */}
//       <header className="bg-dark-300/95 border-dark-400 sticky top-0 z-40 border-b backdrop-blur-sm">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between">
//             <Link href="/">
//               <FullLogo />
//             </Link>

//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="text-dark-600 hover:text-white"
//               >
//                 <Bell className="h-5 w-5" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 onClick={handleLogout}
//                 className="text-dark-600 hover:text-red-500"
//               >
//                 <LogOut className="mr-2 h-5 w-5" />
//                 <span className="hidden sm:inline">Logout</span>
//               </Button>
//               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
//                 <User className="h-4 w-4 text-green-500" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         {/* Welcome */}
//         <section className="mb-8 space-y-4">
//           <h1 className="header">
//             Welcome back, {patient?.gender === "male" ? "Mr." : "Ms."}{" "}
//             {user.name.split(" ")[0]} 👋
//           </h1>
//           <p className="text-dark-700">Manage your appointments and profile.</p>
//         </section>

//         {/* Tabs Navigation */}
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="space-y-8"
//         >
//           <TabsList className="bg-dark-400 border-dark-500 inline-flex gap-1 rounded-xl border p-1">
//             <TabsTrigger
//               value="overview"
//               className="text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white"
//             >
//               <Activity className="inline h-4 w-4" />
//               <span className="hidden sm:inline">Overview</span>
//             </TabsTrigger>
//             <TabsTrigger
//               value="appointments"
//               className="text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white"
//             >
//               <Calendar className="inline h-4 w-4" />
//               <span className="hidden sm:inline">Appointments</span>
//             </TabsTrigger>
//             <TabsTrigger
//               value="profile"
//               className="text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white"
//             >
//               <User className="inline h-4 w-4" />
//               <span className="hidden sm:inline">Profile</span>
//             </TabsTrigger>
//             <TabsTrigger
//               value="settings"
//               className="text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-4 py-2 transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white"
//             >
//               <Settings className="inline h-4 w-4" />
//               <span className="hidden sm:inline">Settings</span>
//             </TabsTrigger>
//           </TabsList>

//           {/* Overview Tab */}
//           <TabsContent value="overview" className="space-y-8">
//             <h2 className="text-24-bold text-white">Overview</h2>
//             {/* Stats */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
//               {quickStats.map((stat, i) => (
//                 <StatCard
//                   key={i}
//                   label={stat.label}
//                   count={stat.value}
//                   icon={stat.icon}
//                   type={stat.type as any}
//                 />
//               ))}
//             </div>

//             <div className="grid gap-8 lg:grid-cols-2">
//               {/* Upcoming Appointments */}
//               <div className="bg-dark-400 border-dark-500 rounded-xl border p-4 sm:p-6">
//                 <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//                   <h2 className="text-xl font-bold text-white">Upcoming</h2>

//                   <Button asChild className="shad-primary-btn" size="sm">
//                     <Link href={`/patients/${user.$id}/new-appointment`}>
//                       Book New
//                     </Link>
//                   </Button>
//                 </div>

//                 {upcomingAppointments.length > 0 ? (
//                   <div className="space-y-3">
//                     {upcomingAppointments.slice(0, 3).map((apt: any) => (
//                       <div
//                         key={apt.$id}
//                         className="bg-dark-300 flex flex-col gap-4 rounded-lg p-4 min-[410px]:flex-row min-[410px]:items-center"
//                       >
//                         <div className="flex items-center gap-3">
//                           <Image
//                             src={
//                               Doctors.find(
//                                 (d) => d.name === apt.primaryPhysician,
//                               )?.image || ""
//                             }
//                             alt="doctor"
//                             width={48}
//                             height={48}
//                             className="rounded-full"
//                           />

//                           <div>
//                             <p className="font-medium text-white">
//                               Dr. {apt.primaryPhysician}
//                             </p>

//                             <p className="text-dark-600 wrap-break text-sm">
//                               {formatDateTime(apt.schedule).dateTime}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="min-[410px]:ml-auto">
//                           <StatusBadge status={apt.status} />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="py-12 text-center">
//                     <Calendar className="text-dark-500 mx-auto mb-4 h-12 w-12" />

//                     <p className="text-dark-600 mb-4">
//                       No upcoming appointments
//                     </p>

//                     <Link
//                       href={`/patients/${user.$id}/new-appointment`}
//                       className="shad-primary-btn inline-block rounded-lg px-6 py-2"
//                     >
//                       Schedule Now
//                     </Link>
//                   </div>
//                 )}
//               </div>

//               {/* Recent Activity */}
//               <div className="bg-dark-400 border-dark-500 rounded-xl border p-4 min-[410px]:p-6">
//                 <h2 className="mb-6 text-xl font-bold text-white">
//                   Recent Activity
//                 </h2>

//                 {recentAppointments.length > 0 ? (
//                   <div className="divide-dark-500 divide-y">
//                     {recentAppointments.map((apt: any) => (
//                       <div
//                         key={apt.$id}
//                         className="flex flex-col gap-3 py-4 min-[410px]:flex-row min-[410px]:items-center"
//                       >
//                         <div className="flex items-start gap-3">
//                           <Clock className="mt-1 h-4 w-4 shrink-0 text-green-500" />

//                           <div>
//                             <p className="text-14 text-white">
//                               Dr. {apt.primaryPhysician}
//                             </p>

//                             <p className="text-12-regular text-dark-600 wrap-break">
//                               {formatDateTime(apt.schedule).dateTime}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="min-[410px]:ml-auto">
//                           <StatusBadge status={apt.status} />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-dark-600 py-8 text-center">
//                     No recent activity
//                   </p>
//                 )}
//               </div>
//             </div>
//           </TabsContent>

//           {/* Appointments Tab */}
//           <TabsContent value="appointments" className="space-y-6">
//             <div className="flex items-center justify-between">
//               <h2 className="text-24-bold text-white">All Appointments</h2>
//               <Button asChild className="shad-primary-btn">
//                 <Link href={`/patients/${user.$id}/new-appointment`}>
//                   New Appointment
//                 </Link>
//               </Button>
//             </div>

//             {appointments.length > 0 ? (
//               <div className="bg-dark-400 border-dark-500 overflow-hidden rounded-xl border">
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-dark-200">
//                       <tr>
//                         <th className="text-14-medium text-dark-600 p-4 text-left">
//                           Doctor
//                         </th>
//                         <th className="text-14-medium text-dark-600 p-4 text-left">
//                           Date & Time
//                         </th>
//                         <th className="text-14-medium text-dark-600 p-4 text-left">
//                           Status
//                         </th>
//                         <th className="text-14-medium text-dark-600 p-4 text-left">
//                           Reason
//                         </th>
//                         <th className="text-14-medium text-dark-600 p-4 text-left">
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-dark-500 divide-y">
//                       {appointments.map((apt: any) => (
//                         <tr
//                           key={apt.$id}
//                           className="hover:bg-dark-300 transition-colors"
//                         >
//                           <td className="p-4">
//                             <div className="flex items-center gap-3">
//                               <Image
//                                 src={
//                                   Doctors.find(
//                                     (d) => d.name === apt.primaryPhysician,
//                                   )?.image || ""
//                                 }
//                                 alt="doctor"
//                                 width={32}
//                                 height={32}
//                                 className="rounded-full"
//                               />
//                               <span className="text-14-medium text-white">
//                                 Dr. {apt.primaryPhysician}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="text-14-regular text-dark-600 p-4">
//                             {formatDateTime(apt.schedule).dateTime}
//                           </td>
//                           <td className="p-4">
//                             <StatusBadge status={apt.status} />
//                           </td>
//                           <td className="text-14-regular text-dark-600 p-4">
//                             {apt.reason || "—"}
//                           </td>
//                           <td className="p-4">
//                             <Button variant="ghost" size="sm" asChild>
//                               <Link
//                                 href={`/patients/${user.$id}/new-appointment/success?appointmentId=${apt.$id}`}
//                               >
//                                 View <ChevronRight className="ml-1 h-4 w-4" />
//                               </Link>
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-dark-400 border-dark-500 rounded-xl border p-12 text-center">
//                 <Calendar className="text-dark-500 mx-auto mb-4 h-12 w-12" />
//                 <p className="text-dark-600 mb-4">No appointments yet</p>
//                 <Link
//                   href={`/patients/${user.$id}/new-appointment`}
//                   className="shad-primary-btn inline-block rounded-lg px-6 py-2"
//                 >
//                   Book Your First Appointment
//                 </Link>
//               </div>
//             )}
//           </TabsContent>

//           {/* Profile Tab */}
//           <TabsContent value="profile">
//             <div className="mx-auto max-w-4xl">
//               <div className="mb-8 flex items-center justify-between">
//                 <h2 className="text-24-bold text-white">
//                   Personal Information
//                 </h2>
//                 <Button
//                   variant="outline"
//                   className="border-dark-500 text-dark-600"
//                 >
//                   <Edit3 className="mr-2 h-4 w-4" />
//                   Edit Profile
//                 </Button>
//               </div>

//               <div className="grid gap-6 md:grid-cols-2">
//                 <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
//                   <h3 className="text-18-bold text-white">Basic Information</h3>
//                   <div className="space-y-3">
//                     {[
//                       { label: "Full Name", value: patient?.name },
//                       { label: "Email", value: patient?.email },
//                       { label: "Phone", value: patient?.phone },
//                       { label: "Gender", value: patient?.gender },
//                       {
//                         label: "Date of Birth",
//                         value: formatDateTime(patient?.birthDate).dateOnly,
//                       },
//                       { label: "Address", value: patient?.address },
//                       { label: "Occupation", value: patient?.occupation },
//                     ].map((item, i) => (
//                       <div
//                         key={i}
//                         className="border-dark-500 flex items-center justify-between border-b py-2 last:border-0"
//                       >
//                         <span className="text-14-regular text-dark-600">
//                           {item.label}
//                         </span>
//                         <span className="text-14-medium text-white capitalize">
//                           {item.value || "—"}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-6">
//                   <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
//                     <h3 className="text-18-bold text-white">
//                       Medical Information
//                     </h3>
//                     <div className="space-y-3">
//                       {[
//                         {
//                           label: "Primary Physician",
//                           value: patient?.primaryPhysician,
//                         },
//                         {
//                           label: "Insurance Provider",
//                           value: patient?.insuranceProvider,
//                         },
//                         {
//                           label: "Policy Number",
//                           value: patient?.insurancePolicyNumber,
//                         },
//                         {
//                           label: "Allergies",
//                           value: patient?.allergies || "None",
//                         },
//                         {
//                           label: "Current Medications",
//                           value: patient?.currentMedication || "None",
//                         },
//                       ].map((item, i) => (
//                         <div
//                           key={i}
//                           className="border-dark-500 flex items-center justify-between border-b py-2 last:border-0"
//                         >
//                           <span className="text-14-regular text-dark-600">
//                             {item.label}
//                           </span>
//                           <span className="text-14-medium text-white">
//                             {item.value || "—"}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
//                     <h3 className="text-18-bold text-white">
//                       Emergency Contact
//                     </h3>
//                     <div className="space-y-3">
//                       {[
//                         {
//                           label: "Contact Name",
//                           value: patient?.emergencyContactName,
//                         },
//                         {
//                           label: "Contact Number",
//                           value: patient?.emergencyContactNumber,
//                         },
//                       ].map((item, i) => (
//                         <div
//                           key={i}
//                           className="border-dark-500 flex items-center justify-between border-b py-2 last:border-0"
//                         >
//                           <span className="text-14-regular text-dark-600">
//                             {item.label}
//                           </span>
//                           <span className="text-14-medium text-white">
//                             {item.value || "—"}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Settings Tab */}
//           <TabsContent value="settings">
//             <div className="mx-auto max-w-2xl space-y-6">
//               <h2 className="text-24-bold text-white">Account Settings</h2>

//               <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
//                 <h3 className="text-18-bold text-white">Security</h3>
//                 <div className="space-y-3">
//                   <Button
//                     variant="outline"
//                     className="border-dark-500 text-dark-600 w-full justify-start"
//                     asChild
//                   >
//                     <Link href="/change-password">
//                       <Shield className="mr-3 h-5 w-5" />
//                       Change Password
//                     </Link>
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="border-dark-500 text-dark-600 w-full justify-start"
//                   >
//                     <Bell className="mr-3 h-5 w-5" />
//                     Notification Preferences
//                   </Button>
//                 </div>
//               </div>

//               <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
//                 <h3 className="text-18-bold text-white">Data & Privacy</h3>
//                 <div className="space-y-3">
//                   <Button
//                     variant="outline"
//                     className="border-dark-500 text-dark-600 w-full justify-start"
//                   >
//                     <FileText className="mr-3 h-5 w-5" />
//                     Download My Data
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="border-dark-500 w-full justify-start text-red-500 hover:bg-red-500/10"
//                   >
//                     <LogOut className="mr-3 h-5 w-5" />
//                     Delete Account
//                   </Button>
//                 </div>
//               </div>

//               <Button
//                 variant="destructive"
//                 className="w-full bg-red-600 hover:bg-red-700"
//                 onClick={handleLogout}
//               >
//                 <LogOut className="mr-2 h-5 w-5" />
//                 Logout from Account
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }

// components/dashboard/DashBoardClient.tsx
"use client";

import { useState } from "react";
import FullLogo from "@/components/FullLogo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logoutUser } from "@/lib/actions/auth.actions";
import {
  Activity,
  Calendar,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Import tab components
import OverviewTab from "./tabs/OverviewTab";
import AppointmentsTab from "./tabs/AppointmentsTab";
import ProfileTab from "./tabs/ProfileTab";
import SettingsTab from "./tabs/SettingsTab";
import MobileNav from "./MobileNav";

export default function DashboardClient({ user, patient, appointments }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (!result.success) {
      toast.error("Logout failed");
      return;
    }
    router.push("/login");
  };

  return (
    <div className="bg-dark-300 min-h-screen">
      {/* Header - Consistent with Home page */}
      <header className="bg-dark-300/95 border-dark-400 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="shrink-0">
              <FullLogo />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/"
                className="text-dark-600 hover:bg-dark-500/70 rounded-full px-4 py-2 text-sm transition-colors hover:text-white"
              >
                Home
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="text-dark-600 hover:text-white"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-dark-600 hover:text-red-500"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Logout</span>
              </Button>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <User className="h-4 w-4 text-green-500" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <MobileNav
            user={user}
            onClose={() => setMobileMenuOpen(false)}
            onLogout={handleLogout}
          />
        )}
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8 space-y-4">
          <h1 className="header">
            Welcome back, {patient?.gender === "male" ? "Mr." : "Ms."}{" "}
            {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-dark-700">Manage your appointments and profile.</p>
        </section>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="bg-dark-400 border-dark-500 inline-flex w-full gap-1 overflow-x-auto rounded-xl border p-1">
            <TabsTrigger
              value="overview"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <Activity className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <Calendar className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <User className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-12-medium sm:text-14-medium hover:bg-dark-500 text-dark-600 rounded-lg px-3 py-2 whitespace-nowrap transition-all data-[state=active]:bg-green-500 data-[state=active]:text-white sm:px-4"
            >
              <Settings className="inline h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab
              user={user}
              patient={patient}
              appointments={appointments}
            />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab user={user} appointments={appointments} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab user={user} patient={patient} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab user={user} patient={patient} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
