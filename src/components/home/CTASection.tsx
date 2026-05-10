"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { customEase } from "@/constants";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRef } from "react";

export default function CTASection({ user }: { user: User }) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const button = buttonRefs.current[index];
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = (index: number) => {
    const button = buttonRefs.current[index];
    if (button) {
      button.style.transform = "translate(0px, 0px)";
    }
  };

  return (
    <section className="relative border-t border-white/4 py-32">
      <div className="container overflow-hidden text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: customEase }}
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
            {user ? "Continue your journey." : "Ready to simplify healthcare?"}
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg text-white/35">
            {user
              ? "Access your dashboard to manage appointments and profile."
              : "Join thousands who've made the switch to seamless care management."}
          </p>
          <div className="flex justify-center gap-4">
            {user ? (
              <Button
                asChild
                ref={(el) => {
                  buttonRefs.current[2] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, 2)}
                onMouseLeave={() => handleMouseLeave(2)}
                className="text-16-medium rounded-full bg-white px-10! py-6! font-medium text-black hover:bg-white/90"
                style={{ transition: "transform 0.2s ease" }}
              >
                <Link href={`/patients/${user.$id}/dashboard`}>
                  Open Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                ref={(el) => {
                  buttonRefs.current[2] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, 2)}
                onMouseLeave={() => handleMouseLeave(2)}
                className="text-16-medium rounded-full bg-white px-10! py-6! font-medium text-black hover:bg-white/90"
                style={{ transition: "transform 0.2s ease" }}
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
