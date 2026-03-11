export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_TABLE_ID,
  DOCTOR_TABLE_ID,
  APPOINTMENT_TABLE_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

if (
  !ENDPOINT ||
  !PROJECT_ID ||
  !DATABASE_ID ||
  !API_KEY ||
  !PATIENT_TABLE_ID ||
  !DOCTOR_TABLE_ID ||
  !APPOINTMENT_TABLE_ID
) {
  throw new Error("Missing required Appwrite environment variables");
}
