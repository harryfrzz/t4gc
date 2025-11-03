"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ParticipantsModule from "@/components/participants/ParticipantsModule";
import TimelineView from "@/components/participants/TimelineView";
import FixtureGenerator from "@/components/participants/FixtureGenerator";
import { useAuth } from "@/lib/auth-context";

function ParticipantsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const initial = (searchParams.get("tab") as "participants" | "timeline" | "fixtures") || "participants";
  const [activeTab, setActiveTab] = useState<"participants" | "timeline" | "fixtures">(initial);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const isEventHoster = user?.role === "event-hoster";

  useEffect(() => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.set("tab", activeTab);
    router.replace(`/participants?${sp.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const TabButton = ({ id, label }: { id: "participants" | "timeline" | "fixtures"; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={
        `px-3 py-2 text-sm rounded-none border-b-2 transition-colors ` +
        (activeTab === id
          ? "border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100 font-semibold"
          : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100")
      }
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800">
        <TabButton id="participants" label="Participants" />
        <TabButton id="timeline" label="Timeline" />
        <TabButton id="fixtures" label="Fixtures" />
      </div>
      <div className="mt-2">
        {activeTab === "participants" ? (
          <ParticipantsModule onParticipantsChange={setParticipants} />
        ) : activeTab === "timeline" ? (
          <TimelineView />
        ) : (
          <FixtureGenerator participants={participants} isEventHoster={isEventHoster} />
        )}
      </div>
    </div>
  );
}

export default function ParticipantsPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
      <ParticipantsContent />
    </Suspense>
  );
}
