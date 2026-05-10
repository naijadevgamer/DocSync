"use server";

import { ID, Query } from "node-appwrite";

import { createSessionClient } from "../appwrite/server";
import { ActionResult, handleError } from "../errors";
import { parseStringify } from "../utils";
import { Patient } from "../../../types/appwrite.types";

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams): Promise<ActionResult<PatientData>> => {
  try {
    const { tablesDB, permissions } = await createSessionClient();

    const fileId = identificationDocument?.get("fileId") as string;
    const fileUrl = identificationDocument?.get("fileUrl") as string;

    const newPatient = await tablesDB.createRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        identificationDocumentId: fileId ?? null,
        identificationDocumentUrl: fileUrl ?? null,
        ...patient,
      },
      permissions: [permissions],
    });

    return {
      success: true,
      data: { patient: parseStringify(newPatient) },
    };
  } catch (error) {
    console.error("Error creating patient personal info:", error);
    return handleError(error);
  }
};

// GET PATIENT
export const getPatient = async (
  userId: string,
): Promise<ActionResult<PatientData>> => {
  try {
    const { tablesDB } = await createSessionClient();

    const patient = await tablesDB.listRows({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      queries: [Query.equal("userId", [userId])],
    });

    return {
      success: true,
      data: { patient: parseStringify(patient.rows[0] || null) },
    };
  } catch (error) {
    console.error("Error fetching patient:", error);
    return handleError(error);
  }
};

// Update patient profile
export const updatePatient = async (
  patientId: string,
  data: Partial<Patient>,
): Promise<ActionResult<PatientData>> => {
  try {
    const { tablesDB, permissions } = await createSessionClient();

    const updatedPatient = await tablesDB.updateRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      rowId: patientId,
      data,
    });

    return {
      success: true,
      data: { patient: parseStringify(updatedPatient) },
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getAllPatients = async (): Promise<
  ActionResult<{ patients: Patient[] }>
> => {
  try {
    const { tablesDB } = await createSessionClient();
    const patients = await tablesDB.listRows({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      queries: [Query.limit(100)],
    });
    return {
      success: true,
      data: { patients: parseStringify(patients.rows) },
    };
  } catch (error) {
    return handleError(error);
  }
};
