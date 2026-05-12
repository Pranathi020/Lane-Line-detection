"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const inquiryTypes = [
  "Fleet Integration",
  "Research",
  "Custom Model",
  "Pilot Program",
];

const contactRows = [
  { icon: Mail, label: "Email", value: "baddulapranathi@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: MapPin, label: "HQ", value: "India" },
];

export function ContactSection() {
  const [type, setType] = useState(inquiryTypes[0]);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="border-b border-zinc-100 bg-zinc-50/60">
      <div className="container py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="brand">Connect</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              Talk to the LaneAI team
            </h2>
            <p className="mt-3 max-w-md text-zinc-600">
              Bring us your fleet, your dataset, or your most painful edge case.
              We respond within one business day.
            </p>

            <ul className="mt-8 space-y-3">
              {contactRows.map((c) => {
                const Icon = c.icon;
                return (
                  <li
                    key={c.label}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-50 text-brand-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-xs text-zinc-500">{c.label}</div>
                      <div className="text-sm font-medium text-zinc-900">
                        {c.value}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              setTimeout(() => setSubmitted(false), 3200);
            }}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div className="font-display text-lg font-semibold text-zinc-900">
              Project Inquiry
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              We’ll get back to you within 24 hours.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input
                  required
                  placeholder="Jane Doe"
                  name="name"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email">
                <Input
                  required
                  type="email"
                  placeholder="jane@company.com"
                  name="email"
                  autoComplete="email"
                />
              </Field>
            </div>

            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-zinc-700">
                Project Inquiry
              </div>
              <div className="flex flex-wrap gap-2">
                {inquiryTypes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      type === t
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Field label="Message">
                <Textarea
                  required
                  rows={5}
                  name="message"
                  placeholder="Tell us about your project, fleet size, or research goals…"
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">
                By submitting, you agree to LaneAI’s terms.
              </p>
              <Button variant="primary" type="submit">
                {submitted ? "Message Sent" : "Send Message"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
              >
                Thanks — our team will be in touch within one business day.
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      {children}
    </label>
  );
}
