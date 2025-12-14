'use client';

import { useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { FormSelect } from './forms/FormSelect';
import { FormLabel } from './forms/FormLabel';
import type { StoryAlias } from '@/types/oc';
import { createClient } from '@/lib/supabase/client';

interface StoryAliasSelectorProps {
  worldId: string | null | undefined;
  register?: UseFormRegisterReturn;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  name?: string;
  error?: string;
  disabled?: boolean;
}

export function StoryAliasSelector({
  worldId,
  register,
  value,
  onChange,
  onBlur,
  name,
  error,
  disabled,
}: StoryAliasSelectorProps) {
  const [storyAliases, setStoryAliases] = useState<StoryAlias[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [worldIsCanon, setWorldIsCanon] = useState(false);

  useEffect(() => {
    async function fetchStoryAliases() {
      if (!worldId) {
        setStoryAliases([]);
        setWorldIsCanon(false);
        return;
      }

      setIsLoading(true);
      const supabase = createClient();

      // First check if world is canon
      const { data: world } = await supabase
        .from('worlds')
        .select('series_type')
        .eq('id', worldId)
        .single();

      if (world?.series_type !== 'canon') {
        setStoryAliases([]);
        setWorldIsCanon(false);
        setIsLoading(false);
        return;
      }

      setWorldIsCanon(true);

      // Fetch story aliases for this world
      const { data, error } = await supabase
        .from('story_aliases')
        .select('*')
        .eq('world_id', worldId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching story aliases:', error);
        setStoryAliases([]);
      } else {
        setStoryAliases(data || []);
      }

      setIsLoading(false);
    }

    fetchStoryAliases();
  }, [worldId]);

  // Don't show selector if world is not canon or no world selected
  if (!worldId || !worldIsCanon) {
    return null;
  }

  const options = [
    { value: '', label: 'Base World (No Story Alias)' },
    ...storyAliases.map((alias) => ({
      value: alias.id,
      label: alias.name,
    })),
  ];

  // Ensure value is properly converted for display (null/undefined -> empty string)
  const displayValue = value === null || value === undefined ? '' : String(value);

  // Use Controller props if provided, otherwise fall back to register
  const selectProps = register
    ? { ...register }
    : {
        value: displayValue,
        onChange,
        onBlur,
        name: name || 'story_alias_id',
      };

  return (
    <div>
      <FormLabel htmlFor={register?.name || name || 'story_alias_id'} optional>
        Story Alias
      </FormLabel>
      <FormSelect
        {...selectProps}
        key={`story-alias-${storyAliases.length}-${displayValue || 'empty'}-${worldId || 'no-world'}`}
        options={options}
        placeholder={undefined}
        error={error}
        disabled={disabled || isLoading}
        helpText="Optional: Link this content to a specific story variant/continuity"
      />
    </div>
  );
}

