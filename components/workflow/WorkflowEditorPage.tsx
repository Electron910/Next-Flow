"use client";

import { useCallback, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { WorkflowSidebar } from "./WorkflowSidebar";
import { WorkflowHistoryPanel } from "./WorkflowHistoryPanel";
import { WorkflowToolbar } from "./WorkflowToolbar";
import { TextNode } from "./nodes/TextNode";
import { UploadImageNode } from "./nodes/UploadImageNode";
import { UploadVideoNode } from "./nodes/UploadVideoNode";
import { LLMNode } from "./nodes/LLMNode";
import { CropImageNode } from "./nodes/CropImageNode";
import { ExtractFrameNode } from "./nodes/ExtractFrameNode";
import { WorkflowNode } from "@/types/workflow";
import { NODE_HANDLE_TYPES } from "@/types/workflow";
import { getSampleWorkflow } from "./SampleWorkflow";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
  textNode: TextNode,
  uploadImageNode: UploadImageNode,
  uploadVideoNode: UploadVideoNode,
  llmNode: LLMNode,
  cropImageNode: CropImageNode,
  extractFrameNode: ExtractFrameNode,
};

function isValidConnection(connection: Connection, nodes: Node[]): boolean {
  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);
  if (!sourceNode || !targetNode) return false;
  if (connection.source === connection.target) return false;

  const sourceHandleType =
    NODE_HANDLE_TYPES[sourceNode.type || ""]?.[
      connection.sourceHandle || "output"
    ];
  const targetHandleType =
    NODE_HANDLE_TYPES[targetNode.type || ""]?.[
      connection.targetHandle || "input"
    ];

  if (!sourceHandleType || !targetHandleType) return false;
  if (targetHandleType === "any") return true;
  if (sourceHandleType === "any") return true;
  return sourceHandleType === targetHandleType;
}

function hasCycle(nodes: Node[], edges: Edge[], newEdge: Connection): boolean {
  const adjacency: Record<string, string[]> = {};
  nodes.forEach((n) => (adjacency[n.id] = []));
  edges.forEach((e) => {
    if (!adjacency[e.source]) adjacency[e.source] = [];
    adjacency[e.source].push(e.target);
  });

  if (newEdge.source && newEdge.target) {
    if (!adjacency[newEdge.source]) adjacency[newEdge.source] = [];
    adjacency[newEdge.source].push(newEdge.target);
  }

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function dfs(node: string): boolean {
    visited.add(node);
    recStack.add(node);
    for (const neighbor of adjacency[node] || []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true;
      if (recStack.has(neighbor)) return true;
    }
    recStack.delete(node);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id)) return true;
  }
  return false;
}

function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [workflowId, setWorkflowId] = useState<string | null>(null);

  const sampleWorkflow = getSampleWorkflow();
  const [nodes, setNodes, onNodesChange] = useNodesState(sampleWorkflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(sampleWorkflow.edges);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!isValidConnection(params, nodes)) return;
      if (hasCycle(nodes, edges, params)) return;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#7c3aed", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [nodes, edges, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !rfInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const labelMap: Record<string, string> = {
        textNode: "Text Node",
        uploadImageNode: "Upload Image",
        uploadVideoNode: "Upload Video",
        llmNode: "Run LLM",
        cropImageNode: "Crop Image",
        extractFrameNode: "Extract Frame",
      };

      const newNode: WorkflowNode = {
        id: uuidv4(),
        type: type as WorkflowNode["type"],
        position,
        data: {
          label: labelMap[type] || type,
          isExecuting: false,
          executionStatus: "idle",
        } as WorkflowNode["data"],
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes]
  );

  const addNode = useCallback(
    (type: string) => {
      const labelMap: Record<string, string> = {
        textNode: "Text Node",
        uploadImageNode: "Upload Image",
        uploadVideoNode: "Upload Video",
        llmNode: "Run LLM",
        cropImageNode: "Crop Image",
        extractFrameNode: "Extract Frame",
      };
      const newNode: WorkflowNode = {
        id: uuidv4(),
        type: type as WorkflowNode["type"],
        position: {
          x: 200 + Math.random() * 300,
          y: 100 + Math.random() * 200,
        },
        data: {
          label: labelMap[type] || type,
          isExecuting: false,
          executionStatus: "idle",
        } as WorkflowNode["data"],
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="flex h-screen bg-[#0f0f0f]">
      <WorkflowSidebar onAddNode={addNode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkflowToolbar
          nodes={nodes}
          edges={edges}
          setNodes={
            setNodes as (nodes: Node[] | ((nds: Node[]) => Node[])) => void
          }
          setEdges={setEdges}
          rfInstance={rfInstance}
          onToggleHistory={() => setHistoryOpen((v) => !v)}
          historyOpen={historyOpen}
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          workflowId={workflowId}
          setWorkflowId={setWorkflowId}
        />

        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            deleteKeyCode={["Delete", "Backspace"]}
            className="workflow-canvas"
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "#7c3aed", strokeWidth: 2 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1.5}
              color="#2a2a2a"
            />
            <Controls className="!bg-[#1a1a1a] !border-white/10 !rounded-xl [&>button]:!bg-transparent [&>button]:!text-gray-400 [&>button:hover]:!bg-white/10 [&>button:hover]:!text-white" />
            <MiniMap
              className="!bg-[#1a1a1a] !border-white/10 !rounded-xl"
              nodeColor={(node) => {
                const colorMap: Record<string, string> = {
                  textNode: "#3b82f6",
                  uploadImageNode: "#22c55e",
                  uploadVideoNode: "#f97316",
                  llmNode: "#7c3aed",
                  cropImageNode: "#84934A",
                  extractFrameNode: "#492828",
                };
                return colorMap[node.type || ""] || "#6b7280";
              }}
              maskColor="rgba(0,0,0,0.7)"
            />
          </ReactFlow>
        </div>
      </div>

      {historyOpen && <WorkflowHistoryPanel />}
    </div>
  );
}

export function WorkflowEditorPage() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
}