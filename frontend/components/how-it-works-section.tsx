"use client";

import { motion } from "framer-motion";
import { Brain, CloudCog, Layers, ScanLine, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Upload,
    title: "Upload Road Video",
    desc: "Stream from a dashcam, fleet bucket, or sensor SDK. Encrypted in transit and at rest.",
  },
  {
    icon: CloudCog,
    title: "AI Processing Starts",
    desc: "Inference cluster spins up GPU pods. Frames are decoded, batched, and dispatched.",
  },
  {
    icon: ScanLine,
    title: "OpenCV Detects Lanes",
    desc: "Color masking, ROI projection, Canny edges, and Hough transforms isolate lane candidates.",
  },
  {
    icon: Brain,
    title: "TensorFlow Analyzes Frames",
    desc: "Distilled LaneNet refines geometry — curvature, drift, lane type — at 60+ FPS.",
  },
  {
    icon: Layers,
    title: "Cloud Dashboard Displays Results",
    desc: "Per-frame overlays, analytics, heatmaps, and downloadable telemetry are pushed live.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how" className="border-b border-zinc-100 bg-zinc-50/60">
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="brand">Pipeline</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            How LaneAI works
          </h2>
          <p className="mt-3 text-zinc-600">
            Five stages, one frame. From ingestion to insight in under a second.
          </p>
        </motion.div>

        <ol className="relative mt-12 grid gap-4 lg:grid-cols-5">
          <span
            aria-hidden
            className="absolute left-5 top-5 hidden h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-zinc-200 via-zinc-200 to-transparent lg:block"
          />
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative rounded-xl border border-zinc-200 bg-white p-5"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-medium text-zinc-400">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-zinc-900">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {s.desc}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
