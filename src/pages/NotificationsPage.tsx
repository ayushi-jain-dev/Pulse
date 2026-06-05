import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNotifications, type NotificationItem } from "../lib/api";

const toneLabels: Record<NotificationItem["tone"], string> = {
  info: "Info",
  success: "Success",
  warning: "Watch",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let mounted = true;
    void getNotifications().then((data) => {
      if (mounted) setNotifications(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Notifications</p>
          <h1>Alerts</h1>
          <p>A quick pulse on mentions, replies, and community activity.</p>
        </div>
        <Link className="text-button" to="/app">
          Back to feed
        </Link>
      </header>

      <section className="workspace-card notification-list">
        {notifications.map((notification) => (
          <article className={`notification-item tone-${notification.tone}`} key={notification.id}>
            <div className="notification-meta">
              <span>{toneLabels[notification.tone]}</span>
              <strong>{notification.title}</strong>
            </div>
            <p>{notification.detail}</p>
            <time>{notification.time}</time>
          </article>
        ))}
      </section>
    </main>
  );
}
