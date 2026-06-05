import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMessages, type MessageThread } from "../lib/api";

const transcript = [
  { author: "Mila", text: "Can we turn this into a shared launch template?" },
  { author: "You", text: "Absolutely. I’ll sketch a cleaner structure tonight." },
  { author: "Mila", text: "Perfect. Keep the tone light and visual." },
];

export function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    void getMessages().then((data) => {
      if (mounted) {
        setThreads(data);
        setActiveThreadId(data[0]?.id ?? null);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  );

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Messages</p>
          <h1>Inbox</h1>
          <p>Keep conversations close to the feed and move from idea to collaboration quickly.</p>
        </div>
        <Link className="text-button" to="/app">
          Back to feed
        </Link>
      </header>

      <section className="messages-layout">
        <aside className="workspace-card message-list">
          {threads.map((thread) => (
            <button
              key={thread.id}
              className={`message-thread ${activeThreadId === thread.id ? "is-active" : ""}`}
              type="button"
              onClick={() => setActiveThreadId(thread.id)}
            >
              <div>
                <strong>{thread.name}</strong>
                <p>{thread.handle}</p>
              </div>
              {thread.unread > 0 ? <span className="badge">{thread.unread}</span> : null}
            </button>
          ))}
        </aside>

        <article className="workspace-card chat-panel">
          <div className="chat-header">
            <div>
              <p className="sidebar-label">Conversation</p>
              <h2>{activeThread?.name ?? "Select a thread"}</h2>
              <p>{activeThread?.lastMessage ?? "Pick a conversation to see the latest exchange."}</p>
            </div>
          </div>

          <div className="chat-transcript">
            {transcript.map((message) => (
              <div key={`${message.author}-${message.text}`} className={`chat-bubble ${message.author === "You" ? "is-you" : ""}`}>
                <strong>{message.author}</strong>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          <div className="chat-composer">
            <textarea rows={3} placeholder="Type a message..." />
            <button className="primary-button" type="button">
              Send
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
