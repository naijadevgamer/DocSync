// components/dashboard/MobileNav.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutDashboard, LogOut, Home, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MobileNavProps {
  user: any;
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileNav({ user, onClose, onLogout }: MobileNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-dark-300/95 border-b border-white/5 backdrop-blur-xl md:hidden"
    >
      <div className="space-y-4 px-6 py-4">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <Avatar className="h-10 w-10 border-2 border-green-500/50">
            <AvatarFallback className="bg-green-500/20 text-green-400">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white">{user?.name || "User"}</p>
            <p className="text-sm text-gray-400">{user?.email || ""}</p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-300 transition-colors hover:text-white"
          onClick={onClose}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
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
      </div>
    </motion.div>
  );
}
