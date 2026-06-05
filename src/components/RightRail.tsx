import type { Suggestion, Trend } from "../types";

interface RightRailProps {
  trends: Trend[];
  suggestions: Suggestion[];
}

export function RightRail({ trends, suggestions }: RightRailProps) {
  return (
    <aside className="rail">
      <section className="rail-card">
        <p className="sidebar-label">Trending now</p>
        <div className="rail-list">
          {trends.map((trend, index) => (
            <div className="rail-item" key={trend.id}>
              <div>
                <strong>{index + 1}. {trend.label}</strong>
                <p>{trend.posts}</p>
              </div>
              <button className="text-button" type="button">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rail-card">
        <p className="sidebar-label">Who to follow</p>
        <div className="rail-list">
          {suggestions.map((suggestion) => (
            <div className="rail-item" key={suggestion.id}>
              <div>
                <strong>{suggestion.name}</strong>
                <p>{suggestion.handle}</p>
                <span>{suggestion.bio}</span>
              </div>
              <button className="primary-pill" type="button">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rail-card spark-card">
        <p className="sidebar-label">Weekly spark</p>
        <h3>Post something small every day</h3>
        <p>
          Consistency beats volume. Share the tiny decisions behind the work to
          build trust and momentum.
        </p>
      </section>
    </aside>
  );
}
