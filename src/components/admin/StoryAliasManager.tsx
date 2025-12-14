'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { StoryAlias } from '@/types/oc';
import { FormButton } from './forms/FormButton';
import { FormMessage } from './forms/FormMessage';
import { slugify } from '@/lib/utils/slugify';

interface StoryAliasManagerProps {
  worldId: string;
  worldIsCanon: boolean;
}

export function StoryAliasManager({ worldId, worldIsCanon }: StoryAliasManagerProps) {
  const [storyAliases, setStoryAliases] = useState<StoryAlias[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    if (worldId && worldIsCanon) {
      fetchStoryAliases();
    } else {
      setIsLoading(false);
    }
  }, [worldId, worldIsCanon]);

  async function fetchStoryAliases() {
    if (!worldId) return;

    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error: fetchError } = await supabase
      .from('story_aliases')
      .select('*')
      .eq('world_id', worldId)
      .order('name', { ascending: true });

    if (fetchError) {
      setError(`Failed to load story aliases: ${fetchError.message}`);
    } else {
      setStoryAliases(data || []);
    }

    setIsLoading(false);
  }

  async function getUsageCounts(aliasId: string) {
    const supabase = createClient();
    const [ocsResult, loreResult, eventsResult] = await Promise.all([
      supabase.from('ocs').select('id', { count: 'exact', head: true }).eq('story_alias_id', aliasId),
      supabase.from('world_lore').select('id', { count: 'exact', head: true }).eq('story_alias_id', aliasId),
      supabase.from('timeline_events').select('id', { count: 'exact', head: true }).eq('story_alias_id', aliasId),
    ]);

    return {
      ocs: ocsResult.count || 0,
      lore: loreResult.count || 0,
      events: eventsResult.count || 0,
      total: (ocsResult.count || 0) + (loreResult.count || 0) + (eventsResult.count || 0),
    };
  }

  async function handleCreate() {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsCreating(true);
    setError(null);
    const supabase = createClient();

    const slug = formData.slug.trim() || slugify(formData.name);

    const { data, error: createError } = await supabase
      .from('story_aliases')
      .insert({
        world_id: worldId,
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || null,
      })
      .select()
      .single();

    if (createError) {
      setError(`Failed to create story alias: ${createError.message}`);
      setIsCreating(false);
      return;
    }

    setFormData({ name: '', slug: '', description: '' });
    await fetchStoryAliases();
    setIsCreating(false);
  }

  async function handleUpdate(id: string) {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setError(null);
    const supabase = createClient();

    const slug = formData.slug.trim() || slugify(formData.name);

    const { error: updateError } = await supabase
      .from('story_aliases')
      .update({
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || null,
      })
      .eq('id', id);

    if (updateError) {
      setError(`Failed to update story alias: ${updateError.message}`);
      return;
    }

    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
    await fetchStoryAliases();
  }

  async function handleDelete(id: string) {
    setError(null);
    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from('story_aliases')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(`Failed to delete story alias: ${deleteError.message}`);
      return;
    }

    setDeleteConfirmId(null);
    await fetchStoryAliases();
  }

  function startEdit(alias: StoryAlias) {
    setEditingId(alias.id);
    setFormData({
      name: alias.name,
      slug: alias.slug,
      description: alias.description || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '' });
  }

  if (!worldIsCanon) {
    return (
      <div className="text-sm text-gray-400">
        Story aliases are only available for canon worlds.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-sm text-gray-400">Loading story aliases...</div>;
  }

  return (
    <div className="space-y-4">
      {error && <FormMessage type="error" message={error} />}

      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-2">Story Aliases</h3>
        <p className="text-sm text-gray-400 mb-4">
          Create named storylines/continuities for this canon world (e.g., "Red Thread", "House of Cards").
        </p>
      </div>

      {/* Create Form */}
      {!editingId && (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Create New Story Alias</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (!formData.slug) {
                    setFormData({ ...formData, name: e.target.value, slug: slugify(e.target.value) });
                  }
                }}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded text-gray-100"
                placeholder="e.g., Red Thread"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded text-gray-100"
                placeholder="Auto-generated from name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded text-gray-100"
                rows={2}
                placeholder="Brief description of this storyline/continuity"
              />
            </div>
            <FormButton
              type="button"
              variant="primary"
              onClick={handleCreate}
              isLoading={isCreating}
              disabled={isCreating || !formData.name.trim()}
            >
              Create Story Alias
            </FormButton>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editingId && (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Edit Story Alias</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (!formData.slug) {
                    setFormData({ ...formData, name: e.target.value, slug: slugify(e.target.value) });
                  }
                }}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-700 rounded text-gray-100"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <FormButton
                type="button"
                variant="primary"
                onClick={() => handleUpdate(editingId)}
                disabled={!formData.name.trim()}
              >
                Save Changes
              </FormButton>
              <FormButton type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </FormButton>
            </div>
          </div>
        </div>
      )}

      {/* List of Story Aliases */}
      {storyAliases.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Existing Story Aliases</h4>
          {storyAliases.map((alias) => (
            <StoryAliasItem
              key={alias.id}
              alias={alias}
              isEditing={editingId === alias.id}
              onEdit={() => startEdit(alias)}
              onDelete={() => setDeleteConfirmId(alias.id)}
              onCancelEdit={cancelEdit}
              deleteConfirmId={deleteConfirmId}
              onConfirmDelete={() => handleDelete(alias.id)}
              onCancelDelete={() => setDeleteConfirmId(null)}
            />
          ))}
        </div>
      )}

      {storyAliases.length === 0 && !editingId && (
        <div className="text-sm text-gray-400 italic">No story aliases created yet.</div>
      )}
    </div>
  );
}

interface StoryAliasItemProps {
  alias: StoryAlias;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  deleteConfirmId: string | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

function StoryAliasItem({
  alias,
  isEditing,
  onEdit,
  onDelete,
  onCancelEdit,
  deleteConfirmId,
  onConfirmDelete,
  onCancelDelete,
}: StoryAliasItemProps) {
  const [usageCounts, setUsageCounts] = useState<{ ocs: number; lore: number; events: number; total: number } | null>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  useEffect(() => {
    async function loadUsage() {
      setLoadingUsage(true);
      const supabase = createClient();
      const [ocsResult, loreResult, eventsResult] = await Promise.all([
        supabase.from('ocs').select('id', { count: 'exact', head: true }).eq('story_alias_id', alias.id),
        supabase.from('world_lore').select('id', { count: 'exact', head: true }).eq('story_alias_id', alias.id),
        supabase.from('timeline_events').select('id', { count: 'exact', head: true }).eq('story_alias_id', alias.id),
      ]);

      setUsageCounts({
        ocs: ocsResult.count || 0,
        lore: loreResult.count || 0,
        events: eventsResult.count || 0,
        total: (ocsResult.count || 0) + (loreResult.count || 0) + (eventsResult.count || 0),
      });
      setLoadingUsage(false);
    }

    loadUsage();
  }, [alias.id]);

  if (isEditing) {
    return null; // Edit form is shown separately
  }

  const isDeleting = deleteConfirmId === alias.id;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-medium text-gray-200">{alias.name}</div>
          {alias.description && (
            <div className="text-sm text-gray-400 mt-1">{alias.description}</div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Slug: <code className="bg-gray-900/60 px-1 rounded">{alias.slug}</code>
          </div>
          {loadingUsage ? (
            <div className="text-xs text-gray-500 mt-2">Loading usage...</div>
          ) : usageCounts && usageCounts.total > 0 ? (
            <div className="text-xs text-gray-500 mt-2">
              Used by: {usageCounts.ocs} OC{usageCounts.ocs !== 1 ? 's' : ''}, {usageCounts.lore} lore entr{usageCounts.lore !== 1 ? 'ies' : 'y'}, {usageCounts.events} event{usageCounts.events !== 1 ? 's' : ''}
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 ml-4">
          {!isDeleting ? (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onConfirmDelete}
                className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-600"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

