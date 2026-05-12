"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { memo } from "react";

const SECURITY_FEATURES = [
  "256-bit AES encryption at rest and in transit",
  "HIPAA & GDPR compliant data handling",
  "Multi-factor authentication support",
  "Automated session management",
];

const TrustSection = memo(() => {
  return (
    <section className="relative border-t border-white/4 py-32">
      <div className="container">
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
              {SECURITY_FEATURES.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Shield className="h-5 w-5 text-emerald-400" />
                  <span className="text-14-regular text-white/50">{item}</span>
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
                      <div className="text-12-medium text-white/60">{cert}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default TrustSection;

TrustSection.displayName = "TrustSection";
