"use server";

import { ID } from "node-appwrite";
import {
  APPOINTMENT_TABLE_ID,
  DATABASE_ID,
  permissions,
  tablesDB,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "../../../types/appwrite.types";
import { ca } from "zod/v4/locales";

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
