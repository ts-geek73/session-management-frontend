import { useEffect, useState, useCallback, useRef } from "react";
import api from "@/lib/api";
import { Content } from "@/types";
import { useSession } from "@/context";

export const useContentDetail = (
  id: string,
  shouldActivate: boolean = false,
) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activate } = useSession();
  const hasTracked = useRef(false);

  const trackVisit = useCallback(
    async (contentId: string) => {
      try {
        await api.post("/sessions/track", {
          content_id: contentId,
          status: "active",
        });
        console.log("✅ Activity logged to sessions table");
        // Update local storage via context
        activate(contentId);
      } catch (err) {
        console.error("❌ Error tracking session visit:", err);
      }
    },
    [activate],
  );

  const fetchContent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/contents/${id}`);
      if (data.success) {
        setContent(data.data);
        if (shouldActivate && !hasTracked.current) {
          hasTracked.current = true;
          await trackVisit(data.data.id);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch content:", err);
      setError(err.message || "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  }, [id, shouldActivate, trackVisit]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
};
