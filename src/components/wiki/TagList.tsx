interface TagListProps {
  tags: string[];
  className?: string;
}

export function TagList({ tags, className = '' }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span key={tag} className="wiki-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}
