"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatDateTime } from "@/lib/utils/utils";

import Image from "next/image";

import {
  User2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Briefcase,
  HeartPulse,
  AlertTriangle,
  Activity,
  FileText,
  Clock3,
} from "lucide-react";

import { Patient } from "../../types/appwrite.types";

export default function PatientDetailsModal({
  patient,
  open,
  onClose,
}: {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!patient) return null;

  // 🔥 Replace this later with actual appointment data
  const lastVisit = patient.$updatedAt || patient.$createdAt || null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="shad-dialog max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-left text-xl font-bold text-white sm:text-2xl">
            Patient Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2 sm:space-y-8 sm:py-4">
          {/* 🔥 Header */}
          <div className="border-dark-500 flex items-center gap-4 border-b pb-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/10 sm:size-16">
              <User2 className="size-6 text-emerald-500 sm:size-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                {patient.name}
              </h2>

              <div className="text-dark-600 flex flex-wrap items-center gap-2 text-sm sm:gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {patient.phone}
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 Personal Information */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
              <User2 className="h-5 w-5 text-emerald-500" />
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Calendar className="size-4 text-emerald-500" />}
                label="Date of Birth"
                value={formatDateTime(patient.birthDate).dateOnly}
              />

              <InfoCard
                icon={<User2 className="size-4 text-blue-500" />}
                label="Gender"
                value={patient.gender}
              />

              <InfoCard
                icon={<MapPin className="size-4 text-red-400" />}
                label="Address"
                value={patient.address}
              />

              <InfoCard
                icon={<Briefcase className="size-4 text-yellow-500" />}
                label="Occupation"
                value={patient.occupation}
              />
            </div>
          </section>

          {/* 🔥 Medical Information */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
              <HeartPulse className="h-5 w-5 text-red-500" />
              Medical Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<AlertTriangle className="size-4 text-yellow-500" />}
                label="Allergies"
                value={patient.allergies || "None"}
              />

              <InfoCard
                icon={<Activity className="size-4 text-blue-500" />}
                label="Current Medication"
                value={patient.currentMedication || "None"}
              />

              <InfoCard
                icon={<FileText className="size-4 text-purple-500" />}
                label="Family History"
                value={patient.familyMedicalHistory || "None"}
              />

              <InfoCard
                icon={<FileText className="size-4 text-emerald-500" />}
                label="Past Medical History"
                value={patient.pastMedicalHistory || "None"}
              />
            </div>
          </section>

          {/* 🔥 Activity */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
              <Clock3 className="h-5 w-5 text-cyan-500" />
              Activity
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Calendar className="size-4 text-emerald-500" />}
                label="Last Visit"
                value={
                  lastVisit
                    ? formatDateTime(lastVisit).dateTime
                    : "No recent visits"
                }
              />

              <InfoCard
                icon={<User2 className="size-4 text-blue-500" />}
                label="Primary Physician"
                value={patient.primaryPhysician}
              />
            </div>
          </section>

          {/* 🔥 Insurance */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
              <Shield className="h-5 w-5 text-indigo-500" />
              Insurance
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<Shield className="size-4 text-indigo-500" />}
                label="Provider"
                value={patient.insuranceProvider}
              />

              <InfoCard
                icon={<FileText className="size-4 text-emerald-500" />}
                label="Policy Number"
                value={patient.insurancePolicyNumber}
              />
            </div>
          </section>

          {/* 🔥 Identification */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
              <FileText className="h-5 w-5 text-emerald-500" />
              Identification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<FileText className="size-4 text-blue-500" />}
                label="Type"
                value={patient.identificationType || "N/A"}
              />

              <InfoCard
                icon={<Shield className="size-4 text-yellow-500" />}
                label="Number"
                value={patient.identificationNumber || "N/A"}
              />
            </div>

            {patient.identificationDocumentUrl && (
              <div className="space-y-3">
                <div className="relative h-64 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={patient.identificationDocumentUrl}
                    alt="Identification Document"
                    fill
                    className="object-cover"
                  />
                </div>

                <a
                  href={patient.identificationDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm text-emerald-500 hover:underline"
                >
                  View Full Document
                </a>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-dark-300 border-dark-500 rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <p className="text-dark-600 text-sm">{label}</p>
      </div>

      <p className="text-xs font-medium wrap-break-word text-white sm:text-sm">
        {value || "—"}
      </p>
    </div>
  );
}
