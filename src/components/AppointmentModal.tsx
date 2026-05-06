"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AppointmentForm } from "./forms/AppointmentForm";

import "react-datepicker/dist/react-datepicker.css";
import { AppointmentUI, Patient } from "../../types/appwrite.types";

export const AppointmentModal = ({
  userId,
  appointment,
  type,
  patient,
}: {
  patient: Patient;
  userId: string;
  appointment?: AppointmentUI;
  type: "schedule" | "cancel";
  title: string;
  description: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize transition ${type === "schedule" && "text-green-500 hover:text-green-400"} ${type === "cancel" && "text-red-500 hover:text-red-400"}`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="mb-4 space-y-2 sm:space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} appointment
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
          patient={patient}
        />
      </DialogContent>
    </Dialog>
  );
};
