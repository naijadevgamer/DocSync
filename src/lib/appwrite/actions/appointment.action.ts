"use server";

import { ID, Query } from "node-appwrite";

import { revalidatePath } from "next/cache";
import { createServerClient, createSessionClient } from "../config/server";

import {
  AppointmentDB,
  AppointmentUI,
  Patient,
} from "../../../types/appwrite.types";
import {
  ActionResponse,
  AppError,
  ErrorCode,
  successResponse,
} from "../../errors";
import { parseStringify } from "../../utils/utils";
import { withServerAction } from "../helper/with-server-action";
import {
  getCancelledEmailHTML,
  getConfirmedEmailHTML,
  getPendingEmailHTML,
} from "../messaging/messages";

// Create Appointment
export const createAppointment = withServerAction(
  async (
    appointment: AppointmentDB,
    patient: Patient,
    timeZone: string,
  ): Promise<ActionResponse<AppointmentData>> => {
    const { tablesDB, permissions } = await createSessionClient();

    const newAppointment = await tablesDB.createRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.APPOINTMENT_TABLE_ID!,
      rowId: ID.unique(),
      data: appointment,
      permissions: [permissions],
    });

    const emailMessage = getPendingEmailHTML({
      appointment,
      patient,
      timeZone,
    });

    await sendEmailNotification(
      appointment.userId,
      "Appointment Request Received",
      emailMessage,
    );

    return successResponse({
      appointment: parseStringify(newAppointment),
    });
  },
);

export const getAppointmentById = withServerAction(
  async (appointmentId: string): Promise<ActionResponse<AppointmentData>> => {
    const { tablesDB } = await createSessionClient();
    const appointment = await tablesDB.getRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
    });

    if (!appointment) {
      throw new AppError({
        code: ErrorCode.NOT_FOUND,
        message: "Appointment not found",
        statusCode: 404,
      });
    }

    return successResponse({
      appointment: parseStringify(appointment),
    });
  },
);

export const getRecentAppointmentList = withServerAction(async () => {
  const { tablesDB } = await createSessionClient();
  // Step 1: Fetch all appointments
  const appointments = (await tablesDB.listRows({
    databaseId: process.env.DATABASE_ID!,
    tableId: process.env.APPOINTMENT_TABLE_ID!,
    queries: [Query.orderDesc("$createdAt")],
  })) as any;

  // Step 2: Extract unique patient IDs
  const patientIds = [
    ...new Set(appointments.rows.map((a: any) => a.patient).filter(Boolean)),
  ];

  // Step 3: Fetch all patients in parallel
  const patientDocs = await Promise.all(
    patientIds.map(
      (id: any) =>
        tablesDB
          .getRow({
            databaseId: process.env.DATABASE_ID!,
            tableId: process.env.PATIENT_TABLE_ID!,
            rowId: id,
          })
          .catch(() => null), // in case a patient was deleted or missing
    ),
  );

  // Step 4: Convert to lookup map for O(1) access
  const patientMap = Object.fromEntries(
    patientDocs.filter(Boolean).map((p) => [p?.$id, p]),
  );

  // Step 5: Merge patient data into each appointment
  const enrichedAppointments = appointments.rows.map((a: any) => ({
    ...a,
    patient: patientMap[a.patient] || null,
  }));

  // Step 6: Count by status
  const initialCounts = {
    scheduledCount: 0,
    pendingCount: 0,
    cancelledCount: 0,
  };

  const counts = enrichedAppointments.reduce((acc: any, appointment: any) => {
    switch (appointment.status) {
      case "scheduled":
        acc.scheduledCount++;
        break;
      case "pending":
        acc.pendingCount++;
        break;
      case "cancelled":
        acc.cancelledCount++;
        break;
    }
    return acc;
  }, initialCounts);

  // Step 7: Return parsed data
  const data = {
    totalCount: appointments.total,
    ...counts,
    documents: enrichedAppointments,
  };

  return successResponse(parseStringify(data));
});

export const getPatientAppointments = withServerAction(
  async (
    patientId: string,
  ): Promise<ActionResponse<{ appointments: AppointmentUI[] }>> => {
    const { tablesDB } = await createSessionClient();
    const appointments = await tablesDB.listRows({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.APPOINTMENT_TABLE_ID!,
      queries: [
        Query.equal("patient", [patientId]),
        Query.orderDesc("$createdAt"),
      ],
    });
    return successResponse({
      appointments: parseStringify(appointments.rows),
    });
  },
);

export const sendEmailNotification = withServerAction(
  async (userId: string, subject: string, content: string) => {
    const { messaging } = createServerClient();
    const message = await messaging.createEmail({
      messageId: ID.unique(),
      subject: subject,
      content: content,
      users: [userId],
      html: true,
    });
    return successResponse({ message: parseStringify(message) });
  },
);

export const updateAppointment = withServerAction(
  async ({
    appointmentId,
    appointment,
    type,
    timeZone,
    patient,
  }: UpdateAppointmentParams): Promise<ActionResponse<AppointmentData>> => {
    const { tablesDB, permissions } = await createSessionClient();
    const updatedAppointment = await tablesDB.updateRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
      data: appointment,
      permissions: [permissions],
    });

    const emailMessage =
      type === "schedule"
        ? getConfirmedEmailHTML({
            appointment,
            patient,
            timeZone,
          })
        : getCancelledEmailHTML({
            appointment,
            patient,
            timeZone,
          });

    const mailTitle =
      type === "schedule"
        ? "Appointment Confirmation"
        : "Appointment Cancellation";

    await sendEmailNotification(
      updatedAppointment.userId,
      mailTitle,
      emailMessage,
    );

    revalidatePath("/admin");

    return successResponse({ appointment: parseStringify(updatedAppointment) });
  },
);
