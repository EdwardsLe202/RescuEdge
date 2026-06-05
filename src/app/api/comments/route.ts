import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
  isTagged: boolean;
  createdAt: string;
}

const COMMENTS_KEY = "rescuedge:comments";

// ─── Redis Client ─────────────────────────────────────────────────────────────
function getRedis() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const { Redis } = require("@upstash/redis");
  return new Redis({ url, token });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getComments(): Promise<Comment[]> {
  const redis = getRedis();
  if (!redis) return [];
  const data = (await redis.get(COMMENTS_KEY)) as Comment[] | null;
  return data ?? [];
}

async function saveComments(comments: Comment[]) {
  const redis = getRedis();
  if (redis) {
    await redis.set(COMMENTS_KEY, comments);
  }
}

// ─── GET /api/comments ────────────────────────────────────────────────────────
export async function GET() {
  try {
    const comments = await getComments();
    return NextResponse.json({ comments });
  } catch (error: any) {
    console.error("GET comments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// ─── POST /api/comments ───────────────────────────────────────────────────────
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    const list = await getComments();

    // Determine author from session
    const author =
      session?.user?.name ||
      session?.user?.email?.split("@")[0] ||
      "Guest User";
    const email = session?.user?.email || "";

    // Generate avatar initials
    const avatar =
      author
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "GU";

    const role =
      email.includes("admin") || email.includes("forensic")
        ? "Sub Admin Dept. of Investigation"
        : "Field Operations Officer";

    // Format timestamp
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const timestamp = `Today at ${timeStr} (${dateStr})`;

    const isTagged = content.includes("@");

    const newId = String(
      list.length > 0
        ? Math.max(...list.map((c) => parseInt(c.id) || 0)) + 1
        : 1
    );

    const newComment: Comment = {
      id: newId,
      author,
      avatar,
      role,
      content,
      timestamp,
      isTagged,
      createdAt: now.toISOString(),
    };

    list.push(newComment);
    await saveComments(list);

    return NextResponse.json({ comment: newComment });
  } catch (error: any) {
    console.error("POST comment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create comment" },
      { status: 500 }
    );
  }
}
