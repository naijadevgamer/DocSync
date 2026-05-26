"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/lib/appwrite/actions/auth.actions";
import { handleActionError } from "@/lib/errors/handle-action-error";
import { on } from "events";

interface UseLogoutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  showToast?: boolean;
  refreshAfterLogout?: boolean;
}

interface UseLogoutReturn {
  isLoading: boolean;
  error: string | null;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  handleLogout: () => void;
  confirmLogout: () => Promise<void>;
  cancelLogout: () => void;
}

export function useLogout(options: UseLogoutOptions = {}): UseLogoutReturn {
  const {
    redirectTo = "/login",
    onSuccess,
    onError,
    showToast = true,
    refreshAfterLogout = false,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const performLogout = async (skipModal = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await logoutUser();

      if (!result.success) {
        handleActionError(result.error);
        onError?.(result.error);
        setIsLoading(false);
        return;
      }

      if (showToast) {
        toast.success("Logged out successfully");
      }

      onSuccess?.();

      if (refreshAfterLogout) {
        router.refresh();
        return true;
      }

      router.push(redirectTo);
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || "Something went wrong";
      setError(errorMessage);
      if (showToast) {
        toast.error(errorMessage);
      }
      onError?.(err);
      setIsLoading(false);
      return false;
    }
  };

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = async () => {
    await performLogout();
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  return {
    isLoading,
    error,
    showModal,
    setShowModal,
    handleLogout,
    confirmLogout,
    cancelLogout,
  };
}
