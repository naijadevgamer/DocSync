// components/dashboard/tabs/AppointmentsTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/utils/StatusBadge";
import { Doctors } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils/utils";
import { Calendar, Search, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function AppointmentsTab({ user, appointments }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt: any) => apt.status === statusFilter);
    }

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((apt: any) => {
        return (
          apt.primaryPhysician?.toLowerCase().includes(searchLower) ||
          apt.status?.toLowerCase().includes(searchLower) ||
          apt.reason?.toLowerCase().includes(searchLower) ||
          formatDateTime(apt.schedule)
            .dateTime.toLowerCase()
            .includes(searchLower)
        );
      });
    }

    return filtered;
  }, [appointments, searchTerm, statusFilter]);

  const statuses = ["all", "scheduled", "pending", "cancelled"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-24-bold text-white">All Appointments</h2>
          <p className="text-dark-600 text-14-regular mt-1">
            {filteredAppointments.length} appointment
            {filteredAppointments.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button asChild className="shad-primary-btn">
          <Link href={`/patients/${user.$id}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-dark-500 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by doctor, status, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-dark-400 border-dark-500 w-full pl-10 text-white focus:ring-1 focus:ring-green-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`whitespace-nowrap ${
                statusFilter === status
                  ? "bg-green-500 text-white"
                  : "border-dark-500 text-dark-600 hover:bg-dark-500"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      {filteredAppointments.length > 0 ? (
        <div className="bg-dark-400 border-dark-500 overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-200">
                <tr>
                  <th className="text-14-medium text-dark-600 p-4 text-left whitespace-nowrap">
                    Doctor
                  </th>
                  <th className="text-14-medium text-dark-600 p-4 text-left whitespace-nowrap">
                    Date & Time
                  </th>
                  <th className="text-14-medium text-dark-600 p-4 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="text-14-medium text-dark-600 p-4 text-left whitespace-nowrap">
                    Reason
                  </th>
                  <th className="text-14-medium text-dark-600 p-4 text-left whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-dark-500 divide-y">
                {filteredAppointments.map((apt: any) => (
                  <tr
                    key={apt.$id}
                    className="hover:bg-dark-300 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            Doctors.find((d) => d.name === apt.primaryPhysician)
                              ?.image || ""
                          }
                          alt="doctor"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-14-medium text-white">
                          Dr. {apt.primaryPhysician}
                        </span>
                      </div>
                    </td>
                    <td className="text-14-regular text-dark-600 p-4 whitespace-nowrap">
                      {formatDateTime(apt.schedule).dateTime}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="text-14-regular text-dark-600 p-4">
                      {apt.reason || "—"}
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/patients/${user.$id}/new-appointment/success?appointmentId=${apt.$id}`}
                        >
                          View <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-dark-400 border-dark-500 rounded-xl border p-12 text-center">
          <Calendar className="text-dark-500 mx-auto mb-4 h-12 w-12" />
          <p className="text-dark-600 mb-4">
            {appointments.length === 0
              ? "No appointments yet"
              : "No appointments match your search"}
          </p>
          {appointments.length === 0 && (
            <Link
              href={`/patients/${user.$id}/new-appointment`}
              className="shad-primary-btn inline-block rounded-lg px-6 py-2"
            >
              Book Your First Appointment
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
