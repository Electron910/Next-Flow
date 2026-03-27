"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Play, Download, Upload, History,
  Home, Loader2, Plus, Check,
} from "lucide-react";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { useHistoryStore } from "@/store/history-store";
import { WorkflowExecutor } from "@/lib/workflow-executor";
import { WorkflowNode } from "@/types/workflow";

interface WorkflowToolbarProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  rfInstance: ReactFlowInstance | null;
  onToggleHistory: () => void;
  historyOpen: boolean;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowId: string | null;
  setWorkflowId: (id: string | null) => void;
}

export function WorkflowToolbar({
  nodes,
  edges,
  setNodes,
  setEdges,
  rfInstance,
  onToggleHistory,
  historyOpen,
  workflowName,
  setWorkflowName,
  workflowId,
  setWorkflowId,
}: WorkflowToolbarProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const router = useRouter();
  const { addRun } = useHistoryStore();

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSavedOk(false);

    try {
      const flow = rfInstance ? rfInstance.toObject() : { nodes, edges, viewport: undefined };

      const cleanFlow = {
        nodes: flow.nodes.map((n: Node) => ({
          ...n,
          data: {
            ...n.data,
            imageUrl: undefined,
            videoUrl: undefined,
            output: typeof (n.data as Record<string,unknown>).output === "string" &&
              ((n.data as Record<string,unknown>).output as string).startsWith("data:")
              ? "[media]"
              : (n.data as Record<string,unknown>).output,
          },
        })),
        edges: flow.edges,
        viewport: flow.viewport,
      };

      let url: string;
      let method: string;

      if (workflowId) {
        url = `/api/workflows/${workflowId}`;
        method = "PUT";
      } else {
        url = "/api/workflows";
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workflowName || "Untitled Workflow", data: cleanFlow }),
      });

      if (response.ok) {
        const result = await response.json();
        if (!workflowId && result.id) {
          setWorkflowId(result.id);
        }
        setSavedOk(true);
        setTimeout(() => setSavedOk(false), 2000);
      } else {
        const err = await response.json().catch(() => ({ error: "Unknown error" }));
        alert(`Save failed: ${err.error || "Server error"}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNew = () => {
    if (nodes.length > 0) {
      if (!window.confirm("Create new workflow? Unsaved changes will be lost.")) return;
    }
    setNodes([]);
    setEdges([]);
    setWorkflowName("Untitled Workflow");
    setWorkflowId(null);
  };

  const handleRunAll = async () => {
    if (isRunning || nodes.length === 0) return;
    setIsRunning(true);
    try {
      const executor = new WorkflowExecutor(
        nodes as WorkflowNode[],
        edges,
        setNodes as (fn: (nodes: WorkflowNode[]) => WorkflowNode[]) => void,
        addRun,
        workflowId || undefined
      );
      await executor.executeAll();
    } finally {
      setIsRunning(false);
    }
  };

  const handleExport = () => {
    const flow = rfInstance ? rfInstance.toObject() : { nodes, edges };
    const data = JSON.stringify({ name: workflowName, ...flow }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(workflowName || "workflow").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.nodes) setNodes(data.nodes);
          if (data.edges) setEdges(data.edges);
          if (data.name) setWorkflowName(data.name);
          setWorkflowId(null);
        } catch {
          alert("Invalid workflow file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="h-12 bg-[#1a1a1a] border-b border-white/5 flex items-center px-3 gap-1 flex-shrink-0">
      <button
        onClick={() => router.push("/dashboard")}
        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        title="Back to Dashboard"
      >
        <Home size={15} />
      </button>

      <button
        onClick={handleNew}
        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        title="New Workflow"
      >
        <Plus size={15} />
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <input
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        className="bg-transparent text-white text-sm outline-none w-44 border-b border-transparent hover:border-white/20 focus:border-purple-500 transition-colors py-0.5 nodrag"
        placeholder="Workflow name..."
      />

      <div className="w-px h-5 bg-white/10 mx-1" />

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${
          savedOk
            ? "text-green-400 bg-green-900/20"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
        title="Save Workflow (Ctrl+S)"
      >
        {isSaving ? (
          <Loader2 size={13} className="animate-spin" />
        ) : savedOk ? (
          <Check size={13} />
        ) : (
          <Save size={13} />
        )}
        {isSaving ? "Saving..." : savedOk ? "Saved!" : "Save"}
      </button>

      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/5 transition-colors"
      >
        <Download size={13} />
        Export
      </button>

      <button
        onClick={handleImport}
        className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-white text-xs rounded-lg hover:bg-white/5 transition-colors"
      >
        <Upload size={13} />
        Import
      </button>

      <div className="flex-1" />

      <button
        onClick={handleRunAll}
        disabled={isRunning || nodes.length === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
          isRunning || nodes.length === 0
            ? "bg-purple-900/40 text-purple-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
      >
        {isRunning ? (
          <><Loader2 size={14} className="animate-spin" />Running...</>
        ) : (
          <><Play size={14} />Run Workflow</>
        )}
      </button>

      <button
        onClick={onToggleHistory}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ml-1 ${
          historyOpen ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <History size={13} />
        History
      </button>
    </div>
  );
}