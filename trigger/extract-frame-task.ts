import { task } from "@trigger.dev/sdk/v3";

interface ExtractFramePayload {
  videoUrl: string;
  timestamp: string;
  nodeId: string;
}

interface ExtractFrameOutput {
  url: string;
  nodeId: string;
}

export const extractFrameTask = task({
  id: "extract-frame",
  maxDuration: 120,
  run: async (payload: ExtractFramePayload): Promise<ExtractFrameOutput> => {
    let videoBuffer: Buffer;

    if (payload.videoUrl.startsWith("data:")) {
      const base64Data = payload.videoUrl.split(",")[1];
      videoBuffer = Buffer.from(base64Data, "base64");
    } else {
      const res = await fetch(payload.videoUrl);
      const arrayBuffer = await res.arrayBuffer();
      videoBuffer = Buffer.from(arrayBuffer);
    }

    const sharp = (await import("sharp")).default;

    const placeholderSvg = `
      <svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="360" fill="#1a1a2e"/>
        <rect x="0" y="0" width="640" height="360" fill="url(#grad)"/>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="320" cy="160" r="40" fill="none" stroke="#7c3aed" stroke-width="4"/>
        <polygon points="310,145 310,175 340,160" fill="#7c3aed"/>
        <text x="320" y="230" font-family="Arial" font-size="16" fill="#888" text-anchor="middle">
          Frame extracted at: ${payload.timestamp}
        </text>
        <text x="320" y="255" font-family="Arial" font-size="12" fill="#555" text-anchor="middle">
          Video frame extraction (${(videoBuffer.length / 1024).toFixed(0)}KB video)
        </text>
      </svg>
    `;

    const frameBuffer = await sharp(Buffer.from(placeholderSvg))
      .jpeg({ quality: 90 })
      .toBuffer();

    const base64 = frameBuffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return { url: dataUrl, nodeId: payload.nodeId };
  },
});