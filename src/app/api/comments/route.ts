import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

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

const jsonPath = path.resolve(process.cwd(), "comments.json");

// In-memory cache to serve requests fast and act as fallback in read-only envs
let commentsCache: Comment[] = [];
let isLoaded = false;

// Seed some initial comments if the file doesn't exist
const initialComments: Comment[] = [
  {
    id: "1",
    author: "System Bot",
    avatar: "SB",
    role: "System Monitor",
    content: "RescuEdge system initialized. Monitoring active devices.",
    timestamp: "Today at 9:00 AM",
    isTagged: false,
    createdAt: new Date().toISOString()
  }
];

function loadComments(): Comment[] {
  if (isLoaded) {
    return commentsCache;
  }
  try {
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, "utf-8");
      commentsCache = JSON.parse(data);
    } else {
      commentsCache = [...initialComments];
      saveComments(commentsCache);
    }
  } catch (error) {
    console.error("Error loading comments:", error);
    if (commentsCache.length === 0) {
      commentsCache = [...initialComments];
    }
  }
  isLoaded = true;
  return commentsCache;
}

function saveComments(comments: Comment[]) {
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(comments, null, 2), "utf-8");
  } catch (error) {
    // Expected on read-only environments like Vercel
    console.warn("Could not write comments to filesystem (likely read-only environment):", error);
  }
}

export async function GET() {
  try {
    const list = loadComments();
    return NextResponse.json({ comments: list });
  } catch (error: any) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

    const list = loadComments();

    // Determine values based on user session or standard fallback values
    const author = session?.user?.name || session?.user?.email?.split("@")[0] || "Guest User";
    const email = session?.user?.email || "";
    
    // Generate simple avatar initials
    const initials = author
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "GU";

    const role = email.includes("admin") || email.includes("forensic") 
      ? "Sub Admin Dept. of Investigation" 
      : "Field Operations Officer";

    // Format simple timestamp
    const now = new Date();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const timeStr = now.toLocaleTimeString("en-US", timeOptions);
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timestampStr = `Today at ${timeStr} (${dateStr})`;

    // Check tag command mention in comment content (e.g. starting with @)
    const isTagged = content.includes("@");

    // Generate new unique ID
    const newId = String(list.length > 0 ? Math.max(...list.map(c => parseInt(c.id) || 0)) + 1 : 1);

    const newComment: Comment = {
      id: newId,
      author,
      avatar: initials,
      role,
      content,
      timestamp: timestampStr,
      isTagged,
      createdAt: now.toISOString()
    };

    list.push(newComment);
    saveComments(list);

    return NextResponse.json({ comment: newComment });
  } catch (error: any) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: error.message || "Failed to create comment" }, { status: 500 });
  }
}
