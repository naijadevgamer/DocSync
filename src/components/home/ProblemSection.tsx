"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { customEase } from "@/constants";

const staggerEase: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ProblemSection() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="container">
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
                  <span className="text-14-regular text-white/50">{item}</span>
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
  );
}
