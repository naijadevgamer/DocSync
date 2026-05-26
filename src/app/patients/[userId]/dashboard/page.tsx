import DashboardClient from "@/components/dashboard/DashBoardClient";
import { getPatientAppointments } from "@/lib/appwrite/actions/appointment.action";
import { getPatient } from "@/lib/appwrite/actions/patient.actions";
import { requireOwnership } from "@/lib/appwrite/auth/guards";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { ErrorCode } from "@/lib/errors";
import { createMetadata } from "@/lib/utils/metadata";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: SearchParamProps): Promise<Metadata> {
  const { userId } = await params;

  const patientResult = await unwrapAction(() => getPatient(userId), {
    onError: {
      [ErrorCode.NOT_FOUND]: "ignore",
    },
    defaultValue: null,
  });

  return createMetadata({
    title: patientResult?.patient?.name
      ? `${patientResult.patient.name.split(" ")[0]}'s Dashboard`
      : "Patient Dashboard",

    description:
      "View appointments, healthcare information, and medical updates.",

    noIndex: true,
  });
}

export default async function Dashboard({ params }: SearchParamProps) {
  const { userId } = await params;

  const [authorizedUser, patientResult] = await Promise.all([
    requireOwnership(userId),
    unwrapAction(() => getPatient(userId), {
      onError: {
        [ErrorCode.NOT_FOUND]: "redirect",
      },
      redirectTo: `/patients/${userId}/personal-info`,
    }),
  ]);

  const appointmentsResult = await unwrapAction(
    () => getPatientAppointments(patientResult.patient.$id),
    {
      onError: { [ErrorCode.NOT_FOUND]: "ignore" },
      defaultValue: { appointments: [] },
    },
  );

  return (
    <DashboardClient
      user={authorizedUser}
      patient={patientResult.patient}
      appointments={appointmentsResult.appointments}
    />
  );
}
