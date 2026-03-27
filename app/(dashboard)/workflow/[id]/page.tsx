"use client";

import { useEffect } from "react";
import { useWorkflowStore } from "@/store/workflow-store";
import { WorkflowEditorPage } from "@/components/workflow/WorkflowEditorPage";

export default function WorkflowDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { loadWorkflow } = useWorkflowStore();

  useEffect(() => {
    if (params.id && params.id !== "new") {
      loadWorkflow(params.id);
    }
  }, [params.id, loadWorkflow]);

  return <WorkflowEditorPage />;
}