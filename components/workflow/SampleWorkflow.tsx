import { WorkflowNode, WorkflowData } from "@/types/workflow";
import { Edge } from "reactflow";

export function getSampleWorkflow(): WorkflowData {
  const nodes: WorkflowNode[] = [
    {
      id: "upload-image-1",
      type: "uploadImageNode",
      position: { x: 80, y: 80 },
      data: {
        label: "Upload Product Photo",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "text-system-1",
      type: "textNode",
      position: { x: 80, y: 320 },
      data: {
        label: "System Prompt",
        text: "You are a professional marketing copywriter. Generate a compelling one-paragraph product description.",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "text-product-1",
      type: "textNode",
      position: { x: 80, y: 520 },
      data: {
        label: "Product Details",
        text: "Product: Wireless Bluetooth Headphones. Features: Noise cancellation, 30-hour battery, foldable design.",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "crop-image-1",
      type: "cropImageNode",
      position: { x: 420, y: 80 },
      data: {
        label: "Crop Product Photo",
        xPercent: 10,
        yPercent: 10,
        widthPercent: 80,
        heightPercent: 80,
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "llm-1",
      type: "llmNode",
      position: { x: 760, y: 200 },
      data: {
        label: "LLM - Product Description",
        model: "gemini-2.0-flash",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "upload-video-1",
      type: "uploadVideoNode",
      position: { x: 80, y: 760 },
      data: {
        label: "Upload Product Video",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "extract-frame-1",
      type: "extractFrameNode",
      position: { x: 420, y: 760 },
      data: {
        label: "Extract Mid Frame",
        timestamp: "50%",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "text-system-2",
      type: "textNode",
      position: { x: 760, y: 700 },
      data: {
        label: "Social Media System Prompt",
        text: "You are a social media manager. Create a tweet-length marketing post based on the product image and video frame.",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
    {
      id: "llm-2",
      type: "llmNode",
      position: { x: 1100, y: 480 },
      data: {
        label: "LLM - Marketing Tweet",
        model: "gemini-2.0-flash",
        isExecuting: false,
        executionStatus: "idle",
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: "e-upload-crop",
      source: "upload-image-1",
      target: "crop-image-1",
      sourceHandle: "output",
      targetHandle: "image_url",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-system1-llm1",
      source: "text-system-1",
      target: "llm-1",
      sourceHandle: "output",
      targetHandle: "system_prompt",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-product-llm1",
      source: "text-product-1",
      target: "llm-1",
      sourceHandle: "output",
      targetHandle: "user_message",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-crop-llm1",
      source: "crop-image-1",
      target: "llm-1",
      sourceHandle: "output",
      targetHandle: "images",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-video-extract",
      source: "upload-video-1",
      target: "extract-frame-1",
      sourceHandle: "output",
      targetHandle: "video_url",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-llm1-llm2",
      source: "llm-1",
      target: "llm-2",
      sourceHandle: "output",
      targetHandle: "user_message",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-system2-llm2",
      source: "text-system-2",
      target: "llm-2",
      sourceHandle: "output",
      targetHandle: "system_prompt",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-crop-llm2",
      source: "crop-image-1",
      target: "llm-2",
      sourceHandle: "output",
      targetHandle: "images",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
    {
      id: "e-frame-llm2",
      source: "extract-frame-1",
      target: "llm-2",
      sourceHandle: "output",
      targetHandle: "images",
      animated: true,
      style: { stroke: "#7c3aed", strokeWidth: 2 },
    },
  ];

  return { nodes, edges };
}