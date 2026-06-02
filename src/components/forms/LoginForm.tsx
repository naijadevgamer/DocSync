"use client";

import { loginUser } from "@/lib/appwrite/actions/auth.actions";
import { LoginFormValidation } from "@/lib/validators/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosLock, IoIosMail } from "react-icons/io";
import { toast } from "sonner";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "./util/CustomFormField";
import SubmitButton from "../utils/SubmitButton";
import { Alert, AlertDescription } from "../ui/alert";
import { FieldGroup } from "../ui/field";
import { handleActionError } from "@/lib/errors/handle-action-error";

export default function LoginForm({
  isAdminFlow,
  callbackUrl,
}: {
  isAdminFlow?: boolean;
  callbackUrl?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminInfo, setShowAdminInfo] = useState(false);

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isAdminFlow) {
      setShowAdminInfo(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setShowAdminInfo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAdminFlow, form]);

  const onSubmit = async (data: z.infer<typeof LoginFormValidation>) => {
    console.log("Form Data:", data);
    setIsLoading(true);

    const user = {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    };

    const result = await loginUser(user);

    if (!result.success) {
      handleActionError(result.error);

      setIsLoading(false);
      return;
    }

    toast.success("User Logged in successfully!");

    const { isAdmin, hasPersonalInfo, user: loggedInUser } = result.data;

    console.log("User data:", user);
    console.log("Is admin:", isAdmin);
    console.log("Has personal info:", hasPersonalInfo);

    const redirectTo =
      callbackUrl ||
      (isAdmin
        ? "/admin"
        : hasPersonalInfo
          ? `/patients/${loggedInUser.$id}/dashboard`
          : `/patients/${loggedInUser.$id}/personal-info`);
    router.push(redirectTo);

  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">
            {isAdminFlow ? "Admin Portal 👨‍⚕️" : "Welcome back 👋"}
          </h1>
          <p className="text-dark-700">
            {isAdminFlow
              ? "Secure access for healthcare administrators"
              : "Sign in to manage your appointments"}
          </p>
        </section>

        {showAdminInfo && (
          <Alert className="border-blue-500/30 bg-blue-500/10 text-blue-500">
            <Info />
            <AlertDescription className="text-14-regular text-blue-500">
              Administrators use the same login form. Enter your admin
              credentials to access the dashboard.
            </AlertDescription>
          </Alert>
        )}

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
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            icon={<IoIosMail size={22} />}
          />

          <CustomFormField
            fieldType={FormFieldType.PASSWORD_INPUT}
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            icon={<IoIosLock size={22} />}
          />

          <div className="flex items-center justify-between">
            <div>
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="rememberMe"
                label="Remember me"
              />
            </div>

            <Link
              href="/forgot-password"
              className="text-14-medium block w-max text-green-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </FieldGroup>

        <SubmitButton isLoading={isLoading}>Log In</SubmitButton>

        {!isAdminFlow && (
          <p className="text-dark-600 text-14-regular mt-4 text-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-green-500 hover:underline">
              Register here
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
