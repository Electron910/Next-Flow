import { create } from "zustand";
import { WorkflowNode, WorkflowData } from "@/types/workflow";
import { Edge } from "reactflow";

interface Workflow {
  id: string;
  name: string;
  data: WorkflowData;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStore {
  currentWorkflow: Workflow | null;
  workflows: Workflow[];
  isLoading: boolean;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  setCurrentWorkflow: (workflow: Workflow | null) => void;
  saveWorkflow: (name: string, data: WorkflowData) => Promise<void>;
  loadWorkflows: () => Promise<void>;
  loadWorkflow: (id: string) => Promise<void>;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  currentWorkflow: null,
  workflows: [],
  isLoading: false,

  updateNodeData: (nodeId, data) => {
    set((state) => {
      if (!state.currentWorkflow) return state;
      const updatedNodes = state.currentWorkflow.data.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );
      return {
        currentWorkflow: {
          ...state.currentWorkflow,
          data: { ...state.currentWorkflow.data, nodes: updatedNodes },
        },
      };
    });
  },

  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

  saveWorkflow: async (name, data) => {
    set({ isLoading: true });
    try {
      const { currentWorkflow } = get();
      const method = currentWorkflow?.id ? "PUT" : "POST";
      const url = currentWorkflow?.id
        ? `/api/workflows/${currentWorkflow.id}`
        : "/api/workflows";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, data }),
      });

      if (!response.ok) throw new Error("Failed to save workflow");
      const saved = await response.json();
      set({ currentWorkflow: saved });
    } catch (err) {
      console.error("Save workflow error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  loadWorkflows: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/workflows");
      if (!response.ok) throw new Error("Failed to load workflows");
      const workflows = await response.json();
      set({ workflows });
    } catch (err) {
      console.error("Load workflows error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  loadWorkflow: async (id) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`/api/workflows/${id}`);
      if (!response.ok) throw new Error("Failed to load workflow");
      const workflow = await response.json();
      set({ currentWorkflow: workflow });
    } catch (err) {
      console.error("Load workflow error:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));