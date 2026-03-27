import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface LLMTaskPayload {
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
  nodeId: string;
}

interface LLMTaskOutput {
  output: string;
  nodeId: string;
}

export const llmTask = task({
  id: "run-llm",
  maxDuration: 120,
  run: async (payload: LLMTaskPayload): Promise<LLMTaskOutput> => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: payload.model,
      ...(payload.systemPrompt && {
        systemInstruction: payload.systemPrompt,
      }),
    });

    const parts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [];

    if (payload.images && payload.images.length > 0) {
      for (const imageUrl of payload.images) {
        if (!imageUrl) continue;
        try {
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
        } catch {
          console.error("Failed to fetch image:", imageUrl);
        }
      }
    }

    parts.push({ text: payload.userMessage });

    const result = await model.generateContent(parts);
    const response = result.response;
    const text = response.text();

    return {
      output: text,
      nodeId: payload.nodeId,
    };
  },
});