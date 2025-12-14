'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { World, WorldFieldDefinitions } from '@/types/oc';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { slugify } from '@/lib/utils/slugify';
import { WorldFieldsSection } from './WorldFieldsSection';
import { getWorldFieldDefinitions } from '@/lib/fields/worldFields';
import { FormSection } from './forms/FormSection';
import { FormLabel } from './forms/FormLabel';
import { FormInput } from './forms/FormInput';
import { FormSelect } from './forms/FormSelect';
import { FormTextarea } from './forms/FormTextarea';
import { FormButton } from './forms/FormButton';
import { FormMessage } from './forms/FormMessage';
import { StoryAliasManager } from './StoryAliasManager';

// Helper to normalize empty strings to undefined for optional fields
const optionalString = z.preprocess(
  (val) => (val === '' || val === null ? undefined : val),
  z.string().optional()
);

const worldSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  series_type: z.enum(['canon', 'original']),
  summary: z.string().min(1, 'Summary is required'),
  description_markdown: optionalString,
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  accent_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
  header_image_url: z.union([
    z.string().url(),
    z.literal(''),
  ]).optional(),
  icon_url: z.union([
    z.string().url(),
    z.literal(''),
  ]).optional(),
  setting_img: z.union([
    z.string().url(),
    z.literal(''),
  ]).optional(),
  banner_image: z.union([
    z.string().url(),
    z.literal(''),
  ]).optional(),
  is_public: z.boolean(),
  // Additional world fields
  genre: optionalString,
  synopsis: optionalString,
  setting: optionalString,
  lore: optionalString,
  the_world_society: optionalString,
  culture: optionalString,
  politics: optionalString,
  technology: optionalString,
  environment: optionalString,
  races_species: optionalString,
  power_systems: optionalString,
  religion: optionalString,
  government: optionalString,
  important_factions: optionalString,
  notable_figures: optionalString,
  languages: optionalString,
  trade_economy: optionalString,
  travel_transport: optionalString,
  themes: optionalString,
  inspirations: optionalString,
  current_era_status: optionalString,
  notes: optionalString,
  // World field system (definitions - read-only in this form)
  world_fields: z.any().optional(),
});

type WorldFormData = z.infer<typeof worldSchema>;

interface WorldFormProps {
  world?: World;
}

export function WorldForm({ world }: WorldFormProps) {
  const router = useRouter();
  // Get field definitions from world for display
  const fieldDefinitions = getWorldFieldDefinitions(world || null);
  
  const { isSubmitting, error, success, submit } = useFormSubmission<WorldFormData>({
    apiRoute: '/api/admin/worlds',
    entity: world,
    successRoute: '/admin/worlds',
    showSuccessMessage: true,
    successMessage: 'World saved successfully!',
    transformData: (data) => {
      // Clean up empty strings and convert to null for optional fields
      return {
        name: data.name,
        slug: data.slug,
        series_type: data.series_type,
        summary: data.summary,
        primary_color: data.primary_color,
        accent_color: data.accent_color,
        is_public: data.is_public,
        header_image_url: data.header_image_url || null,
        icon_url: data.icon_url || null,
        setting_img: data.setting_img || null,
        banner_image: data.banner_image || null,
        description_markdown: data.description_markdown || null,
        genre: data.genre || null,
        synopsis: data.synopsis || null,
        setting: data.setting || null,
        lore: data.lore || null,
        the_world_society: data.the_world_society || null,
        culture: data.culture || null,
        politics: data.politics || null,
        technology: data.technology || null,
        environment: data.environment || null,
        races_species: data.races_species || null,
        power_systems: data.power_systems || null,
        religion: data.religion || null,
        government: data.government || null,
        important_factions: data.important_factions || null,
        notable_figures: data.notable_figures || null,
        languages: data.languages || null,
        trade_economy: data.trade_economy || null,
        travel_transport: data.travel_transport || null,
        themes: data.themes || null,
        inspirations: data.inspirations || null,
        current_era_status: data.current_era_status || null,
        notes: data.notes || null,
        world_fields: world?.world_fields || null,
      };
    },
  });

  // Helper to convert null to empty string for form defaults
  const getDefaultValue = (value: string | null | undefined): string => {
    return value ?? '';
  };

  const methods = useForm<WorldFormData>({
    resolver: zodResolver(worldSchema),
    defaultValues: world ? {
      name: world.name || '',
      slug: world.slug || '',
      series_type: world.series_type || 'original',
      summary: world.summary || '',
      description_markdown: getDefaultValue(world.description_markdown),
      primary_color: world.primary_color || '#64748b',
      accent_color: world.accent_color || '#94a3b8',
      header_image_url: getDefaultValue(world.header_image_url),
      icon_url: getDefaultValue(world.icon_url),
      setting_img: getDefaultValue(world.setting_img),
      banner_image: getDefaultValue(world.banner_image),
      is_public: world.is_public ?? true,
      genre: getDefaultValue(world.genre),
      synopsis: getDefaultValue(world.synopsis),
      setting: getDefaultValue(world.setting),
      lore: getDefaultValue(world.lore),
      the_world_society: getDefaultValue(world.the_world_society),
      culture: getDefaultValue(world.culture),
      politics: getDefaultValue(world.politics),
      technology: getDefaultValue(world.technology),
      environment: getDefaultValue(world.environment),
      races_species: getDefaultValue(world.races_species),
      power_systems: getDefaultValue(world.power_systems),
      religion: getDefaultValue(world.religion),
      government: getDefaultValue(world.government),
      important_factions: getDefaultValue(world.important_factions),
      notable_figures: getDefaultValue(world.notable_figures),
      languages: getDefaultValue(world.languages),
      trade_economy: getDefaultValue(world.trade_economy),
      travel_transport: getDefaultValue(world.travel_transport),
      themes: getDefaultValue(world.themes),
      inspirations: getDefaultValue(world.inspirations),
      current_era_status: getDefaultValue(world.current_era_status),
      notes: getDefaultValue(world.notes),
      world_fields: world.world_fields || undefined,
    } : {
      name: '',
      slug: '',
      series_type: 'original',
      summary: '',
      description_markdown: '',
      primary_color: '#64748b',
      accent_color: '#94a3b8',
      header_image_url: '',
      icon_url: '',
      setting_img: '',
      banner_image: '',
      is_public: true,
      genre: '',
      synopsis: '',
      setting: '',
      lore: '',
      the_world_society: '',
      culture: '',
      politics: '',
      technology: '',
      environment: '',
      races_species: '',
      power_systems: '',
      religion: '',
      government: '',
      important_factions: '',
      notable_figures: '',
      languages: '',
      trade_economy: '',
      travel_transport: '',
      themes: '',
      inspirations: '',
      current_era_status: '',
      notes: '',
      world_fields: undefined,
    },
  });

  const { register, handleSubmit, formState: { errors, isDirty }, setValue, watch, trigger } = methods;
  const nameValue = watch('name');

  useEffect(() => {
    if (!world && nameValue) {
      const slug = slugify(nameValue);
      setValue('slug', slug);
    }
  }, [nameValue, world, setValue]);


  // Unsaved changes protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = async (data: WorldFormData) => {
    await submit(data);
  };

  const onError = (errors: any) => {
    console.error('Form validation errors:', errors);
  };

  const handleCancel = useCallback(() => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to leave?')) {
        return;
      }
    }
    router.back();
  }, [isDirty, router]);


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 w-full">
      {error && <FormMessage type="error" message={error} />}
      {Object.keys(errors).length > 0 && (
        <FormMessage
          type="warning"
          message={`Please fix the following errors: ${Object.entries(errors).map(([field, error]) => {
            const errorMessage = error && typeof error === 'object' && 'message' in error 
              ? String(error.message) 
              : 'Invalid value';
            return `${field}: ${errorMessage}`;
          }).join(', ')}`}
        />
      )}
      {success && <FormMessage type="success" message="World saved successfully!" />}

      <FormSection title="Core Identity" icon="core-identity" accentColor="core-identity" defaultOpen={true}>
        <div>
          <FormLabel htmlFor="name" required>
            Name
          </FormLabel>
          <FormInput
            {...register('name')}
            error={errors.name?.message}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="slug" required>
            Slug
          </FormLabel>
          <FormInput
            {...register('slug')}
            error={errors.slug?.message}
            disabled={isSubmitting || !!world}
            helpText={world ? 'Slug cannot be changed after creation' : undefined}
          />
        </div>

        <div>
          <FormLabel htmlFor="series_type" required>
            Series Type
          </FormLabel>
          <FormSelect
            {...register('series_type')}
            options={[
              { value: 'canon', label: 'Canon' },
              { value: 'original', label: 'Original' },
            ]}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="summary" required>
            Summary
          </FormLabel>
          <FormTextarea
            {...register('summary')}
            rows={3}
            error={errors.summary?.message}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="description_markdown">
            Description (Markdown)
          </FormLabel>
          <FormTextarea
            {...register('description_markdown')}
            rows={10}
            markdown
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Visual Identity" icon="visual-identity" accentColor="visual-identity" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="primary_color" required>
              Primary Color
            </FormLabel>
            <input
              type="color"
              {...register('primary_color')}
              disabled={isSubmitting}
              className="w-full h-12 border border-gray-500/60 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <FormInput
              type="text"
              {...register('primary_color')}
              disabled={isSubmitting}
              className="mt-2"
            />
          </div>

          <div>
            <FormLabel htmlFor="accent_color" required>
              Accent Color
            </FormLabel>
            <input
              type="color"
              {...register('accent_color')}
              disabled={isSubmitting}
              className="w-full h-12 border border-gray-500/60 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <FormInput
              type="text"
              {...register('accent_color')}
              disabled={isSubmitting}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <FormLabel htmlFor="header_image_url">
            Header Image URL
          </FormLabel>
          <FormInput
            type="url"
            {...register('header_image_url')}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="icon_url">
            Icon URL
          </FormLabel>
          <FormInput
            type="url"
            {...register('icon_url')}
            placeholder="https://example.com/icon.png"
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Overview" icon="overview" accentColor="overview" defaultOpen={false}>
        <div>
          <FormLabel htmlFor="genre">
            Genre
          </FormLabel>
          <FormInput
            {...register('genre')}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="synopsis">
            Synopsis
          </FormLabel>
          <FormTextarea
            {...register('synopsis')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="setting">
            Setting
          </FormLabel>
          <FormTextarea
            {...register('setting')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="setting_img">
            Setting Image URL
          </FormLabel>
          <FormInput
            type="url"
            {...register('setting_img')}
            placeholder="https://example.com/setting.jpg"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="banner_image">
            Banner Image URL
          </FormLabel>
          <FormInput
            type="url"
            {...register('banner_image')}
            placeholder="https://example.com/banner.jpg"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="lore">
            Lore
          </FormLabel>
          <FormTextarea
            {...register('lore')}
            rows={5}
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Society & Culture" icon="society-culture" accentColor="society-culture" defaultOpen={false}>
        <div>
          <FormLabel htmlFor="the_world_society">
            The World Society
          </FormLabel>
          <FormTextarea
            {...register('the_world_society')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="culture">
            Culture
          </FormLabel>
          <FormTextarea
            {...register('culture')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="politics">
            Politics
          </FormLabel>
          <FormTextarea
            {...register('politics')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="technology">
            Technology
          </FormLabel>
          <FormTextarea
            {...register('technology')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="environment">
            Environment
          </FormLabel>
          <FormTextarea
            {...register('environment')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="World Building" icon="world-building" accentColor="world-building" defaultOpen={false}>
        <div>
          <FormLabel htmlFor="races_species">
            Races/Species
          </FormLabel>
          <FormTextarea
            {...register('races_species')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="power_systems">
            Power Systems
          </FormLabel>
          <FormTextarea
            {...register('power_systems')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="religion">
            Religion
          </FormLabel>
          <FormTextarea
            {...register('religion')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="government">
            Government
          </FormLabel>
          <FormTextarea
            {...register('government')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="important_factions">
            Important Factions
          </FormLabel>
          <FormTextarea
            {...register('important_factions')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="notable_figures">
            Notable Figures
          </FormLabel>
          <FormTextarea
            {...register('notable_figures')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Economy & Systems" icon="economy-systems" accentColor="economy-systems" defaultOpen={false}>
        <div>
          <FormLabel htmlFor="languages">
            Languages
          </FormLabel>
          <FormInput
            {...register('languages')}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="trade_economy">
            Trade & Economy
          </FormLabel>
          <FormTextarea
            {...register('trade_economy')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="travel_transport">
            Travel & Transport
          </FormLabel>
          <FormTextarea
            {...register('travel_transport')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Additional Information" icon="additional-information" accentColor="additional-information" defaultOpen={false}>
        <div>
          <FormLabel htmlFor="themes">
            Themes
          </FormLabel>
          <FormTextarea
            {...register('themes')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="inspirations">
            Inspirations
          </FormLabel>
          <FormTextarea
            {...register('inspirations')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="current_era_status">
            Current Era Status
          </FormLabel>
          <FormTextarea
            {...register('current_era_status')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <FormLabel htmlFor="notes">
            Notes
          </FormLabel>
          <FormTextarea
            {...register('notes')}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </FormSection>

      <FormSection title="Settings" icon="settings" accentColor="settings" defaultOpen={true}>
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_public')}
            disabled={isSubmitting}
            className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-500 rounded bg-gray-800/60 disabled:opacity-50 cursor-pointer"
          />
          <label className="ml-2 block text-sm text-gray-200">
            Public (visible to everyone)
          </label>
        </div>
      </FormSection>

      {world && (
        <FormSection title="Story Aliases" icon="story-aliases" accentColor="story-aliases" defaultOpen={false}>
          <StoryAliasManager
            worldId={world.id}
            worldIsCanon={world.series_type === 'canon'}
          />
        </FormSection>
      )}

      {fieldDefinitions.length > 0 && (
        <WorldFieldsSection
          fieldDefinitions={fieldDefinitions}
          fieldPrefix="modular_fields"
          disabled={isSubmitting}
          title="World Fields"
          defaultOpen={false}
          accentColor="content"
        />
      )}


      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t-2 border-gray-600/50 bg-gray-800/30 rounded-lg p-5">
        <div className="text-sm text-gray-200">
          {isDirty && !isSubmitting && (
            <span className="flex items-center text-amber-400">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              You have unsaved changes
            </span>
          )}
          {isSubmitting && (
            <span className="flex items-center text-purple-300">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <FormButton
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </FormButton>
          <FormButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {world ? 'Update World' : 'Create World'}
          </FormButton>
        </div>
      </div>
      </form>
    </FormProvider>
  );
}
