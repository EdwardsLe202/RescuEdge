import { NextRequest, NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { PassThrough } from "stream";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate it's an S3 presigned URL
  if (!url.includes("amazonaws.com")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const passThrough = new PassThrough();

  // AVI typically holds MJPEG / MPEG-4 ASP (DivX) video + MP3/PCM audio, which
  // cannot be stream-copied into an MP4 container — so we re-encode to H.264/AAC.
  // `empty_moov+frag_keyframe` produces a fragmented MP4 that can be streamed
  // without seeking the output (do NOT use `faststart` here — it needs a
  // seekable output and breaks piping).
  ffmpeg(url)
    .videoCodec("libx264")
    .audioCodec("aac")
    .outputOptions([
      "-preset veryfast",
      "-pix_fmt yuv420p",
      "-movflags frag_keyframe+empty_moov+default_base_moof",
    ])
    .format("mp4")
    .on("error", (err) => {
      console.error("ffmpeg error:", err.message);
      passThrough.destroy(err);
    })
    .pipe(passThrough, { end: true });

  // Convert Node.js stream to Web ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      passThrough.on("data", (chunk) => controller.enqueue(chunk));
      passThrough.on("end", () => controller.close());
      passThrough.on("error", (err) => controller.error(err));
    
    },
    cancel() {
      passThrough.destroy();
    },
  });

  return new NextResponse(readable, {
    headers: {
      "Content-Type": "video/mp4",
      "Cache-Control": "no-store",
      "Transfer-Encoding": "chunked",
    },
  });
}
