// components/home/HeroSection.tsx
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const customEase: [number, number, number, number] = [0.76, 0, 0.24, 1];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: customEase,
    },
  },
};

interface HeroSectionProps {
  user: User | null;
  particles: { left: number; top: number; duration: number; delay: number }[];
}

export default function HeroSection({ user, particles }: HeroSectionProps) {
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
    <motion.section className="relative flex min-h-screen items-center pt-16">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-150 w-150 rounded-full bg-emerald-500/2 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-100 w-100 rounded-full bg-blue-500/2 blur-3xl" />

        {/* Animated particles */}
        {particles.map((p, i) => (
          <motion.div
            key={String(i)}
            className="absolute h-1 w-1 rounded-full bg-emerald-400/20"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-3xl"
        > */}
      <div className="container pt-32 pb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-3xl"
        >
          {/* Label */}
          <motion.div variants={fadeUpItem} className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/2 px-4 py-2 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-medium tracking-wider text-white/50 uppercase sm:text-base">
                Next‑Gen Healthcare Platform
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeUpItem}
            className="mb-8 leading-[1.05] font-bold tracking-tight"
          >
            <span className="block text-[4rem] text-white max-[350px]:text-5xl md:text-8xl lg:text-9xl">
              Care that
            </span>
            <span className="block text-[4rem] text-white/20 max-[350px]:text-5xl md:text-8xl lg:text-9xl">
              flows like
            </span>
            <span className="block bg-linear-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-[4rem] text-transparent max-[400px]:text-5xl md:text-8xl lg:text-9xl">
              clockwork.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUpItem}
            className="mb-12 max-w-xl text-lg leading-relaxed text-white/40"
          >
            A singular, focused platform for DocSync patients—register, book,
            and manage appointments with clinical precision. No clutter, no
            chaos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUpItem} className="flex flex-wrap gap-4">
            {user ? (
              <Button
                asChild
                ref={(el) => {
                  buttonRefs.current[1] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, 1)}
                onMouseLeave={() => handleMouseLeave(1)}
                className="group text-16-medium rounded-full bg-white px-8! py-6! font-medium text-black transition-all hover:bg-white/90"
                style={{ transition: "transform 0.2s ease" }}
              >
                <Link href={`/patients/${user.$id}/dashboard`}>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  ref={(el) => {
                    buttonRefs.current[1] = el;
                  }}
                  onMouseMove={(e) => handleMouseMove(e, 1)}
                  onMouseLeave={() => handleMouseLeave(1)}
                  className="group text-16-medium rounded-full bg-white px-8! py-6! font-medium text-black transition-all hover:bg-white/90"
                  style={{ transition: "transform 0.2s ease" }}
                >
                  <Link href="/register">
                    Begin Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-16-medium rounded-full border border-white/8 px-8! py-6! text-white/50 hover:bg-white/3 hover:text-white/70"
                >
                  <Link href="#how-it-works">
                    See How It Works
                    <ChevronDown className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-white/20" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
