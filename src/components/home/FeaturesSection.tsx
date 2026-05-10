"use client";

import { customEase } from "@/constants";
import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="relative border-t border-white/4 py-32">
      <div className="container">
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

        <div className="grid gap-8 overflow-hidden lg:grid-cols-3">
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
  );
}
