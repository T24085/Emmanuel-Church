import { NextResponse } from "next/server";

const chatAgentUrl =
  process.env.CHAT_AGENT_ASSISTANT_URL?.trim() ||
  "http://127.0.0.1:8787/api/assistant-chat";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const response = await fetch(chatAgentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "application/json; charset=utf-8";
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to reach the chat agent.",
      },
      { status: 502 },
    );
  }
}
