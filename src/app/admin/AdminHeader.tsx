"use client";

import FullLogo from "@/components/FullLogo";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/actions/auth.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOutIcon } from "lucide-react";

export default function AdminHeader() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      setLoading(true);

      const result = await logoutUser();

      if (!result.success) {
        console.error(result.error?.message || "Logout failed");
        toast.error(result.error?.message || "Logout failed");
        setLoading(false);
        return;
      }

      setOpen(false); // close modal
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <header className="admin-header">
      <Link href="/" className="w-30">
        <FullLogo />
      </Link>

      <div className="flex items-center gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          {/* 🔥 Trigger */}
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-red-500 hover:text-red-400">
              <LogOutIcon />
              Logout
            </Button>
          </DialogTrigger>

          {/* 🔥 Modal */}
          <DialogContent className="shad-dialog">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out? You will need to sign in again
                to access your account.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2">
              {/* Cancel */}
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="border-dark-500 text-dark-600 hover:bg-dark-500/50"
              >
                Cancel
              </Button>

              {/* Confirm */}
              <Button
                onClick={handleLogout}
                disabled={loading}
                className="bg-[#FF4F4E] text-white transition hover:bg-red-700"
              >
                {loading ? "Logging out..." : "Yes, Logout"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
