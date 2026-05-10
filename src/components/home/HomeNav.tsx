// components/home/HomeNav.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X, LogOut, Loader2, LayoutDashboard, User } from "lucide-react";
// import FullLogo from "@/components/FullLogo";
import HomeDesktopNav from "./HomeDesktopNav";
import HomeMobileNav from "./HomeMobileNav";
import FullLogo from "../utils/FullLogo";
import { customEase } from "@/constants";

interface HomeNavProps {
  user: any;
  onLogout: () => void;
  isLogoutLoading: boolean;
}

export default function HomeNav({
  user,
  onLogout,
  isLogoutLoading,
}: HomeNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
      className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0D0F10]/10 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <div className="w-30">
            <FullLogo />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <HomeDesktopNav
          user={user}
          onLogout={onLogout}
          isLogoutLoading={isLogoutLoading}
        />

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white/80 hover:text-white md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="size-7" />
          ) : (
            <Menu className="size-7" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <HomeMobileNav
            user={user}
            onLogout={onLogout}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
