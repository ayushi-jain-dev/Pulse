const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
async function request(path, init) {
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
    return (await response.json());
}
export function getPosts() {
    return request("/api/posts");
}
export function createPost(input) {
    return request("/api/posts", {
        method: "POST",
        body: JSON.stringify(input),
    });
}
export function toggleLike(postId) {
    return request(`/api/posts/${postId}/like`, {
        method: "POST",
    });
}
export function addComment(postId, text) {
    return request(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
    });
}
export function getNotifications() {
    return request("/api/notifications");
}
export function getMessages() {
    return request("/api/messages");
}
export function getProfile() {
    return request("/api/profile");
}
