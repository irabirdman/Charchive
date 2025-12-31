'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FanficChapter } from '@/types/oc';
import { createClient } from '@/lib/supabase/client';
import { FormButton } from './forms/FormButton';
import { FormLabel } from './forms/FormLabel';
import { FormInput } from './forms/FormInput';
import { FormTextarea } from './forms/FormTextarea';
import { FormMessage } from './forms/FormMessage';

interface FanficChaptersManagerProps {
  fanficId: string;
}

export function FanficChaptersManager({ fanficId }: FanficChaptersManagerProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Array<FanficChapter & { tempId?: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadChapters();
  }, [fanficId]);

  async function loadChapters() {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/fanfics/${fanficId}/chapters`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load chapters' }));
        throw new Error(errorData.error || 'Failed to load chapters');
      }
      
      const data = await response.json();
      setChapters(data.chapters || []);
    } catch (err) {
      console.error('Error loading chapters:', err);
      setError(err instanceof Error ? err.message : 'Failed to load chapters');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveChapters() {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Recalculate chapter numbers based on array position
      const chaptersToSave = chapters.map((chapter, index) => ({
        chapter_number: index + 1,
        title: chapter.title || null,
        content: chapter.content || null,
        is_published: chapter.is_published || false,
      }));

      const response = await fetch(`/api/admin/fanfics/${fanficId}/chapters`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapters: chaptersToSave }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save chapters' }));
        throw new Error(errorData.error || 'Failed to save chapters');
      }

      const data = await response.json();
      setChapters(Array.isArray(data) ? data : []);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving chapters:', err);
      setError(err instanceof Error ? err.message : 'Failed to save chapters');
    } finally {
      setIsSaving(false);
    }
  }

  function addChapter() {
    const tempId = `temp-${Date.now()}`;
    const newChapter: FanficChapter & { tempId: string } = {
      id: tempId,
      fanfic_id: fanficId,
      chapter_number: chapters.length + 1,
      title: null,
      content: null,
      word_count: null,
      is_published: false,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tempId,
    };
    setChapters([...chapters, newChapter]);
  }

  function removeChapter(index: number) {
    if (!confirm('Are you sure you want to remove this chapter?')) {
      return;
    }
    const updated = chapters.filter((_, i) => i !== index);
    setChapters(updated);
  }

  function moveChapter(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === chapters.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...chapters];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setChapters(updated);
  }

  function updateChapter(index: number, field: keyof FanficChapter, value: any) {
    const updated = [...chapters];
    updated[index] = { ...updated[index], [field]: value };
    setChapters(updated);
  }

  if (isLoading) {
    return <div className="text-gray-400">Loading chapters...</div>;
  }

  return (
    <div className="space-y-6">
      {error && <FormMessage type="error" message={error} />}
      {success && <FormMessage type="success" message="Chapters saved successfully!" />}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Manage Chapters</h2>
          <p className="text-sm text-gray-400 mt-1">
            Add, edit, and reorder chapters for this fanfic
          </p>
        </div>
        <div className="flex gap-2">
          <FormButton
            type="button"
            variant="secondary"
            onClick={addChapter}
            disabled={isSaving}
          >
            Add Chapter
          </FormButton>
          <FormButton
            type="button"
            variant="primary"
            onClick={saveChapters}
            disabled={isSaving}
            isLoading={isSaving}
          >
            Save All Chapters
          </FormButton>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-800/40 rounded-lg border border-gray-700">
          <p className="mb-4">No chapters yet. Add your first chapter to get started.</p>
          <FormButton
            type="button"
            variant="primary"
            onClick={addChapter}
            disabled={isSaving}
          >
            Add First Chapter
          </FormButton>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id || chapter.tempId}
              className="border border-gray-700 rounded-lg p-6 bg-gray-800/40"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-gray-300">
                    Chapter {index + 1}
                  </span>
                  {chapter.is_published && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-green-900/50 text-green-300 border border-green-700">
                      Published
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveChapter(index, 'up')}
                    disabled={index === 0 || isSaving}
                    className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveChapter(index, 'down')}
                    disabled={index === chapters.length - 1 || isSaving}
                    className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeChapter(index)}
                    disabled={isSaving}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <FormLabel htmlFor={`chapter-${index}-title`}>
                    Chapter Title (Optional)
                  </FormLabel>
                  <FormInput
                    id={`chapter-${index}-title`}
                    value={chapter.title || ''}
                    onChange={(e) => updateChapter(index, 'title', e.target.value)}
                    placeholder="e.g., The Beginning, Chapter 1, etc."
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <FormLabel htmlFor={`chapter-${index}-content`}>
                    Chapter Content
                  </FormLabel>
                  <FormTextarea
                    id={`chapter-${index}-content`}
                    value={chapter.content || ''}
                    onChange={(e) => updateChapter(index, 'content', e.target.value)}
                    rows={15}
                    placeholder="Write your chapter content here... (Markdown supported)"
                    disabled={isSaving}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`chapter-${index}-published`}
                    checked={chapter.is_published || false}
                    onChange={(e) => updateChapter(index, 'is_published', e.target.checked)}
                    disabled={isSaving}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  <FormLabel htmlFor={`chapter-${index}-published`}>
                    Publish this chapter (make it visible to public)
                  </FormLabel>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

