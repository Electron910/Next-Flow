import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const llmSchema = z.object({
  model: z.string().default("gemini-1.5-flash-8b"),
  systemPrompt: z.string().optional(),
  userMessage: z.string().min(1),
  images: z.array(z.string()).optional(),
  nodeId: z.string(),
});

async function fetchWithRetry(
  fn: () => Promise<Response>,
  retries = 3,
  delay = 5000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fn();
    if (res.status !== 429) return res;
    if (i < retries - 1) {
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
  return fn();
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = llmSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { model, systemPrompt, userMessage, images } = parsed.data;

    const preferredModel = model === "gemini-2.0-flash" ? "gemini-1.5-flash-8b" : model;

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const geminiModel = genAI.getGenerativeModel({
      model: preferredModel,
      ...(systemPrompt && { systemInstruction: systemPrompt }),
    });

    const parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [];

    if (images && images.length > 0) {
      for (const imageUrl of images) {
        if (!imageUrl) continue;
        try {
          if (imageUrl.startsWith("data:")) {
            const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
            if (matches) {
              parts.push({
                inlineData: {
                  mimeType: matches[1],
                  data: matches[2],
                },
              });
            }
          } else {
            const imageResponse = await fetch(imageUrl);
            const imageBuffer = await imageResponse.arrayBuffer();
            const base64 = Buffer.from(imageBuffer).toString("base64");
            const contentType =
              imageResponse.headers.get("content-type") || "image/jpeg";
            parts.push({
              inlineData: {
                mimeType: contentType,
                data: base64,
              },
            });
          }
        } catch {
          console.error("Failed to process image:", imageUrl.substring(0, 50));
        }
      }
    }

    parts.push({ text: userMessage });

    const result = await geminiModel.generateContent(parts);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ output: text });
  } catch (err: unknown) {
    console.error("LLM execution error:", err);
    const message = err instanceof Error ? err.message : "LLM execution failed";

    if (message.includes("429") || message.includes("quota")) {
      return NextResponse.json(
        {
          error:
            "Gemini API rate limit reached. Please wait a minute and try again, or upgrade your Google AI Studio plan.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}