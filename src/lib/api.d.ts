import type { Post } from "../types";
export interface CreatePostInput {
    author: string;
    handle: string;
    avatar: string;
    content: string;
    tags: string[];
}
export declare function getPosts(): Promise<Post[]>;
export declare function createPost(input: CreatePostInput): Promise<Post>;
export declare function toggleLike(postId: number): Promise<Post>;
export declare function addComment(postId: number, text: string): Promise<Post>;
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
export declare function getNotifications(): Promise<NotificationItem[]>;
export declare function getMessages(): Promise<MessageThread[]>;
export declare function getProfile(): Promise<ProfileSummary>;
