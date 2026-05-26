"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { memo } from "react";

const STATS = [
  { value: "5,000+", label: "Registered Patients" },
  { value: "12K+", label: "Appointments Booked" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 2min", label: "Avg. Booking Time" },
];

const STARS_ARR = [...Array(5)];

const SocialProofSection = memo(() => {
  return (
    <section className="relative border-t border-white/4 py-32">
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            {STARS_ARR.map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-emerald-400 text-emerald-400"
              />
            ))}
          </div>
          <blockquote className="mx-auto mb-6 max-w-3xl text-3xl leading-tight font-bold text-white md:text-4xl">
            "DocSync transformed our practice. Patients book faster, admin work
            dropped 60%, and our staff finally has room to breathe."
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
          {STATS.map((stat, i) => (
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
  );
});

export default SocialProofSection;

SocialProofSection.displayName = "SocialProofSection";
