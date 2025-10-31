"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

const timelineEvents = [
  { title: "Registration", description: "Teams can register for the tournament.", startDate: "30 Sep 2025", endDate: "26 Oct 2025", status: "completed" },
  { title: "Team Formation", description: "Teams must have 2–4 members to participate.", startDate: "01 Oct 2025", endDate: "26 Oct 2025", status: "completed" },
  { title: "Idea Submission", description: "Teams submit their gameplay strategy document.", startDate: "01 Oct 2025", endDate: "26 Oct 2025", status: "completed" },
  { title: "Idea Evaluation Phase", description: "Judges evaluate team submissions.", startDate: "27 Oct 2025", endDate: "31 Oct 2025", status: "ongoing" },
  { title: "Final Tournament", description: "Shortlisted teams compete in the final event.", startDate: "01 Nov 2025", endDate: "05 Nov 2025", status: "upcoming" },
] as const;

type Status = "completed" | "ongoing" | "upcoming";

const statusClasses: Record<Status, string> = {
  completed: "bg-blue-50 border-blue-100",
  ongoing: "bg-green-50 border-green-100",
  upcoming: "bg-red-50 border-red-100",
};

const statusBadge: Record<Status, string> = {
  completed: "Completed",
  ongoing: "Ongoing",
  upcoming: "Upcoming",
};

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Timeline</h1>
        <Link href="/participants" className="text-sm underline text-neutral-600 hover:text-neutral-900">Back to Tournaments</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Timeline column */}
        <div>
          <div className="relative pl-6">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200" />
            <div className="space-y-4">
              {timelineEvents.map((e, idx) => (
                <motion.div
                  key={e.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="relative"
                >
                  {/* dot */}
                  <div className="absolute -left-[7px] top-6 h-3 w-3 rounded-full bg-neutral-400" />

                  <Card className={`border ${statusClasses[e.status as Status]} rounded-xl shadow-sm`}> 
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="text-sm text-neutral-600">
                          <div className="font-medium text-neutral-800">{e.startDate} → {e.endDate}</div>
                        </div>
                        <Badge variant="outline">{statusBadge[e.status as Status]}</Badge>
                      </div>
                      <div className="mt-2">
                        <div className="text-base font-semibold text-neutral-900">{e.title}</div>
                        <p className="text-sm text-neutral-700 mt-1">{e.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="lg:sticky lg:top-6">
          <Card className="rounded-xl shadow-sm">
            <CardContent className="p-5 space-y-3">
              <div>
                <div className="text-sm text-neutral-500">Tournament</div>
                <div className="text-lg font-semibold">Y-Ultimate Cup 2025</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Registration deadline</div>
                <div className="font-medium">26 Oct 2025</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Countdown</div>
                <div className="font-mono">03d : 14h : 22m</div>
              </div>
              <button className="w-full h-10 rounded-md bg-neutral-900 text-white font-medium disabled:opacity-50">
                Register
              </button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
