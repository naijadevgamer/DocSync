// components/home/HomeMobileNav.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HomeMobileNavProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

export default function HomeMobileNav({
  user,
  onLogout,
  onClose,
}: HomeMobileNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border-b border-white/5 bg-[#0D0F10]/95 backdrop-blur-xl md:hidden"
    >
      <div className="space-y-4 px-6 py-4">
        {user ? (
          <>
            <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
              <Avatar className="h-12 w-12 border-2 border-emerald-500/50">
                <AvatarImage
                  src={"/placeholder-avatar.png"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-white">{user?.name || "User"}</p>
                <p className="text-sm text-gray-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            <Link
              href={`/patients/${user.$id}/dashboard`}
              className="flex items-center space-x-2 text-gray-300 transition-colors hover:text-white"
              onClick={onClose}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex w-full items-center space-x-2 text-red-400 transition-colors hover:text-red-300"
            >
              <LogOut className="h-5 w-5" />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Button
              asChild
              variant="ghost"
              className="justify-start text-white/60 hover:text-white"
              onClick={onClose}
            >
              <Link href="/login">Sign In</Link>
            </Button>

            <Button
              asChild
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
              onClick={onClose}
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
