'use client';

import { useState, useMemo, useRef } from 'react';

interface Tag {
  id: string;
  name: string;
  color?: string | null;
}

interface TagsInputProps {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  onCreateTag?: (name: string) => Promise<Tag | null>;
  placeholder?: string;
  disabled?: boolean;
}

export function TagsInput({
  selectedTags,
  availableTags,
  onTagsChange,
  onCreateTag,
  placeholder = 'Add tags...',
  disabled = false,
}: TagsInputProps) {
  const [customInput, setCustomInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Get selected tag IDs for quick lookup
  const selectedTagIds = useMemo(() => {
    return new Set(selectedTags.map(tag => tag.id));
  }, [selectedTags]);

  // Filter available tags based on search query (show all tags, including selected ones)
  const filteredTags = useMemo(() => {
    let tags = availableTags;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tags = tags.filter(tag =>
        tag.name.toLowerCase().includes(query)
      );
    }

    return tags;
  }, [availableTags, searchQuery]);

  // Handle adding custom tag
  const handleAddCustom = async () => {
    if (!customInput.trim() || disabled || !onCreateTag) return;
    
    const trimmed = customInput.trim();
    
    // Check if tag already exists (case-insensitive)
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (existingTag) {
      // If exists but not selected, add it
      if (!selectedTagIds.has(existingTag.id)) {
        onTagsChange([...selectedTags, existingTag]);
      }
      setCustomInput('');
      return;
    }

    // Create new tag
    const newTag = await onCreateTag(trimmed);
    if (newTag) {
      onTagsChange([...selectedTags, newTag]);
      setCustomInput('');
    }
  };

  // Handle tag toggle
  const handleTagToggle = (tag: Tag) => {
    if (disabled) return;
    
    if (selectedTagIds.has(tag.id)) {
      // Remove tag
      onTagsChange(selectedTags.filter(t => t.id !== tag.id));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div ref={containerRef} className="space-y-3">
      {/* Add Custom Tag */}
      {onCreateTag && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustom();
              }
            }}
            placeholder="Add custom tag..."
            disabled={disabled}
            className="flex-1 px-3 py-2 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={disabled || !customInput.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${placeholder.toLowerCase()}...`}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Tags List */}
      <div className="w-full bg-gray-900/60 border border-gray-500/60 rounded-lg overflow-hidden">
        <div className="max-h-[240px] overflow-y-auto">
          {filteredTags.length > 0 ? (
            <div className="p-1">
              {filteredTags.map((tag) => {
                const isSelected = selectedTagIds.has(tag.id);
                return (
                  <div
                    key={tag.id}
                    onClick={() => handleTagToggle(tag)}
                    className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-200'
                        : 'text-gray-200 hover:bg-gray-700/50'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={isSelected && tag.color ? {
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                    } : {}}
                  >
                    {/* Checkmark */}
                    <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded border-2 ${
                      isSelected
                        ? tag.color
                          ? `bg-[${tag.color}] border-[${tag.color}]`
                          : 'bg-purple-500 border-purple-500'
                        : 'border-gray-500'
                    }`}
                    style={isSelected && tag.color ? {
                      backgroundColor: tag.color,
                      borderColor: tag.color,
                    } : {}}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {/* Tag Name */}
                    <span className="flex-1 text-sm">{tag.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              {searchQuery.trim() ? 'No tags found' : 'No tags available'}
            </div>
          )}
        </div>
      </div>

      {/* Selected count */}
      {selectedTags.length > 0 && (
        <p className="text-xs text-gray-400/80">
          Selected: {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'}
        </p>
      )}
    </div>
  );
}

// Display component for tags (read-only)
interface TagsDisplayProps {
  tags: Tag[];
  onTagClick?: (tag: Tag) => void;
  className?: string;
}

export function TagsDisplay({ tags, onTagClick, className = '' }: TagsDisplayProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map(tag => (
        <span
          key={tag.id}
          onClick={() => onTagClick?.(tag)}
          className={`inline-flex items-center px-2 py-1 rounded-md text-sm bg-purple-600/20 text-purple-300 border border-purple-500/30 ${
            onTagClick ? 'cursor-pointer hover:bg-purple-600/30 transition-colors' : ''
          }`}
          style={tag.color ? { borderColor: tag.color, backgroundColor: `${tag.color}20`, color: tag.color } : {}}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}
