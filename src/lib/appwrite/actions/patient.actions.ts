"use server";

import { ID, Query } from "node-appwrite";

import { Patient } from "../../../types/appwrite.types";
import {
  ActionResponse,
  AppError,
  ErrorCode,
  successResponse,
} from "../../errors";
import { parseStringify } from "../../utils/utils";
import { createSessionClient } from "../config/server";
import { withServerAction } from "../helper/with-server-action";

// REGISTER PATIENT
export const registerPatient = withServerAction(
  async ({
    identificationDocument,
    ...patient
  }: RegisterUserParams): Promise<ActionResponse<PatientData>> => {
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

    return successResponse({
      patient: parseStringify(newPatient) as Patient,
    });
  },
);

export const getPatient = withServerAction(async (userId: string) => {
  const { tablesDB } = await createSessionClient();

  const patient = await tablesDB.listRows({
    databaseId: process.env.DATABASE_ID!,
    tableId: process.env.PATIENT_TABLE_ID!,
    queries: [Query.equal("userId", [userId])],
  });

  if (!patient.rows.length) {
    throw new AppError({
      code: ErrorCode.NOT_FOUND,
      message: "Patient not found",
      statusCode: 404,
    });
  }

  return successResponse({
    patient: parseStringify(patient.rows[0]),
  });
});

// Update patient profile
export const updatePatient = withServerAction(
  async (
    patientId: string,
    data: Partial<Patient>,
  ): Promise<ActionResponse<PatientData>> => {
    const { tablesDB } = await createSessionClient();

    const updatedPatient = await tablesDB.updateRow({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      rowId: patientId,
      data,
    });

    return successResponse({
      patient: parseStringify(updatedPatient),
    });
  },
);

export const getAllPatients = withServerAction(
  async (): Promise<ActionResponse<{ patients: Patient[] }>> => {
    const { tablesDB } = await createSessionClient();
    const patients = await tablesDB.listRows({
      databaseId: process.env.DATABASE_ID!,
      tableId: process.env.PATIENT_TABLE_ID!,
      queries: [Query.limit(100)],
    });
    return successResponse({
      patients: parseStringify(patients.rows),
    });
  },
);
