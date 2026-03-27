"use client";

import { useCallback } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { Type } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { TextNodeData } from "@/types/workflow";

export function TextNode({ id, data }: NodeProps<TextNodeData>) {
  const { setNodes } = useReactFlow();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, text: value, output: value } }
            : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <NodeWrapper
      id={id}
      title={data.label || "Text Node"}
      icon={<Type size={12} className="text-white" />}
      iconBg="bg-blue-500"
      isExecuting={data.isExecuting}
      executionStatus={data.executionStatus}
    >
      <div className="relative">
        <textarea
          value={data.text || ""}
          onChange={onChange}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Enter text here..."
          className="w-full bg-black/30 text-white text-xs rounded-xl p-3 outline-none resize-none border border-white/5 focus:border-blue-500/50 transition-colors placeholder-gray-600 min-h-[80px] nodrag"
          rows={4}
        />
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