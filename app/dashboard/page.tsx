"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  { title: "Tournaments", href: "/participants" },
  { title: "Sponsorship Management", href: "/sponsorship" },
  { title: "Gallery", href: "/gallery" },
  { title: "Past Tournaments", href: "/past-tournaments" },
  { title: "Forms", href: "/forms" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-neutral-600 mt-1">Choose a section to manage.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="block group">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Card className="rounded-2xl h-48 border-neutral-200/70 overflow-hidden transition-all duration-200 group-hover:shadow-lg">
                <CardContent className="relative h-full p-6 bg-gradient-to-br from-white to-neutral-50 group-hover:from-neutral-50 group-hover:to-white">
                  <div className="flex items-start justify-between">
                    <span className="text-lg font-semibold text-neutral-800 group-hover:text-neutral-900">
                      {c.title}
                    </span>
                    <motion.span
                      className="inline-flex items-center justify-center rounded-full border border-neutral-200 text-neutral-500 group-hover:text-neutral-900 group-hover:border-neutral-300 p-2"
                      whileHover={{ rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </motion.span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neutral-200/20 blur-2xl group-hover:bg-neutral-300/30 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
