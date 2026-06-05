export type FeedTab = "For you" | "Following" | "Trending";
export interface Story {
    id: number;
    name: string;
    handle: string;
    gradient: string;
    live?: boolean;
}
export interface PostMedia {
    title: string;
    subtitle: string;
    gradient: string;
}
export interface Post {
    id: number;
    author: string;
    handle: string;
    avatar: string;
    time: string;
    createdAt: number;
    content: string;
    tags: string[];
    following: boolean;
    featured?: boolean;
    media?: PostMedia;
    likes: number;
    comments: number;
    reposts: number;
    bookmarks: number;
    liked: boolean;
    latestComment?: {
        author: string;
        text: string;
    };
}
export interface Suggestion {
    id: number;
    name: string;
    handle: string;
    bio: string;
}
export interface Trend {
    id: number;
    label: string;
    posts: string;
}
