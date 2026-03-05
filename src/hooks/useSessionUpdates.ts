import { useEffect, useState, useCallback } from "react";
import { socket } from "@/lib/socket";
import api from "@/lib/api";
import { TrackedSession } from "@/types";

export const useSessionUpdates = () => {
  const [sessions, setSessions] = useState<TrackedSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialSessions = useCallback(async () => {
    try {
      const { data } = await api.get("/sessions");
      if (data.success) {
        setSessions(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch initial sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialSessions();

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ WebSocket connected to backend");
    });

    socket.on("session_created", (newSession: TrackedSession) => {
      setSessions((prev) => [newSession, ...prev]);
    });

    socket.on("session_updated", (updatedSession: TrackedSession) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
      );
    });

    socket.on("disconnect", () => {
      console.log("🔌 WebSocket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("session_created");
      socket.off("session_updated");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [fetchInitialSessions]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { data } = await api.patch(`/sessions/${id}`, { status });
      return data.success;
    } catch (err) {
      console.error("Failed to update session status:", err);
      return false;
    }
  };

  return { sessions, loading, updateStatus };
};
