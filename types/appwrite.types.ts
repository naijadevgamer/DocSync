import { Models } from "node-appwrite";
import { string } from "zod";

export interface Patient extends Models.Document {
  userId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationDocumentId: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  identificationDocumentUrl: string | undefined;
  identificationType: string | undefined;
  privacyConsent: boolean;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
}

export interface AppointmentDB extends Models.Document {
  patient: string;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason?: string;
}

export interface AppointmentUI extends Models.Document {
  patient: Patient;
  schedule: Date;
  status: Status;
  primaryPhysician: string;
  reason: string;
  note: string;
  userId: string;
  cancellationReason?: string;
}
