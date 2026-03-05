import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context";
import Link from "next/link";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { TrackedSession } from "@/types";

interface ActivityLogTableProps {
  sessions: TrackedSession[];
  loading: boolean;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({
  sessions,
  loading,
}) => {
  const { isActivated } = useSession();

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Unit Name
              </th>
              <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Status
              </th>
              <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Created AT
              </th>
              <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center font-mono text-[10px] text-zinc-300 animate-pulse uppercase tracking-[0.3em]"
                >
                  Syncing logs...
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-16 text-center text-zinc-400 font-medium text-sm"
                >
                  No operational sessions logged yet.
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr
                  key={session.id}
                  className="group w-full [&_td]:p-3 hover:bg-zinc-50/50 transition-colors"
                >
                  <td>
                    <Link
                      href={`/content/${session?.content_id}${isActivated(session?.content_id) ? "" : "?activateSession=true"}`}
                    >
                      <span className="text-sm font-bold text-black group-hover:underline underline-offset-4">
                        {session.contents?.title || "Unknown"}
                      </span>
                    </Link>
                  </td>
                  <td>
                    <Badge className="rounded-full bg-emerald-50 text-emerald-600 p-2 hover:bg-emerald-50 border-none font-bold text-[10px] uppercase shadow-none tracking-widest">
                      {session.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex flex-col text-sm text-zinc-600">
                      <span className="font-bold">
                        {new Date(session.created_at).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-full hover:bg-white hover:border hover:border-zinc-200 transition-all text-zinc-400 hover:text-black"
                      onClick={() => console.log("Update clicked")}
                    >
                      <MdModeEdit className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogTable;
