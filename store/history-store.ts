import { create } from "zustand";
import { WorkflowRunEntry } from "@/types/workflow";

interface HistoryStore {
  runs: WorkflowRunEntry[];
  isLoading: boolean;
  addRun: (run: WorkflowRunEntry) => void;
  fetchRuns: () => Promise<void>;
  updateRun: (runId: string, updates: Partial<WorkflowRunEntry>) => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  runs: [],
  isLoading: false,

  addRun: (run) => {
    set((state) => ({ runs: [run, ...state.runs] }));
  },

  updateRun: (runId, updates) => {
    set((state) => ({
      runs: state.runs.map((r) =>
        r.id === runId ? { ...r, ...updates } : r
      ),
    }));
  },

  fetchRuns: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/workflow-runs");
      if (!response.ok) throw new Error("Failed to fetch runs");
      const runs = await response.json();
      set({ runs });
    } catch (err) {
      console.error("Fetch runs error:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));