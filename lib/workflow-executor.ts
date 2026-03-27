import { Node, Edge } from "reactflow";
import { WorkflowNode, WorkflowRunEntry, NodeRunEntry } from "@/types/workflow";
import { getExecutionOrder } from "./dag-validator";
import { v4 as uuidv4 } from "uuid";

export class WorkflowExecutor {
  private nodes: WorkflowNode[];
  private edges: Edge[];
  private setNodes: (
    fn: (nodes: WorkflowNode[]) => WorkflowNode[]
  ) => void;
  private addRun: (run: WorkflowRunEntry) => void;
  private workflowId?: string;
  private nodeOutputs: Record<string, string | string[]> = {};

  constructor(
    nodes: WorkflowNode[],
    edges: Edge[],
    setNodes: (fn: (nodes: WorkflowNode[]) => WorkflowNode[]) => void,
    addRun: (run: WorkflowRunEntry) => void,
    workflowId?: string
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.setNodes = setNodes;
    this.addRun = addRun;
    this.workflowId = workflowId;
  }

  // ✅ Ensure output is always string
  private normalizeOutput(value: unknown): string {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  private setNodeStatus(
    nodeId: string,
    status: "idle" | "running" | "success" | "error",
    output?: unknown
  ) {
    this.setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                isExecuting: status === "running",
                executionStatus: status,
                output:
                  output !== undefined
                    ? this.normalizeOutput(output) // ✅ FIX
                    : n.data.output,
              },
            }
          : n
      )
    );
  }

  private getNodeInput(
    nodeId: string,
    handleId: string
  ): string | string[] | null {
    const incomingEdges = this.edges.filter(
      (e) => e.target === nodeId && e.targetHandle === handleId
    );

    if (incomingEdges.length === 0) {
      const node = this.nodes.find((n) => n.id === nodeId);
      if (!node) return null;

      const data = node.data as any;

      if (handleId === "text") return data.text || null;
      if (handleId === "system_prompt") return data.systemPrompt || null;
      if (handleId === "user_message") return data.userMessage || null;

      return null;
    }

    if (handleId === "images") {
      const values = incomingEdges
        .map((e) => this.nodeOutputs[e.source] as string)
        .filter(Boolean);

      return values.length > 0 ? values : null;
    }

    const edge = incomingEdges[0];
    return (this.nodeOutputs[edge.source] as string) || null;
  }

  private async executeNode(node: WorkflowNode): Promise<NodeRunEntry> {
    const startTime = Date.now();
    const nodeRunId = uuidv4();

    this.setNodeStatus(node.id, "running");

    try {
      let output: string | null = null;
      let inputs: Record<string, unknown> = {};

      switch (node.type) {
        case "textNode": {
          const data = node.data as { text?: string };
          output = data.text || "";
          inputs = { text: data.text };
          break;
        }

        case "uploadImageNode": {
          const data = node.data as { imageUrl?: string; output?: string };
          output = data.imageUrl || data.output || "";
          inputs = { imageUrl: data.imageUrl };
          break;
        }

        case "uploadVideoNode": {
          const data = node.data as { videoUrl?: string; output?: string };
          output = data.videoUrl || data.output || "";
          inputs = { videoUrl: data.videoUrl };
          break;
        }

        case "llmNode": {
          const data = node.data as any;

          const systemPrompt =
            (this.getNodeInput(node.id, "system_prompt") as string) ||
            data.systemPrompt ||
            "";

          const userMessage =
            (this.getNodeInput(node.id, "user_message") as string) ||
            data.userMessage ||
            "";

          const images =
            (this.getNodeInput(node.id, "images") as string[]) || [];

          inputs = { systemPrompt, userMessage, images };

          const response = await fetch("/api/execute/llm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: data.model || "gemini-2.0-flash",
              systemPrompt,
              userMessage,
              images,
              nodeId: node.id,
            }),
          });

          const result = await response.json();

          if (!result.output)
            throw new Error(result.error || "LLM execution failed");

          output = this.normalizeOutput(result.output); // ✅ FIX
          break;
        }

        case "cropImageNode": {
          const data = node.data as any;

          const imageUrl = this.getNodeInput(node.id, "image_url") as string;
          if (!imageUrl) throw new Error("No image URL connected");

          const xPercent = Number(
            this.getNodeInput(node.id, "x_percent") ?? data.xPercent ?? 0
          );
          const yPercent = Number(
            this.getNodeInput(node.id, "y_percent") ?? data.yPercent ?? 0
          );
          const widthPercent = Number(
            this.getNodeInput(node.id, "width_percent") ??
              data.widthPercent ??
              100
          );
          const heightPercent = Number(
            this.getNodeInput(node.id, "height_percent") ??
              data.heightPercent ??
              100
          );

          inputs = { imageUrl, xPercent, yPercent, widthPercent, heightPercent };

          const response = await fetch("/api/execute/crop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl,
              xPercent,
              yPercent,
              widthPercent,
              heightPercent,
              nodeId: node.id,
            }),
          });

          const result = await response.json();

          if (!result.output)
            throw new Error(result.error || "Crop failed");

          output = this.normalizeOutput(result.output); // ✅ FIX
          break;
        }

        case "extractFrameNode": {
          const data = node.data as any;

          const videoUrl = this.getNodeInput(node.id, "video_url") as string;
          if (!videoUrl) throw new Error("No video URL connected");

          const timestamp =
            (this.getNodeInput(node.id, "timestamp") as string) ||
            data.timestamp ||
            "0";

          inputs = { videoUrl, timestamp };

          const response = await fetch("/api/execute/extract-frame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              videoUrl,
              timestamp,
              nodeId: node.id,
            }),
          });

          const result = await response.json();

          if (!result.output)
            throw new Error(result.error || "Frame extraction failed");

          output = this.normalizeOutput(result.output); // ✅ FIX
          break;
        }

        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }

      if (output !== null) {
        this.nodeOutputs[node.id] = output;
        this.setNodeStatus(node.id, "success", output);
      }

      const duration = Date.now() - startTime;

      return {
        id: nodeRunId,
        nodeId: node.id,
        nodeType: node.type || "unknown",
        nodeLabel:
          (node.data as { label?: string }).label ||
          node.type ||
          "Node",
        status: "SUCCESS",
        inputs,
        outputs: { output },
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        duration,
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";

      this.setNodeStatus(node.id, "error");

      const duration = Date.now() - startTime;

      return {
        id: nodeRunId,
        nodeId: node.id,
        nodeType: node.type || "unknown",
        nodeLabel:
          (node.data as { label?: string }).label ||
          node.type ||
          "Node",
        status: "FAILED",
        error: errorMessage,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        duration,
      };
    }
  }

  async executeAll(): Promise<void> {
    const runId = uuidv4();
    const startTime = Date.now();

    const executionLevels = getExecutionOrder(this.nodes, this.edges);
    const allNodeRuns: NodeRunEntry[] = [];

    for (const level of executionLevels) {
      const levelNodes = level
        .map((id) => this.nodes.find((n) => n.id === id))
        .filter(Boolean) as WorkflowNode[];

      const results = await Promise.all(
        levelNodes.map((node) => this.executeNode(node))
      );

      allNodeRuns.push(...results);
    }

    const hasFailures = allNodeRuns.some((r) => r.status === "FAILED");
    const allFailed = allNodeRuns.every((r) => r.status === "FAILED");

    const finalStatus = allFailed
      ? "FAILED"
      : hasFailures
      ? "PARTIAL"
      : "SUCCESS";

    const run: WorkflowRunEntry = {
      id: runId,
      workflowId: this.workflowId || "current",
      status: finalStatus,
      scope: "FULL",
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
      nodeRuns: allNodeRuns,
    };

    this.addRun(run);

    try {
      await fetch("/api/workflow-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(run),
      });
    } catch {
      console.error("Failed to persist workflow run");
    }
  }
}