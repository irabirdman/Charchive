import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { checkAuth } from '@/lib/auth/require-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Query all options from database
    const { data, error } = await supabase
      .from('dropdown_options')
      .select('field, option')
      .order('field', { ascending: true })
      .order('option', { ascending: true });

    if (error) {
      console.error('Error fetching dropdown options from database:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dropdown options' },
        { status: 500 }
      );
    }

    // Group options by field
    const options: Record<string, string[]> = {};
    
    if (data) {
      for (const row of data) {
        if (!options[row.field]) {
          options[row.field] = [];
        }
        options[row.field].push(row.option);
      }
    }

    return NextResponse.json({ options });
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dropdown options' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { options } = await request.json();

    if (!options || typeof options !== 'object') {
      console.error('Invalid options data received');
      return NextResponse.json(
        { error: 'Invalid options data' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Validate field names (basic validation)
    const validFields = [
      'pronouns', 'gender_identity', 'romantic', 'sexual', 'relationship_type',
      'sex', 'accent', 'nationality', 'ethnicity_race', 'species',
      'eye_color', 'hair_color', 'skin_tone', 'occupation',
      'mbti', 'moral', 'positive_traits', 'neutral_traits', 'negative_traits', 'gender'
    ];

    const invalidFields = Object.keys(options).filter(field => !validFields.includes(field));
    if (invalidFields.length > 0) {
      console.error('Invalid field names:', invalidFields);
      return NextResponse.json(
        { error: `Invalid field names: ${invalidFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get current options from database for comparison
    const { data: currentData, error: fetchError } = await supabase
      .from('dropdown_options')
      .select('field, option');

    if (fetchError) {
      console.error('Error fetching current options:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch current options' },
        { status: 500 }
      );
    }

    // Group current options by field
    const currentOptions: Record<string, Set<string>> = {};
    if (currentData) {
      for (const row of currentData) {
        if (!currentOptions[row.field]) {
          currentOptions[row.field] = new Set();
        }
        currentOptions[row.field].add(row.option);
      }
    }

    // Find fields that have changed
    const fieldsToUpdate: Record<string, string[]> = {};

    Object.entries(options).forEach(([field, newValues]) => {
      if (!Array.isArray(newValues)) {
        console.warn(`Skipping field ${field}: not an array`);
        return;
      }

      const currentValues = currentOptions[field] || new Set();
      const newSet = new Set(newValues);
      
      // Check if arrays are different
      const isDifferent = 
        currentValues.size !== newSet.size ||
        newValues.some(val => !currentValues.has(val)) ||
        Array.from(currentValues).some(val => !newSet.has(val));

      if (isDifferent) {
        fieldsToUpdate[field] = newValues;
      }
    });

    if (Object.keys(fieldsToUpdate).length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No changes detected',
        updatedFields: [],
      });
    }

    console.log(`Updating ${Object.keys(fieldsToUpdate).length} fields:`, Object.keys(fieldsToUpdate));

    // Update each field: delete old options, insert new ones
    const updatedFields: string[] = [];
    const errors: string[] = [];

    for (const [field, newOptions] of Object.entries(fieldsToUpdate)) {
      try {
        // Delete existing options for this field
        const { error: deleteError } = await supabase
          .from('dropdown_options')
          .delete()
          .eq('field', field);

        if (deleteError) {
          console.error(`Error deleting options for field ${field}:`, deleteError);
          errors.push(`Failed to delete options for ${field}`);
          continue;
        }

        // Insert new options
        if (newOptions.length > 0) {
          const insertData = newOptions.map(option => ({
            field,
            option: option.trim(),
            updated_at: new Date().toISOString(),
          })).filter(item => item.option.length > 0); // Filter out empty options

          if (insertData.length > 0) {
            const { error: insertError } = await supabase
              .from('dropdown_options')
              .insert(insertData);

            if (insertError) {
              console.error(`Error inserting options for field ${field}:`, insertError);
              errors.push(`Failed to insert options for ${field}`);
              continue;
            }
          }
        }

        updatedFields.push(field);
        console.log(`Successfully updated field ${field} with ${newOptions.length} options`);
      } catch (error) {
        console.error(`Error updating field ${field}:`, error);
        errors.push(`Failed to update ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Some fields failed to update',
          details: errors,
          updatedFields,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Options saved successfully for ${updatedFields.length} field(s)`,
      updatedFields,
    });
  } catch (error) {
    console.error('Error saving dropdown options:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save dropdown options';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
