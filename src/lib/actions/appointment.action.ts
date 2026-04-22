"use server";

import { ID, Query } from "node-appwrite";

import { revalidatePath } from "next/cache";
import { AppointmentDB, Patient } from "../../../types/appwrite.types";
import { createServerClient, createSessionClient } from "../appwrite/server";
import { ActionResult, handleError } from "../errors";
import {
  getCancelledEmailHTML,
  getConfirmedEmailHTML,
  getPendingEmailHTML,
} from "../messages";
import { parseStringify } from "../utils";

// Create Appointment
export const createAppointment = async (
  appointment: AppointmentDB,
  patient: Patient,
  timeZone: string,
): Promise<ActionResult<AppointmentData>> => {
  try {
    const { tablesDB, permissions } = await createSessionClient();

    console.log("Creating appointment with data:", appointment);

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

    return {
      success: true,
      data: { appointment: parseStringify(newAppointment) },
    };
  } catch (error) {
    console.error("Error creating appointment: ", error);
    return handleError(error);
  }
};

export const getAppointmentById = async (
  appointmentId: string,
): Promise<ActionResult<AppointmentData>> => {
  try {
    const { tablesDB } = await createSessionClient();
    const appointment = await tablesDB.getRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
    });
    // return parseStringify(appointment);
    return {
      success: true,
      data: { appointment: parseStringify(appointment) },
    };
  } catch (error) {
    // console.error("Error checking personal info:", error);
    console.error("Error fetching appointment:", error);
    return handleError(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
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

    return parseStringify(data);
  } catch (error: any) {
    console.error("An error occurred while fetching appointments:", error);
    throw error;
  }
};

export const sendEmailNotification = async (
  userId: string,
  subject: string,
  content: string,
) => {
  try {
    const { messaging } = createServerClient();
    const message = await messaging.createEmail({
      messageId: ID.unique(),
      subject: subject,
      content: content,
      users: [userId],
      html: true,
    });
    return { success: true, data: parseStringify(message) };
  } catch (error) {
    console.error("An error occurred while sending email:", error);
    return handleError(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  appointment,
  type,
  timeZone,
  patient,
}: UpdateAppointmentParams): Promise<ActionResult<AppointmentData>> => {
  try {
    const { tablesDB, permissions } = await createSessionClient();
    const updatedAppointment = await tablesDB.updateRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
      data: appointment,
      permissions: [permissions],
    });

    // if (!updatedAppointment) throw Error;

    const emailMessage =
      type === "schedule"
        ? getConfirmedEmailHTML({
            appointment,
            patient,
            timeZone:
              timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          })
        : getCancelledEmailHTML({
            appointment,
            patient,
            timeZone:
              timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          });

    const mailTitle =
      type === "schedule"
        ? "Appointment Confirmation"
        : "Appointment Cancellation";

    await sendEmailNotification(appointment.userId, mailTitle, emailMessage);

    revalidatePath("/admin");

    return {
      success: true,
      data: { appointment: parseStringify(updatedAppointment) },
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return handleError(error);
  }
};
