"use client";

import { StatCard } from "@/components/utils/StatsCard";
import StatusBadge from "@/components/utils/StatusBadge";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OverviewTab({ user, patient, appointments }: any) {
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
    (a: any) => new Date(a.schedule) < new Date(),
  );

  const quickStats = [
    {
      label: "Total",
      value: appointments.length,
      icon: "/assets/icons/total.svg",
      type: "appointments",
    },
    {
      label: "Upcoming",
      value: upcomingAppointments.length,
      icon: "/assets/icons/appointments.svg",
      type: "appointments",
    },
    {
      label: "Pending",
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
      label: "Past",
      value: pastAppointments.length,
      icon: "/assets/icons/past.svg",
      type: "cancelled",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {quickStats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            count={stat.value}
            icon={stat.icon}
            type={stat.type as any}
          />
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <div className="bg-dark-400 border-dark-500 rounded-xl border p-4 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">Upcoming</h2>
            <Button asChild className="shad-primary-btn" size="sm">
              <Link href={`/patients/${user.$id}/new-appointment`}>
                Book New
              </Link>
            </Button>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map((apt: any) => (
                <div
                  key={apt.$id}
                  className="bg-dark-300 flex flex-col gap-4 rounded-lg p-4 min-[410px]:flex-row min-[410px]:items-center"
                >
                  <div className="flex items-center gap-3">
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
                      <p className="font-medium text-white">
                        Dr. {apt.primaryPhysician}
                      </p>
                      <p className="text-dark-600 text-sm">
                        {formatDateTime(apt.schedule).dateTime}
                      </p>
                    </div>
                  </div>
                  <div className="min-[410px]:ml-auto">
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar className="text-dark-500 mx-auto mb-4 h-12 w-12" />
              <p className="text-dark-600 mb-4">No upcoming appointments</p>
              <Link
                href={`/patients/${user.$id}/new-appointment`}
                className="shad-primary-btn inline-block rounded-lg px-6 py-2"
              >
                Schedule Now
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-400 border-dark-500 rounded-xl border p-4 sm:p-6">
          <h2 className="mb-6 text-xl font-bold text-white">Recent Activity</h2>
          {recentAppointments.length > 0 ? (
            <div className="divide-dark-500 divide-y">
              {recentAppointments.map((apt: any) => (
                <div
                  key={apt.$id}
                  className="flex flex-col gap-3 py-4 min-[410px]:flex-row min-[410px]:items-center"
                >
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-4 w-4 shrink-0 text-green-500" />
                    <div>
                      <p className="text-14 text-white">
                        Dr. {apt.primaryPhysician}
                      </p>
                      <p className="text-12-regular text-dark-600">
                        {formatDateTime(apt.schedule).dateTime}
                      </p>
                    </div>
                  </div>
                  <div className="min-[410px]:ml-auto">
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-600 py-8 text-center">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
