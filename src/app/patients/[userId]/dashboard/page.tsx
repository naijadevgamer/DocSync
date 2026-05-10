import { getAuthorizedUser } from "@/lib/actions/auth.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import { getPatientAppointments } from "@/lib/actions/appointment.action";
import { notFound } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashBoardClient";
import { AppointmentUI } from "../../../../../types/appwrite.types";

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

  return (
    <DashboardClient
      user={user}
      patient={patient}
      appointments={appointments}
    />
  );
}
