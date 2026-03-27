"use client";

import { useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
  useEdges,
} from "reactflow";
import { Film, Play, Loader2 } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { ExtractFrameNodeData } from "@/types/workflow";
import { useHistoryStore } from "@/store/history-store";

export function ExtractFrameNode({ id, data }: NodeProps<ExtractFrameNodeData>) {
  const { setNodes, getNodes } = useReactFlow();
  const { addRun } = useHistoryStore();
  const edges = useEdges();
  const [isRunning, setIsRunning] = useState(false);

  const updateData = (updates: Partial<ExtractFrameNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
  };

  const getConnectedValue = (handleId: string): string | null => {
    const edge = edges.find((e) => e.target === id && e.targetHandle === handleId);
    if (!edge) return null;
    const sourceNode = getNodes().find((n) => n.id === edge.source);
    return ((sourceNode?.data as Record<string, unknown>)?.output as string) || null;
  };

  const isHandleConnected = (handleId: string) =>
    edges.some((e) => e.target === id && e.targetHandle === handleId);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    updateData({ isExecuting: true, executionStatus: "running" });

    const videoUrl = getConnectedValue("video_url");
    const timestamp =
      (getConnectedValue("timestamp") as string) || data.timestamp || "0";
    const startTime = Date.now();

    try {
      if (!videoUrl) throw new Error("No video URL connected");

      const response = await fetch("/api/execute/extract-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, timestamp, nodeId: id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      if (result.output) {
        updateData({
          output: result.output,
          isExecuting: false,
          executionStatus: "success",
          error: undefined,
        });
        addRun({
          id: `run-${Date.now()}`,
          workflowId: "current",
          status: "SUCCESS",
          scope: "SINGLE",
          startedAt: new Date(startTime).toISOString(),
          completedAt: new Date().toISOString(),
          duration: Date.now() - startTime,
          nodeRuns: [
            {
              id: `nr-${Date.now()}`,
              nodeId: id,
              nodeType: "extractFrameNode",
              nodeLabel: data.label,
              status: "SUCCESS",
              inputs: { videoUrl, timestamp },
              outputs: { output: result.output },
              startedAt: new Date(startTime).toISOString(),
              completedAt: new Date().toISOString(),
              duration: Date.now() - startTime,
            },
          ],
        });
      } else {
        throw new Error(result.error || "Frame extraction failed");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Execution failed";
      updateData({
        isExecuting: false,
        executionStatus: "error",
        error: errorMessage,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <NodeWrapper
      id={id}
      title={data.label || "Extract Frame"}
      icon={<Film size={12} className="text-white" />}
      iconBg="bg-[#492828]"
      isExecuting={data.isExecuting}
      executionStatus={data.executionStatus}
      minWidth={240}
    >
      <Handle type="target" position={Position.Left} id="video_url" data-handletype="video" className="!w-3 !h-3 !bg-orange-400 !border-2 !border-orange-600" style={{ left: -6, top: "35%" }} />
      <Handle type="target" position={Position.Left} id="timestamp" data-handletype="text" className="!w-3 !h-3 !bg-blue-400 !border-2 !border-blue-600" style={{ left: -6, top: "65%" }} />

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs">
          <div className={`w-2 h-2 rounded-full ${isHandleConnected("video_url") ? "bg-orange-400" : "bg-gray-600"}`} />
          <span className="text-gray-500">
            {isHandleConnected("video_url") ? "Video connected" : "Connect a video"}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <label className="text-gray-600 text-xs">Timestamp</label>
          </div>
          <input
            type="text"
            value={data.timestamp || ""}
            onChange={(e) => updateData({ timestamp: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={isHandleConnected("timestamp")}
            placeholder={isHandleConnected("timestamp") ? "Connected..." : "0 or 50% or 10.5s"}
            className="w-full bg-black/30 text-white text-xs rounded-lg px-2 py-1.5 outline-none border border-white/5 focus:border-blue-500/30 transition-colors placeholder-gray-700 disabled:opacity-40 disabled:cursor-not-allowed nodrag"
          />
        </div>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleRun}
          disabled={isRunning || !isHandleConnected("video_url")}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all nodrag ${
            isRunning || !isHandleConnected("video_url")
              ? "bg-[#492828]/40 text-[#F5AFAF] cursor-not-allowed"
              : "bg-[#492828] hover:bg-[#5a3333] text-white"
          }`}
        >
          {isRunning ? <><Loader2 size={12} className="animate-spin" />Extracting...</> : <><Play size={12} />Extract Frame</>}
        </button>

        {data.error && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-2">
            <p className="text-red-400 text-xs break-words">{data.error}</p>
          </div>
        )}

        {data.output && (
          <div className="space-y-1">
            <p className="text-gray-600 text-xs">Extracted Frame</p>
            <img src={data.output} alt="Extracted Frame" className="w-full rounded-xl object-cover max-h-36" />
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="output" data-handletype="image" className="!w-3 !h-3 !bg-green-400 !border-2 !border-green-600" style={{ right: -6 }} />
    </NodeWrapper>
  );
}