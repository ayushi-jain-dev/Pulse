import { NavLink } from "react-router-dom";
import type { AuthUser } from "../auth/AuthContext";
import type { FeedTab } from "../types";

interface SidebarProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  user: AuthUser | null;
  onLogout: () => void;
}

const tabs: FeedTab[] = ["For you", "Following", "Trending"];

function getInitials(user: AuthUser | null) {
  const source = user?.name ?? "Ayushi Jain";
  return source
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Sidebar({ activeTab, onTabChange, user, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">P</div>
        <div>
          <p className="brand-kicker">Social</p>
          <h1>Pulse</h1>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Feed filters">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-item ${activeTab === tab ? "is-active" : ""}`}
            onClick={() => onTabChange(tab)}
            type="button"
          >
            <span>{tab}</span>
            {tab === "Trending" ? <strong>128</strong> : null}
          </button>
        ))}
      </nav>

      <section className="sidebar-card workspace-nav">
        <p className="sidebar-label">Workspace</p>
        <div className="workspace-links">
          <NavLink className={({ isActive }) => `workspace-link ${isActive ? "is-active" : ""}`} to="/profile">
            Profile
          </NavLink>
          <NavLink className={({ isActive }) => `workspace-link ${isActive ? "is-active" : ""}`} to="/messages">
            Messages
          </NavLink>
          <NavLink className={({ isActive }) => `workspace-link ${isActive ? "is-active" : ""}`} to="/notifications">
            Notifications
          </NavLink>
        </div>
      </section>

      <section className="sidebar-card profile-card">
        <p className="sidebar-label">Your profile</p>
        <div className="profile-row">
          <div className="avatar avatar-large">{getInitials(user)}</div>
          <div>
            <h2>{user?.name ?? "Ayushi Jain"}</h2>
            <p>{user?.email ?? "@Ayushi.creates"}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div>
            <strong>18.4K</strong>
            <span>followers</span>
          </div>
          <div>
            <strong>412</strong>
            <span>posts</span>
          </div>
          <div>
            <strong>89%</strong>
            <span>engagement</span>
          </div>
        </div>
        <button className="ghost-button sidebar-logout" type="button" onClick={onLogout}>
          Log out
        </button>
      </section>

      <section className="sidebar-card tip-card">
        <p className="sidebar-label">Creator tip</p>
        <p>
          Keep one clear action per screen. It makes the feed feel composed
          instead of crowded.
        </p>
      </section>
    </aside>
  );
}
