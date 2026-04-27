"use client";

import FullLogo from "@/components/FullLogo";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppointmentDB, Patient } from "../../types/appwrite.types";

interface DashboardClientProps {
  user: User;
  patient: Patient | null;
  appointments: AppointmentDB[];
}

export default function DashboardClient({
  user,
  patient,
  appointments,
}: DashboardClientProps) {
  const router = useRouter();

  return (
    <div className="bg-dark-300 min-h-screen">
      <header className="admin-header">
        <Link href="/">
          <FullLogo />
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-16-semibold hidden sm:block">{user.name}</p>
          <Button
            variant="ghost"
            className="text-dark-600 hover:text-white"
            onClick={() => router.push("/api/auth/logout")}
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome back, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-dark-700">Manage your appointments and profile.</p>
        </section>

        {!patient ? (
          <div className="bg-dark-400 rounded-2xl p-8 text-center">
            <h2 className="text-24-bold mb-4">Complete Your Profile</h2>
            <p className="text-dark-600 mb-6">
              Please provide your personal and medical information to book
              appointments.
            </p>
            <Button asChild className="shad-primary-btn">
              <Link href={`/patients/${user.$id}/personal-info`}>
                Complete Profile
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <section className="admin-stat">
              <StatCard
                title="Upcoming Appointments"
                value={
                  appointments.filter((a) => a.status === "scheduled").length
                }
                icon="/assets/icons/appointments.svg"
                bgClass="bg-blue-600"
              />
              <StatCard
                title="Pending Requests"
                value={
                  appointments.filter((a) => a.status === "pending").length
                }
                icon="/assets/icons/pending.svg"
                bgClass="bg-yellow-600/20"
              />
              <StatCard
                title="Past Appointments"
                value={
                  appointments.filter((a) => new Date(a.schedule) < new Date())
                    .length
                }
                icon="/assets/icons/history.svg"
                bgClass="bg-dark-400"
              />
            </section>

            <section className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-24-bold">Recent Appointments</h2>
                <Button asChild className="shad-primary-btn">
                  <Link href={`/patients/${user.$id}/new-appointment`}>
                    New Appointment
                  </Link>
                </Button>
              </div>

              {appointments.length === 0 ? (
                <div className="bg-dark-400 rounded-xl p-8 text-center">
                  <p className="text-dark-600">No appointments yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.$id}
                      className="bg-dark-400 flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Image
                          src={
                            Doctors.find(
                              (d) => d.name === appointment.primaryPhysician,
                            )?.image || ""
                          }
                          alt="doctor"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium">
                            Dr. {appointment.primaryPhysician}
                          </p>
                          <p className="text-dark-600 text-sm">
                            {formatDateTime(appointment.schedule).dateTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={appointment.status} />
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/appointments/${appointment.$id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, bgClass }: any) {
  return (
    <div className={`stat-card ${bgClass}`}>
      <div className="flex items-center gap-4">
        <Image src={icon} width={32} height={32} alt={title} />
        <h3 className="text-32-bold">{value}</h3>
      </div>
      <p className="text-14-regular">{title}</p>
    </div>
  );
}
