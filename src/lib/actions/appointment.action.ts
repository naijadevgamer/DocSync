"use server";

import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_TABLE_ID,
  DATABASE_ID,
  databases,
  permissions,
  tablesDB,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "../../../types/appwrite.types";

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
    const appointments = await tablesDB.listRows({
      databaseId: DATABASE_ID!,
      tableId: APPOINTMENT_TABLE_ID!,
      queries: [Query.orderDesc("$createdAt")],
    });

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointments.rows.reduce((acc, appointment) => {
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

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.rows,
    };

    return parseStringify(data);
  } catch (error: any) {
    console.error("An error occurred while fetching appointments:", error);
    throw error;
  }
};
