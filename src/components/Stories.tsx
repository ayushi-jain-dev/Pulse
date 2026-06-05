import type { Story } from "../types";

interface StoriesProps {
  stories: Story[];
}

export function Stories({ stories }: StoriesProps) {
  return (
    <section className="stories-panel" aria-label="Stories">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Highlights</p>
          <h3>Stories</h3>
        </div>
        <button className="text-button" type="button">
          View all
        </button>
      </div>

      <div className="stories-row">
        {stories.map((story) => (
          <article className="story-card" key={story.id}>
            <div className="story-ring" style={{ background: story.gradient }}>
              <span className="story-avatar">{story.name.slice(0, 1)}</span>
            </div>
            <h4>{story.name}</h4>
            <p>{story.handle}</p>
            {story.live ? <span className="live-pill">Live</span> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
