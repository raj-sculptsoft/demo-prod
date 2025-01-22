interface TagListProps {
  tags: { id: string; label: string }[];
  onTagRemove: (tagId: string) => void;
}

export default function TagList({ tags, onTagRemove }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-1 rounded-sm bg-gray-100 px-3 py-1 text-sm"
        >
          <span>
            {tag.label.length > 50 ? tag.label.slice(0, 50) + "..." : tag.label}
          </span>
          <button
            onClick={() => onTagRemove(tag.id)}
            className="ml-4 rounded-full bg-gray-200 p-2 transition-colors"
          >
            <span>X</span>
          </button>
        </div>
      ))}
    </div>
  );
}
