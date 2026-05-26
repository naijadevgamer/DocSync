"use client";

import { useEffect, useState } from "react";
import CTASection from "./CTASection";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import HomeNav from "./HomeNav";
import ProblemSection from "./ProblemSection";
import SocialProofSection from "./SocialProofSection";
import TrustSection from "./TrustSection";

export default function ClientHome({ user }: { user: User | null }) {
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
      <HomeNav user={user} />

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
    </div>
  );
}
