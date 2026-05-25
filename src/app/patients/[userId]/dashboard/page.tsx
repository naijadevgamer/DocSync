import DashboardClient from "@/components/dashboard/DashBoardClient";
import { getPatientAppointments } from "@/lib/appwrite/actions/appointment.action";
import { getPatient } from "@/lib/appwrite/actions/patient.actions";
import { requireOwnership } from "@/lib/appwrite/auth/guards";
import { unwrapAction } from "@/lib/appwrite/helper/unwrap-action";
import { ErrorCode } from "@/lib/errors";

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
