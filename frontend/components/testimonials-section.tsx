"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    name: "Dr. Aiko Tanaka",
    role: "Lead AV Engineer · OrbitDrive Robotics",
    avatar: "AT",
    quote:
      "LaneAI dropped our perception latency below 30ms across the fleet. The cloud replay tooling alone saved us months of dataset labeling.",
  },
  {
    name: "Marcus Holloway",
    role: "AI Developer · Velocity Labs",
    avatar: "MH",
    quote:
      "We replaced three internal services with a single LaneAI endpoint. The dashboard is exactly what our team needed.",
  },
  {
    name: "Priya Raghavan",
    role: "Computer Vision Researcher · Helix Mobility",
    avatar: "PR",
    quote:
      "Accuracy in heavy rain went from a constant headache to a non-issue. The TensorFlow models hold up beautifully on edge hardware.",
  },
  {
    name: "Felix Brenner",
    role: "ADAS Architect · Autobahn Systems",
    avatar: "FB",
    quote:
      "Production-grade signal quality with the developer experience of a hobby project. Loving every minute of it.",
  },
  {
    name: "Sofia Becker",
    role: "Perception Lead · Skyline Robotics",
    avatar: "SB",
    quote:
      "The analytics dashboard turned our weekly review meeting into a five-minute glance. Well-instrumented AI is magical.",
  },
  {
    name: "Daniel Park",
    role: "Founder · Lumen Drive",
    avatar: "DP",
    quote:
      "We shipped lane-keep, drift detection, and depart-warning in two weeks. LaneAI is an unfair advantage.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="border-b border-zinc-100">
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="brand">Customers</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Trusted by autonomous teams
          </h2>
          <p className="mt-3 text-zinc-600">
            Robotics startups, AV labs, and mobility platforms ship faster with
            LaneAI on the road.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-zinc-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 font-display text-sm font-semibold text-brand-700">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-display text-sm font-semibold text-zinc-900">
                    {t.name}
                  </div>
                  <div className="text-xs text-zinc-500">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
