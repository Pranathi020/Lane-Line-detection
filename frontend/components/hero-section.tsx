"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/hero-visual";

const stats = [
  { label: "Detection Accuracy", value: "99.4%" },
  { label: "Avg Latency", value: "24 ms" },
  { label: "Frames Analyzed", value: "12.8B" },
  { label: "Active Fleets", value: "84K+" },
];

export function HeroSection() {
  return (
    <section id="top" className="border-b border-zinc-100">
      <div className="container py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="brand">Vision 4.0 · Cloud Ready</Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 font-display text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl"
            >
              AI Lane Line
              <br />
              Detection System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-lg text-base text-zinc-600 md:text-lg"
            >
              Cloud-powered computer vision platform for intelligent road lane
              detection using OpenCV and TensorFlow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button variant="primary" size="lg" asChild>
                <a href="#demo">
                  Start Detection
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <a href="#demo">
                  <Play className="h-4 w-4" />
                  Watch Demo
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl font-semibold text-zinc-900">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
