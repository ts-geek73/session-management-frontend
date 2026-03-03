"use client";

import ActivityLogTable from "@/components/dashboard/ActivityLogTable";
import ContentGrid from "@/components/dashboard/ContentGrid";
import DashboardSection from "@/components/dashboard/DashboardSection";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface Content {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

interface TrackedSession {
  id: string;
  content_id: string;
  created_at: string;
  status: string;
  contents: {
    title: string;
  };
}

const HomePage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [sessions, setSessions] = useState<TrackedSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
      try {
        const [contentsRes, sessionsRes] = await Promise.all([
          fetch(`${backendUrl}/api/contents`, { cache: "no-store" }),
          fetch(`${backendUrl}/api/sessions`, { cache: "no-store" }),
        ]);

        const [contentsJson, sessionsJson] = await Promise.all([
          contentsRes.json(),
          sessionsRes.json(),
        ]);

        if (contentsJson.success) setContents(contentsJson.data);
        if (sessionsJson.success) setSessions(sessionsJson.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-5xl w-full [&>*]:py-8 divide-y divide-zinc-200">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Control Dashboard
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Manage operational units and monitor session activity logs.
          </p>
        </div>
        <div className="flex gap-4">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 border-zinc-200 text-zinc-400 font-bold bg-zinc-50 tracking-widest text-[10px] uppercase"
          >
            System Online
          </Badge>
        </div>
      </header>

      <DashboardSection title="Operational Modules">
        <ContentGrid contents={contents} loading={loading} />
      </DashboardSection>

      <DashboardSection title="Activity Log" badgeCount={sessions.length}>
        <ActivityLogTable sessions={sessions} loading={loading} />
      </DashboardSection>
    </div>
  );
};

export default HomePage;
