"use client";

import { motion, useInView } from "framer-motion";
import { Activity, Cpu, Gauge, LineChart, Map, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

const accuracySeries = [
  62, 68, 71, 74, 76, 80, 83, 84, 86, 87, 88, 90, 91, 92, 93, 95, 96, 96, 97,
  98, 98, 99, 99, 99,
];

const heatmap = Array.from({ length: 8 }, () =>
  Array.from({ length: 14 }, () => Math.random())
);

export function AnalyticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section id="analytics" className="border-b border-zinc-100">
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="brand">Telemetry</Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Mission-control analytics
          </h2>
          <p className="mt-3 text-zinc-600">
            Track accuracy, latency, model confidence and road conditions in one
            place.
          </p>
        </motion.div>

        <div ref={ref} className="mt-12 grid gap-4 lg:grid-cols-3">
          <StatCard
            icon={TrendingUp}
            label="Lane Accuracy"
            target={99.4}
            unit="%"
            sub="+0.6% wk/wk"
            active={inView}
          />
          <StatCard
            icon={Gauge}
            label="P50 Latency"
            target={24}
            unit=" ms"
            sub="-3ms wk/wk"
            active={inView}
          />
          <StatCard
            icon={Cpu}
            label="Active Inference"
            target={1284}
            unit=" runs/s"
            sub="across 14 regions"
            active={inView}
          />

          <AccuracyChart active={inView} />
          <ConfidenceMeter active={inView} />

          <Heatmap active={inView} />
          <RoadConditions />
          <PerformanceRibbon />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  label,
  target,
  unit,
  sub,
  active,
}: {
  icon: typeof Cpu;
  label: string;
  target: number;
  unit: string;
  sub: string;
  active: boolean;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-[10px] uppercase tracking-wider text-zinc-400">
          live
        </span>
      </div>
      <div className="mt-4">
        <div className="text-xs uppercase tracking-wider text-zinc-500">
          {label}
        </div>
        <div className="mt-0.5 font-display text-3xl font-semibold tracking-tight text-zinc-900">
          {target % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}
          <span className="text-zinc-400 text-lg">{unit}</span>
        </div>
        <div className="mt-1 text-xs text-zinc-500">{sub}</div>
      </div>
    </motion.div>
  );
}

function AccuracyChart({ active }: { active: boolean }) {
  const w = 600;
  const h = 200;
  const max = 100;
  const min = 50;
  const points = accuracySeries.map((v, i) => {
    const x = (i / (accuracySeries.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y] as const;
  });
  const d = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-brand-600" />
          <h3 className="font-display text-base font-semibold text-zinc-900">
            Lane Accuracy · 24h
          </h3>
        </div>
        <Badge variant="green">+12.3%</Badge>
      </div>

      <div className="relative mt-5">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full">
          <defs>
            <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line
              key={g}
              x1="0"
              x2={w}
              y1={(h / 3) * g}
              y2={(h / 3) * g}
              stroke="#e4e4e7"
              strokeDasharray="3 6"
            />
          ))}
          <motion.path
            d={area}
            fill="url(#area-grad)"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d={d}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={active ? { pathLength: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          {points.map(([x, y], i) =>
            i === points.length - 1 ? (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="#dbeafe" />
                <circle cx={x} cy={y} r="3" fill="#2563eb" />
              </g>
            ) : null
          )}
        </svg>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>now</span>
        </div>
      </div>
    </motion.div>
  );
}

function ConfidenceMeter({ active }: { active: boolean }) {
  const value = 98.7;
  const c = 2 * Math.PI * 70;
  const offset = c * (1 - value / 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-zinc-900">
          AI Confidence
        </h3>
        <Badge>LaneNet</Badge>
      </div>
      <div className="relative my-3 flex justify-center">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#f4f4f5"
            strokeWidth="10"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#2563eb"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={active ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-3xl font-semibold text-zinc-900">
            {value}%
          </div>
          <div className="text-xs text-zinc-500">Belief score</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { l: "Day", v: "99.1%" },
          { l: "Dusk", v: "98.3%" },
          { l: "Night", v: "96.7%" },
        ].map((x) => (
          <div
            key={x.l}
            className="rounded-md border border-zinc-200 bg-zinc-50/60 px-2 py-1.5 text-center"
          >
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">
              {x.l}
            </div>
            <div className="text-xs font-medium text-zinc-900">{x.v}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Heatmap({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-brand-600" />
          <h3 className="font-display text-base font-semibold text-zinc-900">
            Detection Heatmap
          </h3>
        </div>
        <Badge variant="green">14 regions</Badge>
      </div>

      <div className="mt-5 grid gap-1">
        {heatmap.map((row, r) => (
          <div
            key={r}
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
          >
            {row.map((v, c) => (
              <motion.span
                key={c}
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: (r + c) * 0.01 }}
                className="block aspect-square rounded-sm"
                style={{
                  background:
                    v > 0.8
                      ? "#2563eb"
                      : v > 0.6
                      ? "#60a5fa"
                      : v > 0.4
                      ? "#bfdbfe"
                      : v > 0.2
                      ? "#dbeafe"
                      : "#f4f4f5",
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>low traffic</span>
        <div className="flex items-center gap-1">
          {["#f4f4f5", "#dbeafe", "#bfdbfe", "#60a5fa", "#2563eb"].map((g, i) => (
            <span
              key={i}
              className="h-2 w-6 rounded-sm"
              style={{ background: g }}
            />
          ))}
        </div>
        <span>high traffic</span>
      </div>
    </motion.div>
  );
}

function RoadConditions() {
  const items = [
    { l: "Dry", v: 68 },
    { l: "Wet", v: 21 },
    { l: "Snow", v: 7 },
    { l: "Fog", v: 4 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-600" />
          <h3 className="font-display text-base font-semibold text-zinc-900">
            Road Conditions
          </h3>
        </div>
        <Badge>7d</Badge>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((i, idx) => (
          <div key={i.l}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-700">{i.l}</span>
              <span className="text-xs text-zinc-500">{i.v}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${i.v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: idx * 0.08 }}
                className="h-full bg-brand-600"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PerformanceRibbon() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-brand-600" />
          <h3 className="font-display text-base font-semibold text-zinc-900">
            Performance · global
          </h3>
        </div>
        <span className="flex items-center gap-2 text-xs text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          all systems nominal
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "us-east-1", g: "92%" },
          { l: "eu-west-2", g: "86%" },
          { l: "ap-south-1", g: "74%" },
          { l: "ap-northeast-1", g: "81%" },
        ].map((r) => (
          <div
            key={r.l}
            className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{r.l}</span>
              <span className="text-xs font-medium text-zinc-900">{r.g}</span>
            </div>
            <div className="mt-3 flex items-end gap-0.5 h-10">
              {Array.from({ length: 22 }).map((_, i) => (
                <span
                  key={i}
                  className="w-full rounded-sm bg-brand-200"
                  style={{
                    height: `${20 + Math.sin(i / 2) * 24 + (i % 5) * 6}%`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
