import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initialPosts } from "../src/data/mockData";
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(rootDir, "social-db.json");
const defaultDb = {
    posts: initialPosts.map((post) => ({ ...post })),
    notifications: [
        {
            id: 1,
            title: "New mention",
            detail: "Mila Stone mentioned your last design thread.",
            time: "2m ago",
            tone: "info",
        },
        {
            id: 2,
            title: "Comment activity",
            detail: "Three new replies arrived on your featured post.",
            time: "18m ago",
            tone: "success",
        },
        {
            id: 3,
            title: "Community trend",
            detail: "#buildinpublic is climbing in your network.",
            time: "1h ago",
            tone: "warning",
        },
    ],
    messages: [
        {
            id: 1,
            name: "Mila Stone",
            handle: "@mila.stone",
            lastMessage: "Can we turn this into a shared launch template?",
            unread: 2,
        },
        {
            id: 2,
            name: "Noah Vale",
            handle: "@noah.vale",
            lastMessage: "The new feed feels much calmer on mobile.",
            unread: 0,
        },
        {
            id: 3,
            name: "Pulse Design",
            handle: "@team.pulse",
            lastMessage: "Your dashboard concept is ready for review.",
            unread: 1,
        },
    ],
    profile: {
        name: "Akshay Jain",
        handle: "@akshay.creates",
        bio: "Building social experiences with a focus on clarity, community, and fast iteration.",
        followers: "18.4K",
        following: "312",
        posts: String(initialPosts.length),
    },
};
async function ensureDb() {
    try {
        await readFile(dbFile, "utf8");
    }
    catch {
        await mkdir(rootDir, { recursive: true });
        await writeFile(dbFile, JSON.stringify(defaultDb, null, 2), "utf8");
    }
}
export async function readDb() {
    await ensureDb();
    const raw = await readFile(dbFile, "utf8");
    return JSON.parse(raw);
}
export async function writeDb(nextDb) {
    await mkdir(rootDir, { recursive: true });
    await writeFile(dbFile, JSON.stringify(nextDb, null, 2), "utf8");
}
export async function updateDb(updater) {
    const db = await readDb();
    const nextDb = await updater(db);
    await writeDb(nextDb);
    return nextDb;
}
