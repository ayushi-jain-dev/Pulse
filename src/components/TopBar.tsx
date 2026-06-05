interface TopBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function TopBar({ search, onSearchChange }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h2 className="page-title">Your feed is live</h2>
      </div>

      <div className="topbar-actions">
        <label className="search" aria-label="Search posts">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Creators, tags, or words"
            type="search"
          />
        </label>

        <button className="icon-button" type="button" aria-label="Notifications">
          <span className="icon-button-badge">3</span>
          <span aria-hidden="true">◌</span>
        </button>
      </div>
    </header>
  );
}
