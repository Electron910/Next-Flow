"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useHistoryStore } from "@/store/history-store";
import { WorkflowRunEntry, NodeRunEntry } from "@/types/workflow";

export function WorkflowHistoryPanel() {
  const { runs, fetchRuns, isLoading } = useHistoryStore();
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle size={12} className="text-green-400" />;
      case "FAILED":
        return <XCircle size={12} className="text-red-400" />;
      case "RUNNING":
        return <RefreshCw size={12} className="text-yellow-400 animate-spin" />;
      default:
        return <Clock size={12} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "text-xs px-2 py-0.5 rounded-full font-medium";
    switch (status) {
      case "SUCCESS":
        return `${base} bg-green-900/40 text-green-400`;
      case "FAILED":
        return `${base} bg-red-900/40 text-red-400`;
      case "RUNNING":
        return `${base} bg-yellow-900/40 text-yellow-400`;
      case "PARTIAL":
        return `${base} bg-orange-900/40 text-orange-400`;
      default:
        return `${base} bg-gray-800 text-gray-400`;
    }
  };

  const getScopeBadge = (scope: string) => {
    switch (scope) {
      case "FULL":
        return "Full Workflow";
      case "PARTIAL":
        return "Partial Run";
      case "SINGLE":
        return "Single Node";
      default:
        return scope;
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return "—";
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="w-72 bg-[#1a1a1a] border-l border-white/5 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="text-white text-sm font-semibold">Workflow History</h3>
        <button
          onClick={() => fetchRuns()}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && runs.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={20} className="text-gray-600 animate-spin" />
          </div>
        )}

        {!isLoading && runs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Clock size={32} className="text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">No runs yet</p>
            <p className="text-gray-700 text-xs mt-1">
              Run a workflow to see history
            </p>
          </div>
        )}

        <div className="divide-y divide-white/5">
          {runs.map((run, index) => (
            <div key={run.id} className="hover:bg-white/3 transition-colors">
              <button
                onClick={() =>
                  setExpandedRun(expandedRun === run.id ? null : run.id)
                }
                className="w-full p-3 text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(run.status)}
                    <span className="text-white text-xs font-medium">
                      Run #{runs.length - index}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={getStatusBadge(run.status)}>
                      {run.status}
                    </span>
                    {expandedRun === run.id ? (
                      <ChevronDown size={12} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={12} className="text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {format(new Date(run.startedAt), "MMM d, h:mm a")}
                  </span>
                  <span className="text-gray-600 text-xs">
                    {getScopeBadge(run.scope)}
                  </span>
                </div>
                {run.duration && (
                  <p className="text-gray-600 text-xs mt-0.5">
                    {formatDuration(run.duration)}
                  </p>
                )}
              </button>

              {expandedRun === run.id && (
                <div className="pb-3 px-3">
                  <div className="bg-black/30 rounded-xl overflow-hidden border border-white/5">
                    <div className="px-3 py-2 border-b border-white/5">
                      <p className="text-xs text-gray-500 font-medium">
                        Node Execution Details
                      </p>
                    </div>
                    <div className="divide-y divide-white/5">
                      {run.nodeRuns.map((nodeRun) => (
                        <NodeRunDetail
                          key={nodeRun.id}
                          nodeRun={nodeRun}
                          formatDuration={formatDuration}
                          getStatusIcon={getStatusIcon}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NodeRunDetail({
  nodeRun,
  formatDuration,
  getStatusIcon,
}: {
  nodeRun: NodeRunEntry;
  formatDuration: (ms?: number) => string;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-2">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {getStatusIcon(nodeRun.status)}
            <span className="text-white text-xs font-medium truncate max-w-[120px]">
              {nodeRun.nodeLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs">
              {formatDuration(nodeRun.duration)}
            </span>
            {expanded ? (
              <ChevronDown size={10} className="text-gray-600" />
            ) : (
              <ChevronRight size={10} className="text-gray-600" />
            )}
          </div>
        </div>
        {nodeRun.error && (
          <p className="text-red-400 text-xs mt-0.5 truncate">{nodeRun.error}</p>
        )}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5 pl-4">
          {nodeRun.outputs &&
            Object.entries(nodeRun.outputs).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-600 text-xs uppercase tracking-wider">
                  Output
                </p>
                <p className="text-gray-300 text-xs mt-0.5 break-all line-clamp-3">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </p>
              </div>
            ))}
          {nodeRun.inputs &&
            Object.entries(nodeRun.inputs).map(([key, value]) => (
              <div key={key}>
                <p className="text-gray-600 text-xs uppercase tracking-wider">
                  {key}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 break-all line-clamp-2">
                  {typeof value === "string" ? value : JSON.stringify(value)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}