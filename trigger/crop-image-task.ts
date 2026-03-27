import { task } from "@trigger.dev/sdk/v3";

interface CropImagePayload {
  imageUrl: string;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  nodeId: string;
}

interface CropImageOutput {
  url: string;
  nodeId: string;
}

export const cropImageTask = task({
  id: "crop-image",
  maxDuration: 120,
  run: async (payload: CropImagePayload): Promise<CropImageOutput> => {
    const sharp = (await import("sharp")).default;

    const response = await fetch(payload.imageUrl.startsWith("data:")
      ? payload.imageUrl
      : payload.imageUrl
    );

    let imageBuffer: Buffer;

    if (payload.imageUrl.startsWith("data:")) {
      const base64Data = payload.imageUrl.split(",")[1];
      imageBuffer = Buffer.from(base64Data, "base64");
    } else {
      const res = await fetch(payload.imageUrl);
      const arrayBuffer = await res.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    const width = metadata.width || 800;
    const height = metadata.height || 600;

    const cropX = Math.round((payload.xPercent / 100) * width);
    const cropY = Math.round((payload.yPercent / 100) * height);
    const cropW = Math.max(1, Math.round((payload.widthPercent / 100) * width));
    const cropH = Math.max(1, Math.round((payload.heightPercent / 100) * height));

    const finalW = Math.min(cropW, width - cropX);
    const finalH = Math.min(cropH, height - cropY);

    const croppedBuffer = await image
      .extract({ left: cropX, top: cropY, width: finalW, height: finalH })
      .jpeg({ quality: 90 })
      .toBuffer();

    const base64 = croppedBuffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    return { url: dataUrl, nodeId: payload.nodeId };
  },
});