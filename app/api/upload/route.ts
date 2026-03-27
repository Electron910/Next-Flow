import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const nodeType = formData.get("nodeType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const assemblyId = process.env.TRANSLOADIT_KEY!;
    const assemblySecret = process.env.TRANSLOADIT_SECRET!;

    const isVideo = nodeType === "video";
    const templateSteps = isVideo
      ? {
          store: {
            use: ":original",
            robot: "/s3/store",
            key: process.env.AWS_ACCESS_KEY_ID,
            secret: process.env.AWS_SECRET_ACCESS_KEY,
            bucket: process.env.AWS_BUCKET,
            region: process.env.AWS_REGION || "us-east-1",
          },
        }
      : {
          resize: {
            use: ":original",
            robot: "/image/resize",
            result: true,
            imagemagick_stack: "v3.0.1",
          },
        };

    const params = JSON.stringify({
      auth: { key: assemblyId },
      steps: templateSteps,
    });

    const uploadFormData = new FormData();
    uploadFormData.append("params", params);
    uploadFormData.append("file", file);

    const response = await fetch("https://api2.transloadit.com/assemblies", {
      method: "POST",
      body: uploadFormData,
    });

    const result = await response.json();

    let fileUrl: string | null = null;

    if (result.results) {
      const firstKey = Object.keys(result.results)[0];
      if (firstKey && result.results[firstKey]?.[0]) {
        fileUrl = result.results[firstKey][0].ssl_url || result.results[firstKey][0].url;
      }
    }

    if (!fileUrl) {
      const objectUrl = URL.createObjectURL(file);
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      fileUrl = `data:${file.type};base64,${base64}`;
    }

    return NextResponse.json({ url: fileUrl, name: file.name });
  } catch (err: unknown) {
    console.error("Upload error:", err);

    try {
      const formData = await req.formData().catch(() => null);
      if (formData) {
        const file = formData.get("file") as File;
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          const dataUrl = `data:${file.type};base64,${base64}`;
          return NextResponse.json({ url: dataUrl, name: file.name });
        }
      }
    } catch {
      console.error("Fallback upload also failed");
    }

    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}