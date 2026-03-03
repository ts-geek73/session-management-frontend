"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { HiArrowLeft } from "react-icons/hi2";

interface Content {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
}

interface SessionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const trackVisit = async (contentId: string) => {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
    const response = await fetch(`${backendUrl}/api/sessions/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content_id: contentId,
        status: "active",
      }),
    });

    if (response.ok) {
      console.log("✅ Activity logged to sessions table");
    }
  } catch (error) {
    console.error("❌ Error tracking session visit:", error);
  }
};

const SessionPage: React.FC<SessionPageProps> = ({ params, searchParams }) => {
  const router = useRouter();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = React.use(params);
  const { activateSession } = React.use(searchParams);
  const shouldActivate = activateSession === "true";
  const hasTracked = useRef(false);

  useEffect(() => {
    const fetchContent = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
      try {
        const res = await fetch(`${backendUrl}/api/contents/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setContent(json.data);
          if (shouldActivate && !hasTracked.current) {
            hasTracked.current = true;
            await trackVisit(json.data.id);
            // Clean up the URL after tracking
            router.replace(`/content/${json.data.id}`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id, shouldActivate, router]);

  if (loading) {
    return (
      <main className="bg-white text-zinc-400 p-8 md:p-24 flex items-center justify-center font-mono text-sm tracking-widest uppercase">
        Verifying instance access...
      </main>
    );
  }

  if (!content) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-zinc-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] min-h-[500px] p-12 space-y-5">
      <nav className="flex justify-between items-center text-xs font-medium text-zinc-400 uppercase tracking-widest border-b border-zinc-50">
        <Link
          href="/"
          className="hover:text-black transition-colors flex items-center gap-2"
        >
          <HiArrowLeft className="text-sm" />
          Dashboard
        </Link>
        <div className="flex gap-6">
          <span>Ref: {content.id.slice(0, 8)}</span>
          <span>
            {new Date(content.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </nav>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-black leading-[1.2]">
          {content.title}
        </h1>
        <div className="h-px bg-zinc-200 w-full" />
      </div>

      <article className="space-y-8 text-lg font-normal text-[#4A4A4A] leading-[1.8]">
        {content.content ? (
          content.content
            .split("\n\n")
            .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
        ) : (
          <p className="italic text-zinc-300">
            No core documentation records found for this operational ID.
          </p>
        )}
      </article>

      <div className="pt-6 border-zinc-50 flex justify-between items-center italic text-xs text-zinc-400">
        <p>End of professional documentation module.</p>
        <div className="flex items-center gap-2 text-emerald-500 not-italic font-bold tracking-tighter cursor-default">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          VERIFIED
        </div>
      </div>
    </div>
  );
};

export default SessionPage;
