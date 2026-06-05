import type { Post } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export interface CreatePostInput {
  author: string;
  handle: string;
  avatar: string;
  content: string;
  tags: string[];
}

export function getPosts() {
  return request<Post[]>("/api/posts");
}

export function createPost(input: CreatePostInput) {
  return request<Post>("/api/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function toggleLike(postId: number) {
  return request<Post>(`/api/posts/${postId}/like`, {
    method: "POST",
  });
}

export function addComment(postId: number, text: string) {
  return request<Post>(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

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

export function getNotifications() {
  return request<NotificationItem[]>("/api/notifications");
}

export function getMessages() {
  return request<MessageThread[]>("/api/messages");
}

export function getProfile() {
  return request<ProfileSummary>("/api/profile");
}
