"use client";

import { Button } from "@/components/ui/button";
import FullLogo from "@/components/utils/FullLogo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLogout } from "@/hooks/useLogout";
import { LogOutIcon } from "lucide-react";
import LogoutModal from "../modals/LogoutModal";

export default function AdminHeader() {
  const {
    isLoading,
    showModal,
    handleLogout,
    confirmLogout,
    cancelLogout,
    setShowModal,
  } = useLogout({
    redirectTo: "/login",
  });

  return (
    <header className="bg-dark-200">
      <div className="admin-header container">
        <Link href="/" className="w-30">
          <FullLogo />
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOutIcon />
            Logout
          </Button>

          <LogoutModal
            open={showModal}
            onOpenChange={setShowModal}
            onConfirm={confirmLogout}
            onCancel={cancelLogout}
            isLoading={isLoading}
          />
        </div>
      </div>
    </header>
  );
}
