'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { TimelineEvent, OC, EventDateData } from '@/types/oc';
import { useWorlds } from '@/lib/hooks/useWorlds';
import { useOCsByWorld } from '@/lib/hooks/useOCsByWorld';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { DateInput } from './DateInput';
import { CategorySelector } from './CategorySelector';
import { FormMessage } from './forms/FormMessage';
import { FormLabel } from './forms/FormLabel';
import { FormInput } from './forms/FormInput';
import { FormSelect } from './forms/FormSelect';
import { FormTextarea } from './forms/FormTextarea';
import { FormButton } from './forms/FormButton';
import { StoryAliasSelector } from './StoryAliasSelector';

// Helper to normalize empty strings to null for optional UUID fields
const optionalUuid = z.preprocess(
  (val) => (val === '' || val === null ? null : val),
  z.string().uuid().nullable().optional()
);

const eventSchema = z.object({
  world_id: z.string().uuid('Invalid world'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  description_markdown: z.string().optional(),
  date_data: z.any().optional().nullable(),
  date_text: z.string().optional(),
  year: z.number().int().optional().nullable(),
  month: z.number().int().min(1).max(12).optional().nullable(),
  day: z.number().int().min(1).max(31).optional().nullable(),
  categories: z.array(z.string()).default([]),
  is_key_event: z.boolean().default(false),
  location: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  characters: z.array(z.object({
    oc_id: z.string().uuid(),
    role: z.string().optional(),
  })).default([]),
  story_alias_id: optionalUuid,
});

type EventFormData = z.infer<typeof eventSchema>;

interface TimelineEventFormProps {
  event?: TimelineEvent;
  worldId?: string; // Pre-select a world
}

export function TimelineEventForm({ event, worldId }: TimelineEventFormProps) {
  const router = useRouter();
  const { worlds } = useWorlds();
  const { isSubmitting, error, submit } = useFormSubmission<EventFormData>({
    apiRoute: '/api/admin/timeline-events',
    entity: event,
    successRoute: event ? `/admin/timeline-events/${event.id}` : '/admin/timeline-events',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      world_id: event.world_id,
      title: event.title,
      description: event.description || '',
      description_markdown: event.description_markdown || '',
      date_data: event.date_data || null,
      date_text: event.date_text || '',
      year: event.year || null,
      month: event.month || null,
      day: event.day || null,
      categories: event.categories || [],
      is_key_event: event.is_key_event || false,
      location: event.location || '',
      image_url: event.image_url || '',
      characters: event.characters?.map(c => ({
        oc_id: c.oc_id,
        role: c.role || '',
      })) || [],
      story_alias_id: event.story_alias_id ?? null,
    } : {
      world_id: worldId || '',
      title: '',
      description: '',
      description_markdown: '',
      date_data: null,
      date_text: '',
      year: null,
      month: null,
      day: null,
      categories: [],
      is_key_event: false,
      location: '',
      image_url: '',
      characters: [],
      story_alias_id: null,
    },
  });

  const watchedWorldId = watch('world_id');
  const watchedDateData = watch('date_data');
  const watchedCategories = watch('categories');
  const watchedCharacters = watch('characters');

  const { ocs: characters } = useOCsByWorld(watchedWorldId);

  // Extract year/month/day from date_data for sorting
  useEffect(() => {
    if (watchedDateData) {
      if (watchedDateData.type === 'exact') {
        setValue('year', watchedDateData.year);
        setValue('month', watchedDateData.month);
        setValue('day', watchedDateData.day);
      } else if (watchedDateData.type === 'range') {
        setValue('year', watchedDateData.start?.year);
        setValue('month', watchedDateData.start?.month);
        setValue('day', watchedDateData.start?.day);
      } else if (watchedDateData.type === 'approximate' && watchedDateData.year) {
        setValue('year', watchedDateData.year);
      }
    }
  }, [watchedDateData, setValue]);

  const onSubmit = async (data: EventFormData) => {
    try {
      const savedEvent = await submit(data);
      // After successful creation, navigate to the event detail page
      if (!event && savedEvent && savedEvent.id) {
        router.push(`/admin/timeline-events/${savedEvent.id}`);
        router.refresh();
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const addCharacter = () => {
    const currentChars = watchedCharacters || [];
    if (characters.length > 0) {
      setValue('characters', [
        ...currentChars,
        { oc_id: characters[0].id, role: '' },
      ]);
    }
  };

  const removeCharacter = (index: number) => {
    const currentChars = watchedCharacters || [];
    setValue('characters', currentChars.filter((_, i) => i !== index));
  };

  const updateCharacter = (index: number, field: 'oc_id' | 'role', value: string) => {
    const currentChars = watchedCharacters || [];
    const updated = [...currentChars];
    updated[index] = { ...updated[index], [field]: value };
    setValue('characters', updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <FormMessage type="error" message={error} />}

      <div>
        <FormLabel htmlFor="world_id" required>
          World
        </FormLabel>
        <FormSelect
          {...register('world_id')}
          options={worlds.map((world) => ({
            value: world.id,
            label: world.name,
          }))}
          placeholder="Select a world"
          error={errors.world_id?.message}
          disabled={!!event || isSubmitting} // Can't change world after creation
        />
      </div>

      <StoryAliasSelector
        worldId={watchedWorldId}
        register={register('story_alias_id')}
        error={errors.story_alias_id?.message}
        disabled={isSubmitting}
      />

      <div>
        <FormLabel htmlFor="title" required>
          Title
        </FormLabel>
        <FormInput
          {...register('title')}
          error={errors.title?.message}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <FormLabel htmlFor="description" optional>
          Description (Summary)
        </FormLabel>
        <FormTextarea
          {...register('description')}
          rows={3}
          placeholder="Brief summary of the event"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <FormLabel htmlFor="description_markdown" optional>
          Full Description (Markdown)
        </FormLabel>
        <FormTextarea
          {...register('description_markdown')}
          rows={10}
          markdown
          placeholder="Full event description in Markdown"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <FormLabel htmlFor="date_data">
          Date
        </FormLabel>
        <DateInput
          value={watchedDateData}
          onChange={(value) => setValue('date_data', value)}
        />
        <div className="mt-2">
          <FormLabel htmlFor="date_text" optional>
            Date Text (Legacy/Display Fallback)
          </FormLabel>
          <FormInput
            {...register('date_text')}
            placeholder="e.g., Spring 500 BCE"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <CategorySelector
          value={watchedCategories || []}
          onChange={(categories) => setValue('categories', categories)}
        />
      </div>

      <div>
        <FormLabel htmlFor="location" optional>
          Location
        </FormLabel>
        <FormInput
          {...register('location')}
          placeholder="Where did this event take place?"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <FormLabel htmlFor="image_url" optional>
          Image URL
        </FormLabel>
        <FormInput
          {...register('image_url')}
          type="url"
          placeholder="https://..."
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          {...register('is_key_event')}
          type="checkbox"
          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500"
        />
        <label className="text-sm font-medium text-gray-300">
          Key Event
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Characters Involved
          </label>
          {characters.length > 0 && (
            <button
              type="button"
              onClick={addCharacter}
              className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              + Add Character
            </button>
          )}
        </div>
        {watchedCharacters && watchedCharacters.length > 0 ? (
          <div className="space-y-2">
            {watchedCharacters.map((char, index) => (
              <div key={index} className="flex gap-2">
                <select
                  value={char.oc_id}
                  onChange={(e) => updateCharacter(index, 'oc_id', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
                >
                  <option value="">Select character</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={char.role || ''}
                  onChange={(e) => updateCharacter(index, 'role', e.target.value)}
                  placeholder="Role (optional)"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => removeCharacter(index)}
                  className="px-3 py-2 bg-red-700 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {watchedWorldId
              ? 'No characters available in this world. Add characters first.'
              : 'Select a world to add characters.'}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <FormButton
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {event ? 'Update Event' : 'Create Event'}
        </FormButton>
        <FormButton
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </FormButton>
      </div>
    </form>
  );
}

