"use client";

import { createUser } from "@/lib/actions/auth.actions";
import { UserFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineUser } from "react-icons/hi";
import { IoIosLock, IoIosMail } from "react-icons/io";
import { toast } from "sonner";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FieldGroup } from "../ui/field";
import Link from "next/link";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
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

        {form.formState.errors.root && (
          <Alert className="border-red-500/30 bg-red-500/10 text-red-500">
            <AlertCircle />
            <AlertDescription className="text-14-regular text-red-500">
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <FieldGroup className="gap-6">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            icon={<HiOutlineUser size={22} />}
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
            icon={<IoIosMail size={22} />}
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
            icon={<IoIosLock size={22} />}
          />
          <CustomFormField
            fieldType={FormFieldType.PASSWORD_INPUT}
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            icon={<IoIosLock size={22} />}
          />
        </FieldGroup>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>

        <p className="text-dark-600 text-14-regular mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-green-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
