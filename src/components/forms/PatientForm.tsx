"use client";

import { UserFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldGroup } from "../ui/field";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
// import { createUser } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { createAdminClient } from "@/lib/appwrite/server";
import { createUser } from "@/lib/actions/auth.actions";
import { ActionResult } from "@/lib/errors";
import { toast } from "sonner";

export default function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    const user = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };

    const result = await createUser(user);

    if (!result.success) {
      console.error("Error creating user:", result.error);
      toast.error(result.error?.message || "Registration failed");
      setIsLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    router.push("/verify");
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <FieldGroup className="gap-6">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
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

          <CustomFormField
            fieldType={FormFieldType.PASSWORD_INPUT}
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
          />
        </FieldGroup>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </div>
  );
}
