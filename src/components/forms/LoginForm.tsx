"use client";

import { loginUser } from "@/lib/actions/auth.actions";
import { LoginFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosLock, IoIosMail } from "react-icons/io";
import { toast } from "sonner";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { FieldGroup } from "../ui/field";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginFormValidation>) => {
    console.log("Form Data:", data);
    setIsLoading(true);

    const user = {
      email: data.email,
      password: data.password,
    };

    const result = await loginUser(user);

    if (!result.success) {
      console.error("Error logging user in:", result.error);
      switch (result.error?.code) {
        case "401":
          form.setError("email", { message: "Invalid email or password" });
          form.setError("password", { message: "Invalid email or password" });
          toast.error("Invalid email or password");
          break;

        default:
          toast.error(result.error?.message || "Login failed");
      }
      setIsLoading(false);
      return;
    }

    toast.success("User Logged in successfully!");

    const { isAdmin, hasPersonalInfo, user: loggedInUser } = result.data;

    console.log("User data:", user);
    console.log("Is admin:", isAdmin);
    console.log("Has personal info:", hasPersonalInfo);

    // Redirect based on role and personal info
    if (isAdmin) {
      // Admin users go to admin dashboard
      router.push("/admin");
    } else if (hasPersonalInfo) {
      // Regular users with personal info go to appointments
      router.push(`/patients/${loggedInUser.$id}/new-appointment`);
    } else {
      // Users without personal info go to personal info form
      router.push(`/patients/${loggedInUser.$id}/personal-info`);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome back 👋</h1>
          <p className="text-dark-700">Continue with appointments.</p>
        </section>

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
        </FieldGroup>

        <SubmitButton isLoading={isLoading}>Log In</SubmitButton>
      </form>
    </div>
  );
}
