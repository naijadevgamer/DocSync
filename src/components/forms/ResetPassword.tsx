"use client";

import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/appwrite/actions/auth.actions";
import { handleActionError } from "@/lib/errors/handle-action-error";
import { ResetPasswordFormValidation } from "@/lib/validators/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosLock, IoMdDoneAll } from "react-icons/io";
import { toast } from "sonner";
import z from "zod";
import { Alert, AlertDescription } from "../ui/alert";
import { FieldGroup } from "../ui/field";
import SubmitButton from "../utils/SubmitButton";
import CustomFormField, { FormFieldType } from "./util/CustomFormField";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordFormValidation>>({
    resolver: zodResolver(ResetPasswordFormValidation),
  });

  if (!userId || !secret) {
    return (
      <div className="flex-1 content-center justify-center space-y-4 self-center px-5">
        <div className="space-y-4 text-center">
          <h1 className="text-24-bold mt-8">
            You have no business here please!
          </h1>
          <Button className="shad-primary-btn" asChild>
            <Link href="/login">Kindly Go Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (
    data: z.infer<typeof ResetPasswordFormValidation>,
  ) => {
    const res = await resetPassword(userId, secret, data.password);
    if (!res.success) {
      handleActionError({
        ...res.error,
        message: "Reset failed. Link may be expired.",
      });
      return;
    }

    setSubmitted(true);
    toast.success("Password reset successful");
  };

  if (submitted) {
    return (
      <div className="flex-1 content-center justify-center space-y-4 self-center px-5">
        <div className="text-center">
          <IoMdDoneAll size={60} className="mx-auto text-green-500" />
          <h1 className="text-24-bold mt-4 mb-8">Password Reset Successful!</h1>
          <Button className="shad-primary-btn" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="text-24-bold mb-2">Set New Password</h1>
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

        <SubmitButton isLoading={form.formState.isSubmitting}>
          Reset Password
        </SubmitButton>
      </form>
    </div>
  );
}
