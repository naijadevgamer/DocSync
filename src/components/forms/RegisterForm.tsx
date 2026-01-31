"use client";

import React, { useState } from "react";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { FieldGroup } from "../ui/field";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "../SubmitButton";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { FileUploader } from "../FileUploader";

export default function RegisterForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation) as any,
    defaultValues: PatientFormDefaultValues,
  });

  const onSubmit = async (data: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      // const user = {
      //   name: data.name,
      //   email: data.email,
      //   phone: data.phone,
      // };
      // console.log("User data submitted:", user);
      // const newUser = await createUser(user);
      // console.log("New User: ", newUser);
      // if (newUser) {
      //   router.push(`/patients/${newUser.$id}/register`);
      // }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };
  return (
    <div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <FieldGroup className="space-y-8">
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>

            {/* NAME */}

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              placeholder="John Doe"
              label="Full name"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            />

            {/* EMAIL & PHONE */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* BirthDate & Gender */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of birth"
                iconSrc="/assets/icons/calendar.svg"
                iconAlt="calendar"
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
                          {option}
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
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder=" Software Engineer"
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
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ABC123456789"
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
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current medications"
                placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
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
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past medical history"
                placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
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
