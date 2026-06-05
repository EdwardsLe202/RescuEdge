import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import sqlite3 from "sqlite3";
import path from "path";
import { authOptions } from "../auth/[...nextauth]/route";

const dbPath = path.resolve(process.cwd(), "comments.db");

// Helper to open SQLite database connection
function getDb(): sqlite3.Database {
  return new sqlite3.Database(dbPath);
}

// Function to initialize database and tables
function initDb() {
  const db = getDb();
  db.serialize(() => {
    // Create comments table
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        avatar TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        isTagged INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) {
        console.error("Error creating comments table:", err);
      }
      db.close();
    });
  });
}

// Call initDb upon file load
initDb();

// Promise wrapper for querying all comments
function allComments(db: sqlite3.Database): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM comments ORDER BY id ASC", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Promise wrapper for inserting a new comment
function insertComment(
  db: sqlite3.Database,
  author: string,
  avatar: string,
  role: string,
  content: string,
  timestamp: string,
  isTagged: number
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO comments (author, avatar, role, content, timestamp, isTagged) VALUES (?, ?, ?, ?, ?, ?)`,
      [author, avatar, role, content, timestamp, isTagged],
      function (this: any, err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Promise wrapper for retrieving a single comment by ID
function getCommentById(db: sqlite3.Database, id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM comments WHERE id = ?", [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export async function GET() {
  const db = getDb();
  try {
    const rows = await allComments(db);
    // Convert isTagged integer back to boolean for client ease
    const formatted = rows.map((r) => ({
      ...r,
      id: String(r.id),
      isTagged: !!r.isTagged,
    }));
    return NextResponse.json({ comments: formatted });
  } catch (error: any) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch comments" }, { status: 500 });
  } finally {
    db.close();
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const db = getDb();

  try {
    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }

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
    const isTagged = content.includes("@") ? 1 : 0;

    const newId = await insertComment(db, author, initials, role, content, timestampStr, isTagged);
    const commentRecord = await getCommentById(db, newId);

    const formattedComment = {
      ...commentRecord,
      id: String(commentRecord.id),
      isTagged: !!commentRecord.isTagged,
    };

    return NextResponse.json({ comment: formattedComment });
  } catch (error: any) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: error.message || "Failed to create comment" }, { status: 500 });
  } finally {
    db.close();
  }
}
