"use client";

import { useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  useReactFlow,
  useEdges,
} from "reactflow";
import { Cpu, Play, ChevronDown, Loader2, Copy, Check } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { LLMNodeData, GEMINI_MODELS } from "@/types/workflow";
import { useHistoryStore } from "@/store/history-store";

export function LLMNode({ id, data }: NodeProps<LLMNodeData>) {
  const { setNodes, getNodes } = useReactFlow();
  const { addRun } = useHistoryStore();
  const edges = useEdges();
  const [isRunning, setIsRunning] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateData = (updates: Partial<LLMNodeData>) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...updates } } : n
      )
    );
  };

  const getConnectedValue = (
    handleId: string
  ): string | string[] | null => {
    const incomingEdges = edges.filter(
      (e) => e.target === id && e.targetHandle === handleId
    );
    if (incomingEdges.length === 0) return null;

    if (handleId === "images") {
      const allNodes = getNodes();
      const values = incomingEdges
        .map((e) => {
          const sourceNode = allNodes.find((n) => n.id === e.source);
          return (sourceNode?.data as Record<string, unknown>)?.output as string;
        })
        .filter(Boolean);
      return values.length > 0 ? values : null;
    }

    const sourceNode = getNodes().find(
      (n) => n.id === incomingEdges[0].source
    );
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

    const systemPrompt =
      (getConnectedValue("system_prompt") as string) ||
      data.systemPrompt ||
      "";
    const userMessage =
      (getConnectedValue("user_message") as string) ||
      data.userMessage ||
      "";
    const images = (getConnectedValue("images") as string[]) || [];
    const startTime = Date.now();

    try {
      if (!userMessage.trim()) {
        throw new Error("User message is required");
      }

      const response = await fetch("/api/execute/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: data.model || "gemini-2.0-flash",
          systemPrompt,
          userMessage,
          images,
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
              nodeType: "llmNode",
              nodeLabel: data.label,
              status: "SUCCESS",
              inputs: { systemPrompt, userMessage },
              outputs: { output: result.output },
              startedAt: new Date(startTime).toISOString(),
              completedAt: new Date().toISOString(),
              duration: Date.now() - startTime,
            },
          ],
        });
      } else {
        throw new Error(result.error || "No output received");
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

  const handleCopy = () => {
    if (data.output) {
      navigator.clipboard.writeText(data.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <NodeWrapper
      id={id}
      title={data.label || "Run Any LLM"}
      icon={<Cpu size={12} className="text-white" />}
      iconBg="bg-purple-500"
      isExecuting={data.isExecuting}
      executionStatus={data.executionStatus}
      minWidth={300}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="system_prompt"
        data-handletype="text"
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-blue-600"
        style={{ left: -6, top: "28%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="user_message"
        data-handletype="text"
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-blue-600"
        style={{ left: -6, top: "50%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="images"
        data-handletype="image"
        className="!w-3 !h-3 !bg-green-400 !border-2 !border-green-600"
        style={{ left: -6, top: "72%" }}
      />

      <div className="space-y-2">
        <div className="relative">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full flex items-center justify-between bg-black/30 text-white text-xs px-3 py-2 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors nodrag"
          >
            <span>
              {GEMINI_MODELS.find((m) => m.id === data.model)?.name ||
                "Gemini 2.0 Flash"}
            </span>
            <ChevronDown
              size={12}
              className={`transition-transform ${modelOpen ? "rotate-180" : ""}`}
            />
          </button>
          {modelOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] rounded-xl border border-white/10 overflow-hidden z-50 shadow-xl">
              {GEMINI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    updateData({ model: model.id });
                    setModelOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition-colors nodrag ${
                    data.model === model.id ? "text-purple-400" : "text-gray-300"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <label className="text-gray-500 text-xs">System Prompt</label>
          </div>
          <textarea
            value={data.systemPrompt || ""}
            onChange={(e) => updateData({ systemPrompt: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={isHandleConnected("system_prompt")}
            placeholder={
              isHandleConnected("system_prompt")
                ? "Connected from node..."
                : "Optional system instructions..."
            }
            className="w-full bg-black/30 text-white text-xs rounded-lg p-2 outline-none resize-none border border-white/5 focus:border-blue-500/30 transition-colors placeholder-gray-700 min-h-[50px] disabled:opacity-40 disabled:cursor-not-allowed nodrag"
            rows={2}
          />
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <label className="text-gray-500 text-xs">User Message</label>
          </div>
          <textarea
            value={data.userMessage || ""}
            onChange={(e) => updateData({ userMessage: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            disabled={isHandleConnected("user_message")}
            placeholder={
              isHandleConnected("user_message")
                ? "Connected from node..."
                : "Enter your message..."
            }
            className="w-full bg-black/30 text-white text-xs rounded-lg p-2 outline-none resize-none border border-white/5 focus:border-blue-500/30 transition-colors placeholder-gray-700 min-h-[60px] disabled:opacity-40 disabled:cursor-not-allowed nodrag"
            rows={3}
          />
        </div>

        {isHandleConnected("images") && (
          <div className="flex items-center gap-1.5 bg-green-900/20 border border-green-800/30 rounded-lg px-2 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-green-400 text-xs">Images connected</span>
          </div>
        )}

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleRun}
          disabled={isRunning}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all nodrag ${
            isRunning
              ? "bg-purple-900/40 text-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {isRunning ? (
            <><Loader2 size={12} className="animate-spin" />Running...</>
          ) : (
            <><Play size={12} />Run</>
          )}
        </button>

        {data.error && (
          <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-2.5">
            <p className="text-red-400 text-xs break-words">{data.error}</p>
          </div>
        )}

        {data.output && (
          <div className="bg-black/40 border border-white/5 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                Output
              </span>
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleCopy}
                className="text-gray-600 hover:text-white transition-colors nodrag"
              >
                {copied ? (
                  <Check size={11} className="text-green-400" />
                ) : (
                  <Copy size={11} />
                )}
              </button>
            </div>
            <p className="text-white text-xs leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
              {data.output}
            </p>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        data-handletype="text"
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-blue-600"
        style={{ right: -6 }}
      />
    </NodeWrapper>
  );
}