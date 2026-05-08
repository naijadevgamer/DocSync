"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Shield,
  Clock,
  FileText,
  CheckCircle2,
  Star,
  Users,
  Calendar,
  User,
  Settings,
  HelpCircle,
  X,
  Menu,
  LayoutDashboard,
  LogOut,
  Loader2,
} from "lucide-react";
import FullLogo from "../FullLogo";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logoutUser } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Custom easing for expensive-feeling animations
const customEase: [number, number, number, number] = [0.76, 0, 0.24, 1];
const staggerEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// Stagger animation variants
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

const scaleReveal = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: customEase,
    },
  },
};

export default function ClientHome({ user }: { user: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingLogOut, setLoadingLogOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoadingLogOut(true);

    const result = await logoutUser();

    if (!result.success) {
      console.error(result.error?.message || "Logout failed");
      toast.error(result.error?.message || "Logout failed");
      setLoadingLogOut(false);
    } else {
      setLoadingLogOut(false);
      router.refresh();
    }
  };
  const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easing },
    },
  };

  // Magnetic button effect refs
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
    <div className="min-h-screen overflow-hidden bg-[#0D0F10] text-white">
      {/* Subtle Background Grid */}
      <div className="fixed inset-0 z-0 opacity-2">
        <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-linear(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Navigation */}
      {/* <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
        className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0D0F10]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <FullLogo />
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={`/patients/${user.$id}/dashboard`}
                  className="text-dark-600 text-sm hover:text-white"
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  // onClick={handleLogout}
                  className="text-dark-600 cursor-pointer hover:text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-14-medium text-white/60 hover:text-white"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  ref={(el) => {
                    buttonRefs.current[0] = el;
                  }}
                  onMouseMove={(e) => handleMouseMove(e, 0)}
                  onMouseLeave={() => handleMouseLeave(0)}
                  className="text-14-medium relative overflow-hidden rounded-full bg-emerald-500 px-6! py-2! font-medium text-black transition-all hover:bg-emerald-400"
                  style={{ transition: "transform 0.2s ease" }}
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.nav> */}

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: customEase, delay: 0.2 }}
        className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0D0F10]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <div className="w-30">
              <FullLogo />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <>
                <Link
                  href={`/patients/${user.$id}/dashboard`}
                  className="text-dark-600 hover:bg-dark-500/70 rounded-full px-6 py-2 text-sm transition-colors hover:text-white"
                >
                  Dashboard
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative size-9 rounded-full"
                    >
                      <Avatar className="bg-dark-500/70 size-9 border-2 border-white/40 transition-colors hover:border-green-500 hover:text-green-500">
                        <AvatarImage
                          src={"/placeholder-avatar.png"}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="">
                          <User />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 border-white/10 bg-[#1A1D20] text-white"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-gray-400">
                          {user?.email || "user@example.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className={`${loadingLogOut ? "animate-pulse" : ""} cursor-pointer text-red-400 hover:bg-white/5 hover:text-red-300 focus:bg-white/5 focus:text-red-300`}
                      disabled={loadingLogOut}
                    >
                      {loadingLogOut ? (
                        <Loader2 className="mr-2 h-4 w-4" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}

                      {loadingLogOut ? "Logging out..." : " Log out"}
                      {/* Log out */}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-14-medium text-white/60 hover:text-white"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  ref={(el) => {
                    buttonRefs.current[0] = el;
                  }}
                  onMouseMove={(e) => handleMouseMove(e, 0)}
                  onMouseLeave={() => handleMouseLeave(0)}
                  className="text-14-medium relative overflow-hidden rounded-full bg-emerald-500 px-6! py-2! font-medium text-black transition-all hover:bg-emerald-400"
                  style={{ transition: "transform 0.2s ease" }}
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

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
        {isMobileMenuOpen && (
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
                      <p className="font-medium text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/patients/${user.$id}/dashboard`}
                    className="flex items-center space-x-2 text-gray-300 transition-colors hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
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
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>

                  <Button
                    asChild
                    className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section - The Hook */}
      <motion.section
        // ref={heroRef}
        // style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative flex min-h-screen items-center pt-16"
      >
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

        <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-3xl"
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

      {/* The Problem Section - The Burden */}
      <section id="how-it-works" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24"
          >
            {/* Left - Narrative */}
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: customEase }}
                className="text-14-medium mb-6 block tracking-wider text-emerald-400/70 uppercase"
              >
                The Old Way
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: customEase, delay: 0.1 }}
                className="mb-6 text-4xl leading-tight font-bold text-white md:text-5xl"
              >
                Healthcare management shouldn't feel like a maze.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: customEase, delay: 0.2 }}
                className="mb-8 text-lg leading-relaxed text-white/35"
              >
                Endless phone calls. Scattered records. Missed appointments. The
                traditional system was built on friction, not flow. DocSync
                replaces chaos with clarity—one seamless registration, one
                intuitive booking at a time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-3"
              >
                {[
                  "Single-platform registration—no paperwork",
                  "Real-time appointment visibility",
                  "Admin scheduling with one click",
                  "HIPAA-compliant, zero-compromise security",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.4 + i * 0.1,
                      ease: staggerEase,
                    }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <span className="text-14-regular text-white/50">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right - Abstract Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: customEase, delay: 0.3 }}
              className="relative"
            >
              <div className="relative h-[50vw] overflow-hidden rounded-2xl border border-white/6 bg-white/1 backdrop-blur-sm md:h-96">
                {/* Abstract UI representation */}
                <Image
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop"
                  alt="Abstract medical chaos"
                  fill
                  className="object-cover"
                />
                <div className="bg-dark-300/40 absolute inset-0 backdrop-blur-xs" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features - The Cure with Scroll Narrative */}
      <section className="relative border-t border-white/4 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <span className="text-14-medium mb-4 block tracking-wider text-emerald-400/70 uppercase">
              The Cure
            </span>
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Three steps to streamline your care.
            </h2>
            <p className="max-w-xl text-lg text-white/35">
              From registration to appointment confirmation—every step designed
              for clarity and speed.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Register Once",
                description:
                  "Create your secure account in under 60 seconds. One form, complete profile, permanent access.",
                icon: Users,
                visual:
                  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
              },
              {
                step: "02",
                title: "Book Instantly",
                description:
                  "Browse available slots, select your preferred doctor, and confirm with a single click.",
                icon: Calendar,
                visual:
                  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1e?w=800&q=80",
              },
              {
                step: "03",
                title: "Manage Effortlessly",
                description:
                  "Track appointments, receive reminders, and let your admin handle scheduling—all in one view.",
                icon: Clock,
                visual:
                  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.1 + i * 0.15,
                  ease: customEase,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/6 bg-white/1 p-8 transition-all hover:border-emerald-500/20 hover:bg-white/2"
              >
                <div className="mb-6">
                  <span className="text-36-bold text-white/3">{item.step}</span>
                </div>

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <item.icon className="h-6 w-6 text-emerald-400" />
                </div>

                <h3 className="text-24-bold mb-3 text-white">{item.title}</h3>
                <p className="text-14-regular leading-relaxed text-white/40">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Security Section */}
      <section className="relative border-t border-white/4 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-14-medium mb-4 block tracking-wider text-emerald-400/70 uppercase">
                Trust & Security
              </span>
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Your data, protected like a vault.
              </h2>
              <p className="mb-8 text-lg text-white/35">
                HIPAA-compliant infrastructure with end-to-end encryption. Your
                medical information stays between you and your provider—always.
              </p>

              <div className="space-y-4">
                {[
                  "256-bit AES encryption at rest and in transit",
                  "HIPAA & GDPR compliant data handling",
                  "Multi-factor authentication support",
                  "Automated session management",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span className="text-14-regular text-white/50">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/6 bg-linear-to-br from-emerald-500/3 to-transparent p-12">
                <div className="text-center">
                  <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500/20">
                    <Shield className="h-10 w-10 text-emerald-400" />
                  </div>
                  <div className="text-36-bold mb-2 text-white">100%</div>
                  <div className="text-14-medium text-white/40">
                    Compliance Rate
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {["HIPAA", "SOC 2", "GDPR"].map((cert, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                        className="rounded-lg border border-white/6 bg-white/2 p-3 text-center"
                      >
                        <div className="text-12-medium text-white/60">
                          {cert}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative border-t border-white/4 py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-emerald-400 text-emerald-400"
                />
              ))}
            </div>
            <blockquote className="mx-auto mb-6 max-w-3xl text-3xl leading-tight font-bold text-white md:text-4xl">
              "DocSync transformed our practice. Patients book faster, admin
              work dropped 60%, and our staff finally has room to breathe."
            </blockquote>
            <cite className="text-14-medium text-white/40 not-italic">
              — Dr. Sarah Chen, Chief of Medicine
            </cite>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              { value: "5,000+", label: "Registered Patients" },
              { value: "12K+", label: "Appointments Booked" },
              { value: "99.9%", label: "Uptime" },
              { value: "< 2min", label: "Avg. Booking Time" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-32-bold text-white">{stat.value}</div>
                <div className="text-12-medium mt-1 text-white/30">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/4 py-32">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: customEase }}
          >
            <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              {user
                ? "Continue your journey."
                : "Ready to simplify healthcare?"}
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

      {/* Footer */}
      <footer className="relative border-t border-white/4 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="w-30">
            <FullLogo />
          </div>

          <p className="text-12-regular text-white/40">
            © {new Date().getFullYear()} DocSync. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Contact Us", href: "/contact" },

              { name: "Admin Login", href: "/login?admin=true" },
            ].map((link, i) => (
              <Link
                key={String(i)}
                href={link.href}
                className="text-12-regular text-white/40 hover:text-white/50"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
