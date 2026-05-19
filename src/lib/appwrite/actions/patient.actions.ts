"use server";

import { ID, Query } from "node-appwrite";

import { createSessionClient } from "../config/server";
import { ActionResult, handleError } from "../../errors/errors";
import { parseStringify } from "../../utils/utils";
import { Patient } from "../../../types/appwrite.types";
import { ActionResponse, successResponse } from "../../errors";
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

// GET PATIENT
// export const getPatient = async (
//   userId: string,
// ): Promise<ActionResult<PatientData>> => {
//   try {
//     const { tablesDB } = await createSessionClient();

//     const patient = await tablesDB.listRows({
//       databaseId: process.env.DATABASE_ID!,
//       tableId: process.env.PATIENT_TABLE_ID!,
//       queries: [Query.equal("userId", [userId])],
//     });

//     return {
//       success: true,
//       data: { patient: parseStringify(patient.rows[0] || null) },
//     };
//   } catch (error) {
//     console.error("Error fetching patient:", {
//       error,
//       userId,
//       timestamp: new Date().toISOString(),
//     });

//     // Use the enhanced error handler
//     const result = handleError(error);

//     // Add additional context for the error classifier
//     if (result.error?.code === "404") {
//       result.error!.message = "Patient record not found";
//       result.error!.code = "NOT_FOUND";
//     }

//     return result;
//   }
// };

export const getPatient = withServerAction(async (userId: string) => {
  const { tablesDB } = await createSessionClient();

  const patient = await tablesDB.listRows({
    databaseId: process.env.DATABASE_ID!,
    tableId: process.env.PATIENT_TABLE_ID!,
    queries: [Query.equal("userId", [userId])],
  });

  return successResponse({
    patient: parseStringify(patient.rows[0] || null),
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
