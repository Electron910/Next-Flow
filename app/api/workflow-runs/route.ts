import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const maxDuration = 30;

// ==================== SCHEMAS ====================
const nodeRunSchema = z.object({
  id: z.string(),
  nodeId: z.string(),
  nodeType: z.string(),
  nodeLabel: z.string(),
  status: z.enum(["RUNNING", "SUCCESS", "FAILED", "PARTIAL"]),
  inputs: z.record(z.unknown()).optional(),
  outputs: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  duration: z.number().optional(),
});

const createRunSchema = z.object({
  id: z.string(),
  workflowId: z.string(),
  status: z.enum(["RUNNING", "SUCCESS", "FAILED", "PARTIAL"]),
  scope: z.enum(["FULL", "PARTIAL", "SINGLE"]),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  duration: z.number().optional(),
  nodeRuns: z.array(nodeRunSchema),
});

// ==================== HELPERS ====================

// Sanitize large / unsafe data
function sanitizeForStorage(obj: unknown): unknown {
  if (typeof obj === "string") {
    if (obj.startsWith("data:") && obj.length > 10000) {
      return "[base64-data-truncated]";
    }
    if (obj.length > 50000) {
      return obj.substring(0, 50000) + "...[truncated]";
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForStorage);
  }

  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeForStorage(value);
    }
    return result;
  }

  return obj;
}

// ✅ Convert to Prisma-safe JSON
function toJsonValue(data: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data));
}

// ==================== GET ====================
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return NextResponse.json([]);

    const runs = await prisma.workflowRun.findMany({
      where: { userId: user.id },
      orderBy: { startedAt: "desc" },
      take: 50,
      include: { nodeRuns: true },
    });

    const formatted = runs.map((run) => ({
      id: run.id,
      workflowId: run.workflowId,
      status: run.status,
      scope: run.scope,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString(),
      duration: run.duration,
      nodeRuns: run.nodeRuns.map((nr) => ({
        id: nr.id,
        nodeId: nr.nodeId,
        nodeType: nr.nodeType,
        nodeLabel: nr.nodeLabel,
        status: nr.status,
        inputs: nr.inputs,
        outputs: nr.outputs,
        error: nr.error,
        startedAt: nr.startedAt.toISOString(),
        completedAt: nr.completedAt?.toISOString(),
        duration: nr.duration,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/workflow-runs error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==================== POST ====================
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@placeholder.com`,
        },
      });
    }

    // Parse request safely
    let body: unknown;
    try {
      const text = await req.text();
      const truncated =
        text.length > 5 * 1024 * 1024
          ? text.substring(0, 5 * 1024 * 1024)
          : text;
      body = JSON.parse(truncated);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const parsed = createRunSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Resolve workflow
    let workflowId = parsed.data.workflowId;

    if (workflowId === "current" || !workflowId) {
      const defaultWorkflow = await prisma.workflow.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });

      if (defaultWorkflow) {
        workflowId = defaultWorkflow.id;
      } else {
        const created = await prisma.workflow.create({
          data: {
            name: "Default Workflow",
            data: toJsonValue({ nodes: [], edges: [] }),
            userId: user.id,
          },
        });
        workflowId = created.id;
      }
    }

    // ✅ FIXED NODE RUNS
    const sanitizedNodeRuns = parsed.data.nodeRuns.map((nr) => ({
      id: nr.id,
      nodeId: nr.nodeId,
      nodeType: nr.nodeType,
      nodeLabel: nr.nodeLabel,
      status: nr.status,

      inputs: toJsonValue(sanitizeForStorage(nr.inputs || {})),
      outputs: toJsonValue(sanitizeForStorage(nr.outputs || {})),

      error: nr.error ?? null,
      startedAt: new Date(nr.startedAt),
      completedAt: nr.completedAt ? new Date(nr.completedAt) : null,
      duration: nr.duration ?? null,
    }));

    const run = await prisma.workflowRun.create({
      data: {
        id: parsed.data.id,
        workflowId,
        userId: user.id,
        status: parsed.data.status,
        scope: parsed.data.scope,
        startedAt: new Date(parsed.data.startedAt),
        completedAt: parsed.data.completedAt
          ? new Date(parsed.data.completedAt)
          : null,
        duration: parsed.data.duration ?? null,

        nodeRuns: {
          create: sanitizedNodeRuns,
        },
      },
      include: { nodeRuns: true },
    });

    return NextResponse.json(
      { success: true, id: run.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/workflow-runs error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}