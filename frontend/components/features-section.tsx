"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Brain,
  Cloud,
  Eye,
  Navigation,
  Radar,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ScanLine,
    title: "Real-Time Lane Detection",
    desc: "Sub-30ms inference on streaming video with adaptive Hough transforms and neural refinement.",
  },
  {
    icon: Eye,
    title: "OpenCV Processing",
    desc: "Hardened classical CV pipeline — color masking, ROI, Canny edges, Hough lines.",
  },
  {
    icon: Brain,
    title: "TensorFlow AI Models",
    desc: "Fine-tuned LaneNet & SCNN architectures, distilled for edge-ready inference.",
  },
  {
    icon: Cloud,
    title: "Cloud-Based Analysis",
    desc: "Autoscaling inference cluster with replay and recompute on demand.",
  },
  {
    icon: Navigation,
    title: "Smart Road Tracking",
    desc: "Bayesian lane tracker fuses curvature, drift, and heading for stable estimates.",
  },
  {
    icon: ShieldCheck,
    title: "ADAS Assistance",
    desc: "Plug-and-play signals for lane keep, drift warning, and departure alerts.",
  },
  {
    icon: Radar,
    title: "AI Vision System",
    desc: "Multi-camera fusion with hardware-aware schedulers for Jetson, T4, and CPU.",
  },
  {
    icon: BarChart3,
    title: "High Accuracy Detection",
    desc: "99.4% benchmark across TuSimple, CULane, and proprietary night-rain datasets.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-zinc-100">
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="brand">Capabilities</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Built for autonomous-grade perception
          </h2>
          <p className="mt-3 text-zinc-600">
            Eight engineered modules wrapped in a single API.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-zinc-900">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
