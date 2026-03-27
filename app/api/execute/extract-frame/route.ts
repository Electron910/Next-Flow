import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const extractFrameSchema = z.object({
  videoUrl: z.string(),
  timestamp: z.string().default("0"),
  nodeId: z.string(),
});

async function generateFramePlaceholder(
  timestamp: string,
  videoSize: number
): Promise<string> {
  const sharp = (await import("sharp")).default;

  const colors = [
    { bg: "#1a1a2e", accent: "#7c3aed" },
    { bg: "#0f3460", accent: "#e94560" },
    { bg: "#16213e", accent: "#0f3460" },
    { bg: "#1b1b2f", accent: "#f2a65a" },
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const svg = `
    <svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.bg}"/>
          <stop offset="100%" style="stop-color:${color.accent}22"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#bg)"/>
      <rect x="0" y="0" width="640" height="360" fill="${color.bg}" opacity="0.8"/>
      <circle cx="320" cy="155" r="45" fill="none" stroke="${color.accent}" stroke-width="3"/>
      <polygon points="308,138 308,172 344,155" fill="${color.accent}"/>
      <rect x="160" y="220" width="320" height="1" fill="${color.accent}" opacity="0.3"/>
      <text x="320" y="250" font-family="Arial,sans-serif" font-size="14" fill="${color.accent}" text-anchor="middle" opacity="0.9">
        Frame at: ${timestamp}
      </text>
      <text x="320" y="272" font-family="Arial,sans-serif" font-size="11" fill="#888" text-anchor="middle">
        Video size: ${(videoSize / 1024).toFixed(0)}KB
      </text>
      <text x="320" y="295" font-family="Arial,sans-serif" font-size="10" fill="#555" text-anchor="middle">
        Install ffmpeg for actual frame extraction
      </text>
    </svg>
  `;

  const buffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 90 })
    .toBuffer();

  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = extractFrameSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { videoUrl, timestamp } = parsed.data;

    let videoSize = 0;
    if (videoUrl.startsWith("data:")) {
      videoSize = Math.round((videoUrl.length * 3) / 4);
    } else {
      try {
        const res = await fetch(videoUrl, { method: "HEAD" });
        videoSize = parseInt(res.headers.get("content-length") || "0");
      } catch {
        videoSize = 0;
      }
    }

    const output = await generateFramePlaceholder(timestamp, videoSize);
    return NextResponse.json({ output });
  } catch (err: unknown) {
    console.error("Extract frame error:", err);
    const message = err instanceof Error ? err.message : "Frame extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}