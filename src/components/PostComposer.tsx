import { useId } from "react";

interface PostComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
}

export function PostComposer({ value, onChange, onSubmit }: PostComposerProps) {
  const id = useId();

  return (
    <section className="composer-panel" aria-labelledby={id}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Compose</p>
          <h3 id={id}>Share an update</h3>
        </div>
      </div>

      <label className="composer">
        <span className="sr-only">Post content</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="What are you building, learning, or celebrating today?"
          rows={4}
        />
      </label>

      <div className="composer-footer">
        <div className="composer-chips" aria-label="Post hints">
          <span>Tips: keep it focused</span>
          <span>Use a tag like #buildinpublic</span>
        </div>
        <button className="primary-button" onClick={() => void onSubmit()} type="button">
          Post update
        </button>
      </div>
    </section>
  );
}
