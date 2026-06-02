"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendPasswordRecovery } from "@/lib/appwrite/actions/auth.actions";
import { handleActionError } from "@/lib/errors/handle-action-error";
import { ForgotPasswordFormValidation } from "@/lib/validators/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { IoIosMail, IoMdDoneAll } from "react-icons/io";
import z from "zod";
import { Alert, AlertDescription } from "../ui/alert";
import { FieldGroup } from "../ui/field";
import SubmitButton from "../utils/SubmitButton";
import CustomFormField, { FormFieldType } from "./util/CustomFormField";
import { ErrorCode } from "@/lib/errors";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordFormValidation>>({
    resolver: zodResolver(ForgotPasswordFormValidation),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof ForgotPasswordFormValidation>,
  ) => {
    setIsLoading(true);
    const res = await sendPasswordRecovery(data.email);
    if (!res.success) {
      if (res.error.code === ErrorCode.NOT_FOUND)
        handleActionError({
          ...res.error,
          message: "User with the requested email could not be found.",
        });
      else handleActionError(res.error);
      setIsLoading(false);
      return;
    }

    setSubmitted(true);
    toast.success("Recovery email sent");
    setIsLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex-1 content-center justify-center space-y-4 self-center text-center">
        <p className="flex flex-col justify-center text-center text-green-500">
          <IoMdDoneAll size={60} className="mx-auto" />
          <p className="text-2xl"> Email sent!</p>
        </p>
        <p className="text-dark-600">Check your inbox.</p>
        <Button className="shad-primary-btn" asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="text-24-bold mb-2">Forgot Password</h1>
        </section>

        {form.formState.errors.root && (
          <Alert className="border-red-500/30 bg-red-500/10 text-red-500">
            <AlertCircle />
            <AlertDescription className="text-14-regular text-red-500">
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <FieldGroup>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="johndoe@gmail.com"
            icon={<IoIosMail size={22} />}
          />
        </FieldGroup>

        <SubmitButton isLoading={isLoading}>Send Recovery Email</SubmitButton>

        <p className="text-dark-600 text-14-regular mt-4 text-center">
          Go Back to{" "}
          <Link href="/login" className="text-green-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
