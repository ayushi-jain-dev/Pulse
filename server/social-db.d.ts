import type { Post } from "../src/types";
export interface NotificationItem {
    id: number;
    title: string;
    detail: string;
    time: string;
    tone: "info" | "success" | "warning";
}
export interface MessageThread {
    id: number;
    name: string;
    handle: string;
    lastMessage: string;
    unread: number;
}
export interface ProfileSummary {
    name: string;
    handle: string;
    bio: string;
    followers: string;
    following: string;
    posts: string;
}
export interface SocialDb {
    posts: Post[];
    notifications: NotificationItem[];
    messages: MessageThread[];
    profile: ProfileSummary;
}
export declare function readDb(): Promise<SocialDb>;
export declare function writeDb(nextDb: SocialDb): Promise<void>;
export declare function updateDb(updater: (db: SocialDb) => SocialDb | Promise<SocialDb>): Promise<SocialDb>;
