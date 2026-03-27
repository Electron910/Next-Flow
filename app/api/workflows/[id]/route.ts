import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// ✅ Schema
const updateWorkflowSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  data: z
    .object({
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
      viewport: z.any().optional(),
    })
    .optional(),
});

// ✅ Ensure JSON-safe data
function sanitizeData(data: unknown): unknown {
  if (
    typeof data === "string" &&
    data.startsWith("data:") &&
    data.length > 5000
  ) {
    return "[media-data]";
  }
  if (Array.isArray(data)) return data.map(sanitizeData);

  if (data && typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      result[k] = sanitizeData(v);
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
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

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

    const workflow = await prisma.workflow.findFirst({
      where: { id, userId: user.id },
    });

    if (!workflow)
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );

    return NextResponse.json(workflow);
  } catch (err) {
    console.error("GET /api/workflows/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==================== PUT ====================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (!id)
      return NextResponse.json(
        { error: "Missing workflow id" },
        { status: 400 }
      );

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

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const parsed = updateWorkflowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.workflow.findFirst({
      where: { id, userId: user.id },
    });

    const sanitizedData = parsed.data.data
      ? toJsonValue(sanitizeData(parsed.data.data))
      : undefined;

    // ✅ CREATE if not exists
    if (!existing) {
      const created = await prisma.workflow.create({
        data: {
          name: parsed.data.name || "Untitled Workflow",
          data:
            sanitizedData ||
            toJsonValue({ nodes: [], edges: [] }),
          userId: user.id,
        },
      });

      return NextResponse.json(created);
    }

    // ✅ UPDATE
    const updated = await prisma.workflow.update({
      where: { id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(sanitizedData && { data: sanitizedData }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/workflows/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==================== DELETE ====================
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return NextResponse.json({ success: true });

    await prisma.workflow.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/workflows/[id] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}