import type { Plugin, PreviewServer } from "vite";
import { readDb, updateDb } from "./social-db";
import type { Post } from "../src/types";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

async function parseJsonBody(request: Request) {
  const text = await request.text();
  return text ? (JSON.parse(text) as Record<string, unknown>) : {};
}

async function handleApi(pathname: string, request: Request) {
  if (request.method === "GET" && pathname === "/api/posts") {
    const db = await readDb();
    return jsonResponse(db.posts);
  }

  if (request.method === "POST" && pathname === "/api/posts") {
    const body = await parseJsonBody(request);
    const now = Date.now();
    const post: Post = {
      id: now,
      author: String(body.author ?? "You"),
      handle: String(body.handle ?? "@you"),
      avatar: String(body.avatar ?? "YOU"),
      time: "now",
      createdAt: now,
      content: String(body.content ?? ""),
      tags: Array.isArray(body.tags) ? body.tags.map(String).slice(0, 4) : [],
      following: true,
      featured: true,
      likes: 0,
      comments: 0,
      reposts: 0,
      bookmarks: 0,
      liked: false,
    };

    const db = await updateDb((current) => ({
      ...current,
      posts: [post, ...current.posts],
    }));

    return jsonResponse(db.posts[0]);
  }

  const postMatch = pathname.match(/^\/api\/posts\/(\d+)\/(like|comments)$/);
  if (request.method === "POST" && postMatch) {
    const postId = Number(postMatch[1]);
    const action = postMatch[2];

    const db = await readDb();
    const index = db.posts.findIndex((post) => post.id === postId);
    if (index < 0) return jsonResponse({ message: "Post not found" }, 404);

    const post = db.posts[index];

    if (action === "like") {
      const nextPost: Post = {
        ...post,
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      };

      db.posts[index] = nextPost;
      await updateDb(() => db);
      return jsonResponse(nextPost);
    }

    const body = await parseJsonBody(request);
    const text = String(body.text ?? "").trim();
    if (!text) return jsonResponse({ message: "Comment text is required" }, 400);

    const nextPost: Post = {
      ...post,
      comments: post.comments + 1,
      latestComment: {
        author: "You",
        text,
      },
    };

    db.posts[index] = nextPost;
    await updateDb(() => db);
    return jsonResponse(nextPost);
  }

  if (request.method === "GET" && pathname === "/api/notifications") {
    const db = await readDb();
    return jsonResponse(db.notifications);
  }

  if (request.method === "GET" && pathname === "/api/messages") {
    const db = await readDb();
    return jsonResponse(db.messages);
  }

  if (request.method === "GET" && pathname === "/api/profile") {
    const db = await readDb();
    return jsonResponse(db.profile);
  }

  return null;
}

type MiddlewareHost = {
  middlewares: {
    use: (handler: (req: any, res: any, next: (error?: unknown) => void) => void) => void;
  };
};

function attachMiddleware(app: MiddlewareHost) {
  app.middlewares.use(async (req, res, next) => {
    if (!req.url) return next();

    const url = new URL(req.url, "http://localhost");
    if (!url.pathname.startsWith("/api/")) return next();

    try {
      const request = new Request(url.toString(), {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: req.method && !["GET", "HEAD"].includes(req.method)
          ? await new Promise<string>((resolve) => {
              let raw = "";
              req.setEncoding("utf8");
              req.on("data", (chunk) => {
                raw += chunk;
              });
              req.on("end", () => resolve(raw));
            })
          : undefined,
      });

      const response = await handleApi(url.pathname, request);
      if (!response) return next();

      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(await response.text());
    } catch (error) {
      next(error as Error);
    }
  });
}

export function socialApiPlugin(): Plugin {
  return {
    name: "social-api-plugin",
    configureServer(server) {
      attachMiddleware(server);
    },
    configurePreviewServer(server: PreviewServer) {
      attachMiddleware(server);
    },
  };
}
