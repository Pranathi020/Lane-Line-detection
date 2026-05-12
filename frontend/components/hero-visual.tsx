"use client";

import Image from "next/image";
import { Activity, Cpu, Gauge } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-600" />
            <span className="text-xs font-medium text-zinc-700">
              LANE DETECTION · highway
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
          <Image
            src="https://raw.githubusercontent.com/OanaGaskey/Advanced-Lane-Detection/master/output_images/advanced_lane_finding.gif"
            alt="Advanced lane line detection with red, green, and blue lane overlays on highway footage"
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <Chip icon={Cpu} label="Model" value="OpenCV · TF" />
            <Chip icon={Gauge} label="FPS" value="60" />
          </div>

          <div className="absolute bottom-12 right-3 rounded-lg border border-white/60 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
              Curvature
            </div>
            <div className="font-display text-sm font-semibold text-zinc-900">
              312 m
            </div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-md border border-white/60 bg-white/85 px-3 py-1.5 text-xs backdrop-blur">
            <span className="flex items-center gap-2 text-zinc-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Detection Active · 2 lanes
            </span>
            <span className="text-zinc-700">
              Confidence{" "}
              <span className="font-medium text-brand-600">98.7%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -left-4 top-16 hidden rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-sm lg:block">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">
          Throughput
        </div>
        <div className="font-display text-sm font-semibold text-zinc-900">
          128 GF/s
        </div>
      </div>
    </div>
  );
}

function Chip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/60 bg-white/85 px-2 py-1 backdrop-blur">
      <Icon className="h-3 w-3 text-zinc-500" />
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <span className="text-[10px] font-medium text-zinc-800">{value}</span>
    </div>
  );
}
