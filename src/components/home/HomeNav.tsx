"use client";

import { Button } from "@/components/ui/button";
import { customEase } from "@/constants";
import { useLogout } from "@/hooks/useLogout";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoutModal from "../modals/LogoutModal";
import FullLogo from "../utils/FullLogo";
import HomeDesktopNav from "./HomeDesktopNav";
import HomeMobileNav from "./HomeMobileNav";

export default function HomeNav({ user }: { user: User }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    isLoading: isLogoutLoading,
    showModal: showLogoutModal,
    handleLogout,
    confirmLogout,
    cancelLogout,
    setShowModal: setShowLogoutModal,
  } = useLogout({
    redirectTo: "/",
    refreshAfterLogout: true,
  });

  return (
    <>
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
            onLogout={handleLogout}
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
              onLogout={handleLogout}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        isLoading={isLogoutLoading}
      />
    </>
  );
}
