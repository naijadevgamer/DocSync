// components/dashboard/tabs/SettingsTab.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  deleteAccount,
  logoutUser,
  updatePassword,
} from "@/lib/appwrite/actions/auth.actions";
// import { downloadPatientData } from "@/lib/actions/patient.actions";
import {
  Shield,
  Bell,
  FileText,
  LogOut,
  AlertTriangle,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LogoutModal from "@/components/modals/LogoutModal";
import { useLogout } from "@/hooks/useLogout";
import { downloadPatientData } from "@/lib/utils/utils";

export default function SettingsTab({ user, patient }: any) {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    const result = await updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );

    if (result.success) {
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      if (result.error?.code === "401") {
        toast.error("Current password is incorrect");
      } else {
        toast.error(result.error?.message || "Failed to update password");
      }
    }

    setIsLoading(false);
  };

  const handleDownloadData = async () => {
    const toastId = toast.loading("Preparing your data...");

    try {
      await downloadPatientData(patient.$id, patient);

      toast.success("Your data has been downloaded!", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);

      toast.error("Failed to download data", {
        id: toastId,
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    const result = await deleteAccount(user.$id);
    if (result.success) {
      toast.success("Account deleted successfully");
      router.push("/login");
    } else {
      toast.error(result.error?.message || "Failed to delete account");
    }

    setIsLoading(false);
    setShowDeleteModal(false);
  };

  const {
    isLoading: isLogoutLoading,
    showModal: showLogoutModal,
    handleLogout,
    confirmLogout,
    cancelLogout,
    setShowModal: setShowLogoutModal,
  } = useLogout();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-24-bold text-white">Account Settings</h2>

      {/* Security Section */}
      <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
        <h3 className="text-18-bold text-white">Security</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="border-dark-500 text-dark-600 w-full justify-start"
            onClick={() => setShowPasswordModal(true)}
          >
            <Shield className="mr-3 h-5 w-5" />
            Change Password
          </Button>
        </div>
      </div>

      {/* Data & Privacy Section */}
      <div className="bg-dark-400 border-dark-500 space-y-4 rounded-xl border p-6">
        <h3 className="text-18-bold text-white">Data & Privacy</h3>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="border-dark-500 text-dark-600 w-full justify-start"
            onClick={handleDownloadData}
            // disabled={isLoading}
          >
            <Download className="mr-3 h-5 w-5" />
            {isLoading ? "Downloading..." : "Download My Data"}
          </Button>

          <Button
            variant="outline"
            className="border-dark-500 w-full justify-start text-red-500 hover:bg-red-500/10"
            onClick={() => setShowDeleteModal(true)}
          >
            <AlertTriangle className="mr-3 h-5 w-5" />
            Delete Account
          </Button>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="w-full bg-red-600 hover:bg-red-700"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-5 w-5" />
        Logout from Account
      </Button>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="bg-dark-400 border-dark-500 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Change Password</DialogTitle>
            <DialogDescription className="text-dark-600">
              Enter your current password and a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Current password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="bg-dark-300 border-dark-500 text-white"
            />
            <Input
              type="password"
              placeholder="New password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="bg-dark-300 border-dark-500 text-white"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="bg-dark-300 border-dark-500 text-white"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
              className="border-dark-500 text-dark-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-dark-400 border-dark-500 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Account</DialogTitle>
            <DialogDescription className="text-dark-600">
              Are you sure you want to delete your account? This action cannot
              be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="border-dark-500 text-dark-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Modal */}
      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        isLoading={isLogoutLoading}
      />
    </div>
  );
}
