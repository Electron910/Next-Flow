import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const cropSchema = z.object({
  imageUrl: z.string(),
  xPercent: z.number().min(0).max(100).default(0),
  yPercent: z.number().min(0).max(100).default(0),
  widthPercent: z.number().min(1).max(100).default(100),
  heightPercent: z.number().min(1).max(100).default(100),
  nodeId: z.string(),
});

async function cropImageLocally(
  imageUrl: string,
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent: number
): Promise<string> {
  const sharp = (await import("sharp")).default;

  let imageBuffer: Buffer;
  if (imageUrl.startsWith("data:")) {
    const base64Data = imageUrl.split(",")[1];
    imageBuffer = Buffer.from(base64Data, "base64");
  } else {
    const res = await fetch(imageUrl);
    const arrayBuffer = await res.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  const width = metadata.width || 800;
  const height = metadata.height || 600;

  const cropX = Math.round((xPercent / 100) * width);
  const cropY = Math.round((yPercent / 100) * height);
  const cropW = Math.max(1, Math.round((widthPercent / 100) * width));
  const cropH = Math.max(1, Math.round((heightPercent / 100) * height));

  const finalW = Math.min(cropW, width - cropX);
  const finalH = Math.min(cropH, height - cropY);

  const croppedBuffer = await image
    .extract({ left: cropX, top: cropY, width: finalW, height: finalH })
    .jpeg({ quality: 90 })
    .toBuffer();

  return `data:image/jpeg;base64,${croppedBuffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = cropSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { imageUrl, xPercent, yPercent, widthPercent, heightPercent } = parsed.data;

    const output = await cropImageLocally(
      imageUrl,
      xPercent,
      yPercent,
      widthPercent,
      heightPercent
    );

    return NextResponse.json({ output });
  } catch (err: unknown) {
    console.error("Crop execution error:", err);
    const message = err instanceof Error ? err.message : "Crop failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}