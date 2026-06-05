// Helpers shared across the video player, clip library and recordings views.

/**
 * Browsers can't play `.avi` natively, so route those through the transcoding
 * proxy (`/api/video-proxy`). Other formats (mp4/m3u8/hosted) are returned as-is.
 */
export function toPlayableSource(url: string): string {
  if (url.includes(".avi")) return `/api/video-proxy?url=${encodeURIComponent(url)}`;
  return url;
}

/** Human-readable file name from an S3 key, e.g. `node-01/node-01-154.avi` -> `node-01-154.avi`. */
export function clipName(videoKey: string): string {
  return videoKey.split("/").pop() || videoKey;
}

/** Format a byte count as KB/MB. */
export function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
