"use client";

import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/lib/constants";
import { registerPatient } from "@/lib/appwrite/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validators/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID, Models, Permission, Role } from "appwrite";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SelectItem } from "../ui/select";
import SubmitButton from "../utils/SubmitButton";
import CustomFormField, { FormFieldType } from "./util/CustomFormField";
import { FileUploader } from "./util/FileUploader";

import {
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineIdentification,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi";

import { MdHealthAndSafety, MdMedication } from "react-icons/md";
import { createBrowserClient } from "@/lib/appwrite/config/client";
import { handleActionError } from "@/lib/errors/handle-action-error";

export default function PatientForm({ user }: { user: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation) as any,
    defaultValues: {
      ...PatientFormDefaultValues,
      email: user.email,
      name: user.name,
      phone: user.phone,
    },
  });

  const onSubmit = async (data: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    const formData = new FormData();

    const file = data.identificationDocument?.[0];
    if (!file) {
      toast.error("Please upload an identification document");
      return;
    }
    let uploadedFile;
    let uploadedFileUrl;

    const { storage } = createBrowserClient();

    try {
      uploadedFile = await storage.createFile({
        bucketId: process.env.NEXT_PUBLIC_BUCKET_ID!,
        fileId: ID.unique(),
        file,
        permissions: [Permission.read(Role.any())],
      });
      uploadedFileUrl = storage.getFileView({
        bucketId: uploadedFile.bucketId,
        fileId: uploadedFile.$id,
      });

      formData.append("fileId", uploadedFile.$id);
      formData.append("fileUrl", uploadedFileUrl);
    } catch (error: any) {
      const message =
        process.env.NODE_ENV === "development" && error?.message
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(message);
      setIsLoading(false);
      return;
    }

    const patient = {
      userId: user.$id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthDate: new Date(data.birthDate),
      gender: data.gender,
      address: data.address,
      occupation: data.occupation,
      emergencyContactName: data.emergencyContactName,
      emergencyContactNumber: data.emergencyContactNumber,
      primaryPhysician: data.primaryPhysician,
      insuranceProvider: data.insuranceProvider,
      insurancePolicyNumber: data.insurancePolicyNumber,
      allergies: data.allergies,
      currentMedication: data.currentMedication,
      familyMedicalHistory: data.familyMedicalHistory,
      pastMedicalHistory: data.pastMedicalHistory,
      identificationType: data.identificationType,
      identificationNumber: data.identificationNumber,
      identificationDocument: formData,
      privacyConsent: data.privacyConsent,
      treatmentConsent: data.treatmentConsent,
      disclosureConsent: data.disclosureConsent,
    };

    const newPatient = await registerPatient(patient);

    if (!newPatient.success) {
      if (uploadedFile) {
        await storage.deleteFile({
          bucketId: uploadedFile.bucketId,
          fileId: uploadedFile.$id,
        });
      }

      handleActionError(newPatient.error);
      setIsLoading(false);
      return;
    }

    toast.success("Patient information saved successfully!");
    router.push(`/patients/${user.$id}/new-appointment`);
  };

  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">
            Welcome {user?.name.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <FieldGroup className="gap-8">
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>

            {/* BirthDate & Gender */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of birth"
                icon={<HiOutlineCalendar size={22} />}
                placeholder="Pick your birth date"
                dateFormat="MMMM d, yyyy"
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            {/* Address & Occupation */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="14 street, New york, NY - 5101"
                icon={<HiOutlineHome size={22} />}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder=" Software Engineer"
                icon={<HiOutlineBriefcase size={22} />}
              />
            </div>

            {/* Emergency Contact Name & Emergency Contact Number */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency contact name"
                placeholder="Guardian's name"
                icon={<HiOutlineUser size={22} />}
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency contact number"
                placeholder="(555) 123-4567"
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>

            {/* PRIMARY CARE PHYSICIAN */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Primary care physician"
              placeholder="Select a physician"
              icon={<HiOutlineBriefcase size={22} />}
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="border-dark-500 rounded-full border"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* INSURANCE & POLICY NUMBER */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Insurance provider"
                placeholder="BlueCross BlueShield"
                icon={<HiOutlineShieldCheck size={22} />}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ABC123456789"
                icon={<HiOutlineIdentification size={22} />}
              />
            </div>

            {/* ALLERGY & CURRENT MEDICATIONS */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                label="Allergies (if any)"
                placeholder="Peanuts, Penicillin, Pollen"
                icon={<MdHealthAndSafety size={22} />}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current medications"
                placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                icon={<MdMedication size={22} />}
              />
            </div>

            {/* FAMILY MEDICATION & PAST MEDICATIONS */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label=" Family medical history (if relevant)"
                placeholder="Mother had brain cancer, Father has hypertension"
                icon={<HiOutlineDocumentText size={22} />}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past medical history"
                placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                icon={<HiOutlineDocumentText size={22} />}
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verfication</h2>
            </div>

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="identificationType"
              label="Identification Type"
              placeholder="Select identification type"
              icon={<HiOutlineIdentification size={22} />}
            >
              {IdentificationTypes.map((type, i) => (
                <SelectItem key={type + i} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
              icon={<HiOutlineIdentification size={22} />}
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned Copy of Identification Document"
              renderSkeleton={(field) => (
                <FileUploader files={field.value} onChange={field.onChange} />
              )}
            />
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
            </div>

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="treatmentConsent"
              label="I consent to receive treatment for my health condition."
            />

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="disclosureConsent"
              label="I consent to the use and disclosure of my health
            information for treatment purposes."
            />

            <CustomFormField
              fieldType={FormFieldType.CHECKBOX}
              control={form.control}
              name="privacyConsent"
              label="I acknowledge that I have reviewed and agree to the
            privacy policy"
            />
          </section>
        </FieldGroup>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </div>
  );
}
