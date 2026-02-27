"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_TABLE_ID,
  DATABASE_ID,
  databases,
  PATIENT_TABLE_ID,
  permissions,
  tablesDB,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "../../../types/appwrite.types";
import { revalidatePath } from "next/cache";

// Create Appointment
export const createAppointment = async (
  appointment: CreateAppointmentParams,
) => {
  try {
    const newAppointment = await tablesDB.createRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      rowId: ID.unique(),
      data: appointment,
      permissions: [permissions],
    });

    return parseStringify(newAppointment);
  } catch (error: any) {
    console.error("Error code", error.code);
    console.error("An error occurred while creating a new appointment:", error);
  }
};

export const getAppointmentById = async (appointmentId: string) => {
  try {
    const appointment = await tablesDB.getRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
    });
    return parseStringify(appointment);
  } catch (error: any) {
    if (error.code === 404) {
      // Expected "not found" case
      return null;
    }
    console.error("An error occurred while fetching the appointment:", error);
    throw error; // Unexpected server crash or network error
  }
};

export const getRecentAppointmentList = async () => {
  try {
    // Step 1: Fetch all appointments
    const appointments = (await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
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
              databaseId: DATABASE_ID!,
              tableId: PATIENT_TABLE_ID!,
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

export const updateAppointment = async ({
  userId,
  appointmentId,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await tablesDB.updateRow({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      rowId: appointmentId,
      data: appointment,
      permissions: [permissions],
    });

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};
