import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: { type: string; data: { id: string; email_addresses?: Array<{ email_address: string }>; first_name?: string; last_name?: string } };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof evt;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    const email = data.email_addresses?.[0]?.email_address || "";
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: { email, name: name || null },
      create: { clerkId: data.id, email, name: name || null },
    });
  }

  if (type === "user.deleted") {
    await prisma.user.deleteMany({ where: { clerkId: data.id } });
  }

  return NextResponse.json({ received: true });
}