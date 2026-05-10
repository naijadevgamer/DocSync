"use client";

import { Doctors } from "@/constants";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.action";
import { getAppointmentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  AppointmentDB,
  AppointmentUI,
  Patient,
} from "../../../types/appwrite.types";
import CustomFormField, { FormFieldType } from "./util/CustomFormField";
import SubmitButton from "../utils/SubmitButton";
import { FieldGroup } from "../ui/field";
import { SelectItem } from "../ui/select";
import { time } from "console";

export const AppointmentForm = ({
  userId,
  type = "create",
  appointment,
  patient,
  setOpen,
}: {
  userId: string;
  userName?: string;
  type: "create" | "schedule" | "cancel";
  patient?: Patient;
  appointment?: AppointmentUI;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation) as any,
    defaultValues: {
      primaryPhysician: appointment
        ? appointment?.primaryPhysician
        : patient?.primaryPhysician,
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof AppointmentFormValidation>) => {
    console.log("Form data:", data);
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }

    try {
      if (type === "create" && patient) {
        const appointment = {
          userId,
          patient: patient.$id,
          primaryPhysician: data.primaryPhysician,
          schedule: new Date(data.schedule),
          reason: data.reason!,
          status: status as Status,
          note: data.note || "",
        };

        const newAppointment = await createAppointment(
          appointment as AppointmentDB,
          patient,
          Intl.DateTimeFormat().resolvedOptions().timeZone,
        );
        console.log("New appointment created:", newAppointment);

        if (!newAppointment.success) {
          console.error(
            "Error creating appointment:",
            newAppointment.error?.details || newAppointment.error,
          );
          toast.error(
            newAppointment.error?.message || "Failed to create appointment",
          );
          return;
        }

        form.reset();
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.data?.appointment?.$id}`,
        );
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: data.primaryPhysician,
            schedule: new Date(data.schedule),
            status: status as Status,
            cancellationReason: data.cancellationReason,
          },
          patient: patient,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (!updatedAppointment.success) {
          console.error(
            "Error updating appointment:",
            updatedAppointment.error?.details || updatedAppointment.error,
          );
          toast.error(
            updatedAppointment.error?.message || "Failed to update appointment",
          );

          return;
        }

        setOpen && setOpen(false);
        form.reset();
        toast.success(
          `Appointment ${type === "schedule" ? "scheduled" : "cancelled"} successfully!`,
        );
      }
    } catch (error: any) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Submit Apppointment";
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <FieldGroup className="gap-6">
          {type === "create" && (
            <section className="mb-12 space-y-4">
              <h1 className="header">New Appointment</h1>
              <p className="text-dark-700">
                Request a new appointment in 10 seconds.
              </p>
            </section>
          )}

          {type !== "cancel" && (
            <>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Doctor"
                placeholder="Select a doctor"
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

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected appointment date"
                showTimeSelect
                dateFormat="MM/dd/yyyy  -  h:mm aa"
              />

              <div
                className={`flex flex-col gap-6 ${type === "create" && "xl:flex-row"}`}
              >
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Appointment reason"
                  placeholder="Annual montly check-up"
                  disabled={type === "schedule"}
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="note"
                  label="Comments/notes"
                  placeholder="Prefer afternoon appointments, if possible"
                  disabled={type === "schedule"}
                />
              </div>
            </>
          )}

          {type === "cancel" && (
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="cancellationReason"
              label="Reason for cancellation"
              placeholder="Urgent meeting came up"
            />
          )}
        </FieldGroup>

        <SubmitButton
          isLoading={isLoading}
          className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </div>
  );
};
