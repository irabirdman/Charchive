'use client';

import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Timeline } from '@/types/oc';
import { useWorlds } from '@/lib/hooks/useWorlds';
import { useFormSubmission } from '@/lib/hooks/useFormSubmission';
import { FormSection } from './forms/FormSection';
import { FormLabel } from './forms/FormLabel';
import { FormInput } from './forms/FormInput';
import { FormSelect } from './forms/FormSelect';
import { FormTextarea } from './forms/FormTextarea';
import { FormButton } from './forms/FormButton';
import { FormMessage } from './forms/FormMessage';

const timelineSchema = z.object({
  world_id: z.string().uuid('Invalid world'),
  name: z.string().min(1, 'Name is required'),
  description_markdown: z.string().optional(),
});

type TimelineFormData = z.infer<typeof timelineSchema>;

interface TimelineFormProps {
  timeline?: Timeline;
}

export function TimelineForm({ timeline }: TimelineFormProps) {
  const router = useRouter();
  const { worlds } = useWorlds();
  const { isSubmitting, error, success, submit } = useFormSubmission<TimelineFormData>({
    apiRoute: '/api/admin/timelines',
    entity: timeline,
    successRoute: '/admin/timelines',
    showSuccessMessage: true,
    successMessage: 'Timeline saved successfully!',
  });

  const methods = useForm<TimelineFormData>({
    resolver: zodResolver(timelineSchema),
    defaultValues: timeline || {
      world_id: '',
      name: '',
      description_markdown: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  const onSubmit = async (data: TimelineFormData) => {
    await submit(data);
  };

  const worldOptions = worlds.map((world) => ({
    value: world.id,
    label: world.name,
  }));

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <FormMessage type="error" message={error} />}
        {success && <FormMessage type="success" message="Timeline saved successfully!" />}

        <FormSection title="Timeline Information" icon="timeline" accentColor="timeline" defaultOpen={true}>
          <div>
            <FormLabel htmlFor="world_id" required>
              World
            </FormLabel>
            <FormSelect
              {...register('world_id')}
              options={worldOptions}
              placeholder="Select a world"
              error={errors.world_id?.message}
              disabled={isSubmitting}
            />
          </div>

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

        <div className="flex gap-4 pt-4">
          <FormButton
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {timeline ? 'Update Timeline' : 'Create Timeline'}
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
    </FormProvider>
  );
}
