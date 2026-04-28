// import { getAuthorizedUser } from "@/lib/actions/auth.actions";
// import { getPatient } from "@/lib/actions/patient.actions";
// import { getPatientAppointments } from "@/lib/actions/appointment.action";
// import { notFound, redirect } from "next/navigation";
// import DashboardClient from "@/components/DashBoardClient";
// import { Patient } from "../../../../../types/appwrite.types";
// import { toast } from "sonner";
// // import DashboardClient from "./DashboardClient";

// export default async function DashboardPage({ params }: SearchParamProps) {
//   const { userId } = await params;

//   const user = await getAuthorizedUser(userId);
//   const patientResult = await getPatient(user.$id);
//   const patient = patientResult.success ? patientResult.data?.patient : null;

//   if (!patientResult.success) {
//     console.error(
//       "Error fetching patient:",
//       patientResult.error?.details || patientResult.error,
//     );

//     if (patientResult.error?.code === "404") notFound();

//     toast.error(patientResult.error?.message || "Failed to fetch patient data");
//   }

//   // let appointments = [];
//   // if (patient) {
//   const appts = await getPatientAppointments(patient?.$id as string);
//   const appointments = appts.data ? appts.data.appointments : [];

//   return (
//     <DashboardClient
//       user={user}
//       patient={patientResult.data?.patient as Patient}
//       appointments={appointments}
//     />
//   );
// }

// app/patients/[userId]/dashboard/page.tsx
import FullLogo from "@/components/FullLogo";
import { StatCard } from "@/components/StatsCard";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getPatientAppointments } from "@/lib/actions/appointment.action";
import { getAuthorizedUser } from "@/lib/actions/auth.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import { formatDateTime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  FileText,
  MessageCircle,
  Pill,
  User,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Dashboard({ params }: SearchParamProps) {
  const { userId } = await params;

  const user = await getAuthorizedUser(userId);
  const patientResult = await getPatient(user.$id);

  if (!patientResult.success) {
    if (patientResult.error?.code === "404") notFound();
  }

  const patient = patientResult.data?.patient;
  const appointmentsResult = await getPatientAppointments(
    patient?.$id as string,
  );
  const appointments = appointmentsResult.success
    ? appointmentsResult.data?.appointments || []
    : [];

  console.log("Appointmentsssss", appointmentsResult);

  const upcomingAppointments = appointments
    .filter(
      (apt: any) =>
        apt.status === "scheduled" && new Date(apt.schedule) > new Date(),
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.schedule).getTime() - new Date(b.schedule).getTime(),
    );

  const recentAppointments = appointments
    .filter(
      (apt: any) => apt.status === "pending" || apt.status === "cancelled",
    )
    .slice(0, 5);

  const pendingAppointments = appointments.filter(
    (apt: any) => apt.status === "pending",
  );
  const cancelledAppointments = appointments.filter(
    (apt: any) => apt.status === "cancelled",
  );

  const pastAppointments = appointments.filter(
    (a) => new Date(a.schedule) < new Date(),
  );

  const quickStats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: "/assets/icons/total.svg",
      type: "appointments",
    },
    {
      label: "Upcoming Appointments",
      value: upcomingAppointments.length,
      icon: "/assets/icons/appointments.svg",
      type: "appointments",
    },
    {
      label: "Pending Requests",
      value: pendingAppointments.length,
      icon: "/assets/icons/pending.svg",
      type: "pending",
    },
    {
      label: "Cancelled",
      value: cancelledAppointments.length,
      icon: "/assets/icons/cancelled.svg",
      type: "cancelled",
    },
    {
      label: "Past Appointments",
      value: pastAppointments.length,
      icon: "/assets/icons/past.svg",
      type: "cancelled",
    },
  ];

  return (
    <div className="bg-dark-300 min-h-screen">
      {/* Header */}
      <header className="bg-dark-300/95 border-dark-400 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2">
            <Link href="/">
              <FullLogo />
            </Link>
            {/* <FaClockRotateLeft /> */}

            <div className="flex items-center gap-2">
              <span className="text-dark-700">Dashboard</span>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <User className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="mb-8 space-y-4">
          <h1 className="header">
            Welcome back, {patient?.gender === "male" ? "Mr." : "Ms."}{" "}
            {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-dark-700">Manage your appointments and profile.</p>
        </section>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              count={stat.value}
              icon={stat.icon}
              type={stat.type as "appointments" | "pending" | "cancelled"}
            />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="space-y-8 lg:col-span-2">
            {/* Upcoming Appointments */}
            <section className="bg-dark-400 border-dark-500 rounded-xl border p-3 md:p-6">
              <div className="mb-6 flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  Upcoming Appointments
                </h2>
                <Button asChild className="shad-primary-btn">
                  <Link href={`/patients/${user.$id}/new-appointment`}>
                    New Appointment
                  </Link>
                </Button>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.slice(0, 3).map((apt: any) => (
                    // <div
                    //   key={apt.$id}
                    //   className="bg-dark-300 flex items-center gap-4 rounded-lg p-4"
                    // >
                    //   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                    //     <Calendar className="h-6 w-6 text-blue-500" />
                    //   </div>
                    //   <div className="flex-1">
                    //     <p className="text-16-semibold text-white">
                    //       {apt.primaryPhysician}
                    //     </p>
                    //     <p className="text-14-regular text-dark-600">
                    //       {new Date(apt.schedule).toLocaleDateString()} at{" "}
                    //       {new Date(apt.schedule).toLocaleTimeString([], {
                    //         hour: "2-digit",
                    //         minute: "2-digit",
                    //       })}
                    //     </p>
                    //   </div>
                    //   <span className="status-badge bg-green-500/10 text-green-500">
                    //     {apt.status}
                    //   </span>
                    // </div>
                    <div
                      key={apt.$id}
                      className="bg-dark-300 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            Doctors.find((d) => d.name === apt.primaryPhysician)
                              ?.image || ""
                          }
                          alt="doctor"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">
                            Dr. {apt.primaryPhysician}
                          </p>
                          <p className="text-dark-600 text-sm">
                            {formatDateTime(apt.schedule).dateTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={apt.status} />
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="hover:bg-dark-500"
                        >
                          <Link
                            href={`/patients/${user.$id}/new-appointment/success?appointmentId=${apt.$id}`}
                          >
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // <div className="bg-dark-400 rounded-xl p-8 text-center">
                //   <p className="text-dark-600">No appointments yet.</p>
                // </div>
                <div className="py-12 text-center">
                  <Calendar className="text-dark-500 mx-auto mb-4 h-12 w-12" />
                  <p className="text-dark-600 mb-4">No upcoming appointments</p>
                  <Link
                    href={`/patients/${userId}/new-appointment`}
                    className="shad-primary-btn inline-block rounded-lg px-6 py-2"
                  >
                    Schedule Appointment
                  </Link>
                </div>
              )}
            </section>

            {/* Recent Activity */}
            <section className="bg-dark-400 border-dark-500 rounded-xl border p-3 md:p-6">
              <h2 className="mb-6 text-xl font-medium text-white md:text-2xl md:font-bold">
                Recent Activity
              </h2>
              {recentAppointments.length > 0 ? (
                <div className="divide-dark-500 divide-y">
                  {recentAppointments.map((apt: any) => (
                    <div
                      key={apt.$id}
                      className="flex items-center gap-3 py-2 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-14 text-white">
                          Appointment with Dr. {apt.primaryPhysician}
                        </p>
                        <p className="text-12-regular text-dark-600">
                          {formatDateTime(apt.schedule).dateTime}
                        </p>
                      </div>

                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-600 py-8 text-center">
                  No recent activity
                </p>
              )}
            </section>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Patient Profile */}
            <section className="bg-dark-400 border-dark-500 rounded-xl border p-3 md:p-6">
              <h2 className="text-18-bold mb-4 text-white">Your Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <User className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-14-medium text-white">{user?.name}</p>
                    <p className="text-12-regular text-dark-600">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/patients/${userId}/profile`}
                  className="text-14-medium mt-4 block text-blue-500 hover:text-blue-400"
                >
                  Edit Profile →
                </Link>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="bg-dark-400 border-dark-500 rounded-xl border p-3 md:p-6">
              <h2 className="text-18-bold mb-4 text-white">Quick Actions</h2>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href(userId)}
                    className="hover:bg-dark-300 group flex items-center gap-3 rounded-lg p-3 transition-colors"
                  >
                    <action.icon className="text-dark-600 h-5 w-5 transition-colors group-hover:text-green-500" />
                    <span className="text-14-medium text-dark-600 transition-colors group-hover:text-white">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Health Reminders */}
            <section className="rounded-xl border border-green-500/20 bg-linear-to-br from-green-500/10 to-blue-500/10 p-3 md:p-6">
              <h2 className="text-18-bold mb-2 text-white">Health Reminder</h2>
              <p className="text-14-regular text-dark-600 mb-4">
                Don't forget to schedule your annual check-up!
              </p>
              <Link
                href={`/patients/${userId}/new-appointment`}
                className="text-14-medium text-green-500 hover:text-green-400"
              >
                Book Now →
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

const quickActions = [
  {
    label: "Book Appointment",
    icon: Calendar,
    href: (userId: string) => `/patients/${userId}/new-appointment`,
  },
  {
    label: "View Medical Records",
    icon: FileText,
    href: (userId: string) => `/patients/${userId}/records`,
  },
  {
    label: "Message Doctor",
    icon: MessageCircle,
    href: (userId: string) => `/patients/${userId}/messages`,
  },
  {
    label: "Prescriptions",
    icon: Pill,
    href: (userId: string) => `/patients/${userId}/prescriptions`,
  },
];
