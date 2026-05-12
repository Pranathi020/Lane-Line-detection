"use client";

import { motion } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  Cpu,
  Film,
  Gauge,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fileQueue = [
  { name: "highway_dashcam_4k.mp4", size: "284 MB", status: "Analyzing", progress: 78 },
  { name: "urban_route_42.mov", size: "612 MB", status: "Queued", progress: 32 },
  { name: "tunnel_pass_night.mp4", size: "178 MB", status: "Queued", progress: 10 },
];

const roadStats = [
  { label: "Lane Type", value: "Solid · Dashed" },
  { label: "Road Surface", value: "Dry Asphalt" },
  { label: "Visibility", value: "Excellent" },
  { label: "Curve Direction", value: "Right · 0.7°" },
  { label: "Vehicle Drift", value: "0.03 m" },
  { label: "Recommendation", value: "Maintain Lane" },
];

export function LiveDemoSection() {
  return (
    <section id="demo" className="border-b border-zinc-100 bg-zinc-50/60">
      <div className="container py-20">
        <SectionHeader
          eyebrow="Live Demo"
          title="Real-Time Lane Detection"
          description="Upload footage or stream from a vehicle camera. LaneAI locks onto lanes in milliseconds."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <DetectionViewport />
          <div className="space-y-6">
            <UploadCard />
            <ConfidencePanel />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RoadAnalysisPanel />
          <DetectionLog />
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.5 }}
      className={
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }
    >
      <Badge variant="brand">{eyebrow}</Badge>
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-zinc-600">{description}</p>
    </motion.div>
  );
}

function DetectionViewport() {
  const [fps, setFps] = useState(60);
  const [conf, setConf] = useState(98.7);

  useEffect(() => {
    const id = setInterval(() => {
      setFps((v) => Math.max(57, Math.min(62, v + (Math.random() - 0.5) * 2)));
      setConf((v) =>
        Math.max(96.5, Math.min(99.6, v + (Math.random() - 0.5) * 0.6))
      );
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-zinc-500" />
          <span className="text-sm font-medium text-zinc-700">CAM_FRONT · highway_a1</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-900">{fps.toFixed(0)}</span> FPS
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-zinc-400" />
            GPU 64%
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-b from-zinc-50 to-zinc-100">
        <div
          className="absolute inset-x-[6%] bottom-0 top-[14%] rounded-t-[50%] bg-gradient-to-b from-transparent to-zinc-200/70"
          style={{ transform: "rotateX(60deg) scale(1.15)" }}
        />

        {[
          { left: "30%", color: "#2563eb", skew: -24 },
          { left: "70%", color: "#10b981", skew: 24 },
          { left: "50%", color: "#8b5cf6", skew: 0, w: 1 },
        ].map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
            className="absolute bottom-0 top-[18%] origin-bottom"
            style={{
              left: l.left,
              width: l.w ?? 2,
              background: l.color,
              transform: `translateX(-50%) skewX(${l.skew}deg)`,
            }}
          />
        ))}

        <BoundingBox style={{ left: "26%", top: "44%", width: "12%", height: "16%" }} label="Vehicle · 0.94" tint="#2563eb" />
        <BoundingBox style={{ left: "60%", top: "48%", width: "14%", height: "14%" }} label="Vehicle · 0.88" tint="#10b981" />

        <div className="absolute right-4 top-4 grid w-44 gap-1.5">
          <HudRow label="Lanes Found" value="2" />
          <HudRow label="Curvature" value="312 m" />
          <HudRow label="Latency" value="24 ms" />
          <HudRow label="Confidence" value={`${conf.toFixed(1)}%`} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px border-t border-zinc-100 bg-zinc-100 text-sm">
        {[
          { label: "Frame", value: "184,532" },
          { label: "Inference", value: "11.2 ms" },
          { label: "Confidence", value: `${conf.toFixed(2)}%` },
        ].map((m) => (
          <div key={m.label} className="flex items-center justify-between bg-white px-4 py-3">
            <span className="text-xs text-zinc-500">{m.label}</span>
            <span className="font-medium text-zinc-900">{m.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function HudRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white/90 px-2.5 py-1.5 backdrop-blur">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-[11px] font-medium text-zinc-900">{value}</span>
    </div>
  );
}

function BoundingBox({
  style,
  label,
  tint,
}: {
  style: React.CSSProperties;
  label: string;
  tint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="absolute rounded"
      style={{ ...style, border: `1.5px solid ${tint}` }}
    >
      <span
        className="absolute -top-5 left-0 rounded bg-white px-1.5 py-0.5 text-[9px] font-medium"
        style={{ color: tint, border: `1px solid ${tint}` }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function UploadCard() {
  const [drag, setDrag] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-base font-semibold text-zinc-900">
            Upload Footage
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">.mp4 · .mov · .mkv up to 2GB</p>
        </div>
        <Badge variant="green">Encrypted</Badge>
      </div>

      <label
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center transition-colors ${
          drag
            ? "border-brand-500 bg-brand-50"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
        }`}
      >
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Upload className="h-4 w-4" />
        </div>
        <div className="mt-2.5 text-sm font-medium text-zinc-900">
          Drop video or <span className="text-brand-600">browse files</span>
        </div>
        <input type="file" className="sr-only" />
      </label>

      <div className="mt-4 space-y-2">
        {fileQueue.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2.5"
          >
            <span className="grid h-7 w-7 place-items-center rounded bg-white border border-zinc-200">
              <Film className="h-3.5 w-3.5 text-zinc-500" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-zinc-700">
                {f.name}
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${f.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-brand-600"
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-500">{f.size}</div>
              <div
                className={`text-[10px] font-medium ${
                  f.status === "Analyzing" ? "text-emerald-600" : "text-zinc-500"
                }`}
              >
                {f.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="primary" className="mt-5 w-full" size="lg">
        Run Detection
      </Button>
    </motion.div>
  );
}

function ConfidencePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-base font-semibold text-zinc-900">
            AI Confidence
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            Last 240 frames · LaneNet v2.4
          </p>
        </div>
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="font-display text-3xl font-semibold text-zinc-900">
          98.7%
        </span>
        <span className="text-xs font-medium text-emerald-600">+1.4% vs avg</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "98.7%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-brand-600"
        />
      </div>

      <div className="mt-5 grid grid-cols-7 items-end gap-1 h-16">
        {[42, 55, 60, 68, 72, 81, 85, 88, 90, 92, 94, 95, 97, 98].map((v, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.025 }}
            className="block w-full origin-bottom rounded-sm bg-brand-200"
            style={{ height: `${v}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function RoadAnalysisPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-base font-semibold text-zinc-900">
            Road Analysis
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">
            Signals fused from the perception stack
          </p>
        </div>
        <Badge>Fused</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {roadStats.map((r) => (
          <div
            key={r.label}
            className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
              {r.label}
            </div>
            <div className="mt-1 text-sm font-medium text-zinc-900">
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const detectionLog = [
  { t: "00:00:01.124", msg: "Frame buffer initialized · 1920x1080 @ 60fps" },
  { t: "00:00:01.219", msg: "OpenCV Canny edges · σ=1.2 threshold=80/180" },
  { t: "00:00:01.302", msg: "Hough transform · 412 segments → 2 dominant lanes" },
  { t: "00:00:01.348", msg: "TensorFlow LaneNet · confidence 0.987" },
  { t: "00:00:01.402", msg: "Curve fit · radius 312m · deviation 0.03m" },
  { t: "00:00:01.475", msg: "Stream → cloud edge · latency 24ms" },
];

function DetectionLog() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-zinc-500" />
          <span className="font-display text-base font-semibold text-zinc-900">
            Pipeline Log
          </span>
        </div>
        <span className="text-xs text-emerald-600">stream ok</span>
      </div>
      <div className="mt-3 space-y-2 font-mono text-xs">
        {detectionLog.map((l) => (
          <div key={l.t} className="flex gap-3">
            <span className="text-zinc-400">{l.t}</span>
            <span className="text-zinc-700">{l.msg}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
