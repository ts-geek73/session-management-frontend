import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Content } from "@/types";

export const useContents = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/contents");
      if (data.success) {
        setContents(data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard contents:", err);
      setError(err.message || "Failed to fetch contents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  return { contents, loading, error, refetch: fetchContents };
};
