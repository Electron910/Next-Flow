import { Node, Edge } from "reactflow";

export type NodeType =
  | "textNode"
  | "uploadImageNode"
  | "uploadVideoNode"
  | "llmNode"
  | "cropImageNode"
  | "extractFrameNode";

export type HandleDataType = "text" | "image" | "video" | "number" | "any";

export interface TextNodeData {
  label: string;
  text: string;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  output?: string;
}

export interface UploadImageNodeData {
  label: string;
  imageUrl?: string;
  fileName?: string;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  output?: string;
}

export interface UploadVideoNodeData {
  label: string;
  videoUrl?: string;
  fileName?: string;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  output?: string;
}

export interface LLMNodeData {
  label: string;
  model: string;
  systemPrompt?: string;
  userMessage?: string;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  output?: string;
  error?: string;
}

export interface CropImageNodeData {
  label: string;
  xPercent?: number;
  yPercent?: number;
  widthPercent?: number;
  heightPercent?: number;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  output?: string;
  error?: string;
}

export interface ExtractFrameNodeData {
  label: string;
  timestamp?: string;
  isExecuting?: boolean;
  executionStatus?: "idle" | "running" | "success" | "error";
  output?: string;
  error?: string;
}

export type WorkflowNodeData =
  | TextNodeData
  | UploadImageNodeData
  | UploadVideoNodeData
  | LLMNodeData
  | CropImageNodeData
  | ExtractFrameNodeData;

export type WorkflowNode = Node<WorkflowNodeData, NodeType>;
export type WorkflowEdge = Edge;

export interface WorkflowData {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

export interface WorkflowRunEntry {
  id: string;
  workflowId: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";
  scope: "FULL" | "PARTIAL" | "SINGLE";
  startedAt: string;
  completedAt?: string;
  duration?: number;
  nodeRuns: NodeRunEntry[];
}

export interface NodeRunEntry {
  id: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  status: "RUNNING" | "SUCCESS" | "FAILED" | "PARTIAL";
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  error?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface GeminiModel {
  id: string;
  name: string;
}

export const GEMINI_MODELS: GeminiModel[] = [
{ id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
  { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash-Lite" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
  { id: "gemini-1.5-flash-8b", name: "Gemini 1.5 Flash-8B" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
];

export const NODE_HANDLE_TYPES: Record<string, Record<string, HandleDataType>> = {
  textNode: { output: "text" },
  uploadImageNode: { output: "image" },
  uploadVideoNode: { output: "video" },
  llmNode: {
    system_prompt: "text",
    user_message: "text",
    images: "image",
    output: "text",
  },
  cropImageNode: {
    image_url: "image",
    x_percent: "number",
    y_percent: "number",
    width_percent: "number",
    height_percent: "number",
    output: "image",
  },
  extractFrameNode: {
    video_url: "video",
    timestamp: "text",
    output: "image",
  },
};