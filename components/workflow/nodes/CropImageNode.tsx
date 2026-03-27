"use client";

import { useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
  useEdges,
} from "reactflow";
import { Crop, Play, Loader2 } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { CropImageNodeData } from "@/types/workflow";
import { useHistoryStore } from "@/store/history-store";

export function CropImageNode({ id, data }: NodeProps<CropImageNodeData>) {
  const { setNodes, getNodes } = useReactFlow();
  const { addRun } = useHistoryStore();
  const edges = useEdges();
  const [isRunning, setIsRunning] = useState(false);

  const updateData = (updates: Partial<CropImageNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
  };

  const getConnectedValue = (handleId: string): string | null => {
    const edge = edges.find(
      (e) => e.target === id && e.targetHandle === handleId
    );
    if (!edge) return null;
    const sourceNode = getNodes().find((n) => n.id === edge.source);
    return (
      ((sourceNode?.data as Record<string, unknown>)?.output as string) || null
    );
  };

  const isHandleConnected = (handleId: string) =>
    edges.some((e) => e.target === id && e.targetHandle === handleId);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    updateData({ isExecuting: true, executionStatus: "running" });

    const imageUrl = getConnectedValue("image_url");
    const xPercent = Number(
      getConnectedValue("x_percent") ?? data.xPercent ?? 0
    );
    const yPercent = Number(
      getConnectedValue("y_percent") ?? data.yPercent ?? 0
    );
    const widthPercent = Number(
      getConnectedValue("width_percent") ?? data.widthPercent ?? 100
    );
    const heightPercent = Number(
      getConnectedValue("height_percent") ?? data.heightPercent ?? 100
    );

    const startTime = Date.now();

    try {
      if (!imageUrl) throw new Error("No image URL connected");

      const response = await fetch("/api/execute/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          xPercent,
          yPercent,
          widthPercent,
          heightPercent,
          nodeId: id,
        }),
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
              nodeType: "cropImageNode",
              nodeLabel: data.label,
              status: "SUCCESS",
              inputs: { imageUrl, xPercent, yPercent, widthPercent, heightPercent },
              outputs: { output: result.output },
              startedAt: new Date(startTime).toISOString(),
              completedAt: new Date().toISOString(),
              duration: Date.now() - startTime,
            },
          ],
        });
      } else {
        throw new Error(result.error || "Crop failed");
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

  const cropParams = [
    { handleId: "x_percent", label: "X %", field: "xPercent" as keyof CropImageNodeData, defaultVal: 0 },
    { handleId: "y_percent", label: "Y %", field: "yPercent" as keyof CropImageNodeData, defaultVal: 0 },
    { handleId: "width_percent", label: "Width %", field: "widthPercent" as keyof CropImageNodeData, defaultVal: 100 },
    { handleId: "height_percent", label: "Height %", field: "heightPercent" as keyof CropImageNodeData, defaultVal: 100 },
  ];

  return (
    <NodeWrapper
      id={id}
      title={data.label || "Crop Image"}
      icon={<Crop size={12} className="text-white" />}
      iconBg="bg-[#84934A]"
      isExecuting={data.isExecuting}
      executionStatus={data.executionStatus}
      minWidth={260}
    >
      <Handle type="target" position={Position.Left} id="image_url" data-handletype="image" className="!w-3 !h-3 !bg-green-400 !border-2 !border-green-600" style={{ left: -6, top: "18%" }} />
      <Handle type="target" position={Position.Left} id="x_percent" data-handletype="number" className="!w-3 !h-3 !bg-purple-400 !border-2 !border-purple-600" style={{ left: -6, top: "34%" }} />
      <Handle type="target" position={Position.Left} id="y_percent" data-handletype="number" className="!w-3 !h-3 !bg-purple-400 !border-2 !border-purple-600" style={{ left: -6, top: "50%" }} />
      <Handle type="target" position={Position.Left} id="width_percent" data-handletype="number" className="!w-3 !h-3 !bg-purple-400 !border-2 !border-purple-600" style={{ left: -6, top: "66%" }} />
      <Handle type="target" position={Position.Left} id="height_percent" data-handletype="number" className="!w-3 !h-3 !bg-purple-400 !border-2 !border-purple-600" style={{ left: -6, top: "82%" }} />

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs">
          <div className={`w-2 h-2 rounded-full ${isHandleConnected("image_url") ? "bg-green-400" : "bg-gray-600"}`} />
          <span className="text-gray-500">
            {isHandleConnected("image_url") ? "Image connected" : "Connect an image"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {cropParams.map((param) => (
            <div key={param.handleId}>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <label className="text-gray-600 text-xs">{param.label}</label>
              </div>
              <input
                type="number"
                min={0}
                max={100}
                value={isHandleConnected(param.handleId) ? "" : ((data[param.field] as number) ?? param.defaultVal)}
                onChange={(e) => updateData({ [param.field]: Number(e.target.value) })}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={isHandleConnected(param.handleId)}
                placeholder={isHandleConnected(param.handleId) ? "Connected" : String(param.defaultVal)}
                className="w-full bg-black/30 text-white text-xs rounded-lg px-2 py-1.5 outline-none border border-white/5 focus:border-purple-500/30 transition-colors placeholder-gray-700 disabled:opacity-40 disabled:cursor-not-allowed nodrag"
              />
            </div>
          ))}
        </div>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleRun}
          disabled={isRunning || !isHandleConnected("image_url")}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all nodrag ${
            isRunning || !isHandleConnected("image_url")
              ? "bg-[#656D3F]/40 text-[#84934A] cursor-not-allowed"
              : "bg-[#84934A] hover:bg-[#656D3F] text-white"
          }`}
        >
          {isRunning ? <><Loader2 size={12} className="animate-spin" />Processing...</> : <><Play size={12} />Crop Image</>}
        </button>

        {data.error && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-2">
            <p className="text-red-400 text-xs break-words">{data.error}</p>
          </div>
        )}

        {data.output && (
          <div className="space-y-1">
            <p className="text-gray-600 text-xs">Output</p>
            <img src={data.output} alt="Cropped" className="w-full rounded-xl object-cover max-h-36" />
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="output" data-handletype="image" className="!w-3 !h-3 !bg-green-400 !border-2 !border-green-600" style={{ right: -6 }} />
    </NodeWrapper>
  );
}