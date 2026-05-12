"use client";

import { Github, Linkedin, Twitter, Waypoints, Youtube } from "lucide-react";

const cols = [
  {
    title: "Platform",
    links: ["Live Demo", "Features", "How It Works", "Analytics"],
  },
  {
    title: "Developers",
    links: ["Documentation", "API Reference", "Changelog", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press Kit", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Compliance"],
  },
];

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
                <Waypoints className="h-4 w-4" />
              </span>
              <span className="font-display text-base font-semibold tracking-tight text-zinc-900">
                LaneAI
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-zinc-600">
              Cloud-powered lane detection and road analytics for autonomous
              fleets, ADAS startups, and computer vision teams.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-9 w-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {c.title}
                </div>
                <ul className="mt-3 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center">
          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} LaneAI Inc. · All rights reserved.
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              All systems operational
            </span>
            <span>·</span>
            <span>v 4.0.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
