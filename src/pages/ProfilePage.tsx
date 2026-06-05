import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getProfile, type ProfileSummary } from "../lib/api";

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileSummary | null>(null);

  useEffect(() => {
    let mounted = true;
    void getProfile().then((data) => {
      if (mounted) setProfile(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="workspace-shell">
      <header className="workspace-header">
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{profile?.name ?? user?.name ?? "Your profile"}</h1>
          <p>{profile?.bio ?? "Loading your creator profile..."}</p>
        </div>
        <Link className="text-button" to="/app">
          Back to feed
        </Link>
      </header>

      <section className="workspace-grid">
        <article className="workspace-card profile-highlight">
          <p className="sidebar-label">At a glance</p>
          <div className="profile-row">
            <div className="avatar avatar-large">
              {(user?.name ?? profile?.name ?? "AJ")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h2>{profile?.name ?? user?.name ?? "Ayushi Jain"}</h2>
              <p>{profile?.handle ?? user?.email ?? "@ayushi.creates"}</p>
            </div>
          </div>

          <div className="profile-stats profile-stats-large">
            <div>
              <strong>{profile?.followers ?? "18.4K"}</strong>
              <span>followers</span>
            </div>
            <div>
              <strong>{profile?.following ?? "312"}</strong>
              <span>following</span>
            </div>
            <div>
              <strong>{profile?.posts ?? "4"}</strong>
              <span>posts</span>
            </div>
          </div>
        </article>

        <article className="workspace-card">
          <p className="sidebar-label">Recent wins</p>
          <div className="timeline">
            <div>
              <strong>Published a new product thread</strong>
              <p>Shared a cleaner approach to feed hierarchies and content rhythm.</p>
            </div>
            <div>
              <strong>Boosted reply volume</strong>
              <p>Added inline comment support so posts can keep the discussion close.</p>
            </div>
            <div>
              <strong>Grew the community</strong>
              <p>Built the first version of a profile and messaging workspace.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
