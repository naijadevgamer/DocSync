"use client";

import { useEffect, useState } from "react";
import { useLogout } from "@/hooks/useLogout";
import LogoutModal from "../modals/LogoutModal";
import HomeNav from "./HomeNav";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import FeaturesSection from "./FeaturesSection";
import TrustSection from "./TrustSection";
import SocialProofSection from "./SocialProofSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function ClientHome({ user }: { user: User }) {
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

  const [particles, setParticles] = useState<
    { left: number; top: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#0D0F10] text-white">
      {/* Subtle Background Grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')] opacity-10" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Navigation */}
      <HomeNav
        user={user}
        onLogout={handleLogout}
        isLogoutLoading={isLogoutLoading}
      />

      {/* Hero Section - The Hook */}
      <HeroSection user={user} particles={particles} />

      {/* The Problem Section - The Burden */}
      <ProblemSection />

      {/* Features Section - The Cure with Scroll Narrative */}
      <FeaturesSection />

      {/* Trust Section / Security Section */}
      <TrustSection />

      {/* Social Proof */}
      <SocialProofSection />

      {/* CTA */}
      <CTASection user={user} />

      {/* Footer */}
      <Footer />

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
