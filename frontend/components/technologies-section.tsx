"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const techs = [
  { name: "Python", desc: "Pipeline orchestration" },
  { name: "OpenCV", desc: "Classical CV pipeline" },
  { name: "TensorFlow", desc: "Deep learning models" },
  { name: "Next.js", desc: "App router frontend" },
  { name: "TailwindCSS", desc: "Design system" },
  { name: "AI Vision APIs", desc: "ADAS integrations" },
];

export function TechnologiesSection() {
  return (
    <section id="tech" className="border-b border-zinc-100 bg-zinc-50/60">
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="brand">Stack</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Powered by a world-class stack
          </h2>
          <p className="mt-3 text-zinc-600">
            Battle-tested open-source tools combined with proprietary models —
            production-ready from day one.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {techs.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 font-display text-sm font-semibold text-brand-700">
                  {t.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <div className="font-display text-base font-semibold text-zinc-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-zinc-500">{t.desc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
