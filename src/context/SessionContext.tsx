"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  activatedIds: string[];
  activate: (id: string) => void;
  isActivated: (id: string) => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activatedIds, setActivatedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("activatedSessions");
    if (stored) {
      try {
        setActivatedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse activated sessions:", e);
      }
    }
  }, []);

  const activate = (id: string) => {
    setActivatedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem("activatedSessions", JSON.stringify(next));
      return next;
    });
  };

  const isActivated = (id: string) => activatedIds.includes(id);

  return (
    <SessionContext.Provider value={{ activatedIds, activate, isActivated }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
