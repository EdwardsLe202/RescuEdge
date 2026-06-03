import { withAuth } from "next-auth/middleware";

// Create the next-auth middleware handler
const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

// Explicitly export a standard function to satisfy Next.js static analysis
export default function middleware(req: any, event: any) {
  return authMiddleware(req, event);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - login (the sign-in page itself)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and public assets
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)",
  ],
};
