"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ParticipantsModule from "@/components/participants/ParticipantsModule";
import TimelineView from "@/components/participants/TimelineView";

export default function ParticipantsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = (searchParams.get("tab") as "participants" | "timeline") || "participants";
  const [activeTab, setActiveTab] = useState<"participants" | "timeline">(initial);

  useEffect(() => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.set("tab", activeTab);
    router.replace(`/participants?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const TabButton = ({ id, label }: { id: "participants" | "timeline"; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={
        `px-3 py-2 text-sm rounded-none border-b-2 transition-colors ` +
        (activeTab === id
          ? "border-neutral-900 text-neutral-900 font-semibold"
          : "border-transparent text-neutral-500 hover:text-neutral-900")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-neutral-200">
        <TabButton id="participants" label="Participants" />
        <TabButton id="timeline" label="Timeline" />
      </div>
      <div className="mt-2">
        {activeTab === "participants" ? <ParticipantsModule /> : <TimelineView />}
      </div>
    </div>
  );
}
