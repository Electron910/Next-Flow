import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// ==================== SCHEMA ====================
const createWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  data: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
    viewport: z.any().optional(),
  }),
});

// ==================== HELPERS ====================

// Sanitize large data (images, base64, etc.)
function sanitizeWorkflowData(data: unknown): unknown {
  if (
    typeof data === "string" &&
    data.startsWith("data:") &&
    data.length > 10000
  ) {
    return "[image-data]";
  }

  if (Array.isArray(data)) return data.map(sanitizeWorkflowData);

  if (data && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      result[k] = sanitizeWorkflowData(v);
    }
    return result;
  }

  return data;
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    const workflows = await prisma.workflow.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(workflows);
  } catch (err) {
    console.error("GET /api/workflows error:", err);

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const parsed = createWorkflowSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // ✅ FIX: sanitize + convert to Prisma JSON
    const sanitizedData = toJsonValue(
      sanitizeWorkflowData(parsed.data.data || { nodes: [], edges: [] })
    );

    const workflow = await prisma.workflow.create({
      data: {
        name: parsed.data.name,
        data: sanitizedData, // ✅ FIXED
        userId: user.id,
      },
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (err) {
    console.error("POST /api/workflows error:", err);

    const message =
      err instanceof Error ? err.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}