'use client';

import { useState } from 'react';
import type { FieldSet, WorldFieldDefinition, WorldFieldType } from '@/types/oc';
import { validateFieldKey, isBaseWorldFieldKey, isBaseFieldKey } from '@/lib/fields/worldFields';

interface FieldSetManagerProps {
  fieldSets: FieldSet[];
  onChange: (fieldSets: FieldSet[]) => void;
  isWorld?: boolean;
  disabled?: boolean;
}

/**
 * Component for managing field sets (add/remove field sets and fields)
 */
export function FieldSetManager({
  fieldSets,
  onChange,
  isWorld = false,
  disabled = false,
}: FieldSetManagerProps) {
  const [expandedSets, setExpandedSets] = useState<Set<string>>(new Set());

  const toggleSet = (setId: string) => {
    const newExpanded = new Set(expandedSets);
    if (newExpanded.has(setId)) {
      newExpanded.delete(setId);
    } else {
      newExpanded.add(setId);
    }
    setExpandedSets(newExpanded);
  };

  const addFieldSet = () => {
    const newSet: FieldSet = {
      id: `set-${Date.now()}`,
      name: 'New Field Set',
      description: '',
      fields: [],
    };
    onChange([...fieldSets, newSet]);
    setExpandedSets(new Set([...expandedSets, newSet.id]));
  };

  const removeFieldSet = (setId: string) => {
    onChange(fieldSets.filter((set) => set.id !== setId));
    const newExpanded = new Set(expandedSets);
    newExpanded.delete(setId);
    setExpandedSets(newExpanded);
  };

  const updateFieldSet = (setId: string, updates: Partial<FieldSet>) => {
    onChange(
      fieldSets.map((set) => (set.id === setId ? { ...set, ...updates } : set))
    );
  };

  const addField = (setId: string) => {
    const newField: WorldFieldDefinition = {
      key: '',
      label: '',
      type: 'text',
      description: '',
      required: false,
    };
    updateFieldSet(setId, {
      fields: [...(fieldSets.find((s) => s.id === setId)?.fields || []), newField],
    });
  };

  const removeField = (setId: string, fieldIndex: number) => {
    const set = fieldSets.find((s) => s.id === setId);
    if (!set) return;
    updateFieldSet(setId, {
      fields: set.fields.filter((_, i) => i !== fieldIndex),
    });
  };

  const updateField = (setId: string, fieldIndex: number, updates: Partial<WorldFieldDefinition>) => {
    const set = fieldSets.find((s) => s.id === setId);
    if (!set) return;
    const newFields = [...set.fields];
    newFields[fieldIndex] = { ...newFields[fieldIndex], ...updates };
    updateFieldSet(setId, { fields: newFields });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">Field Sets</h3>
        <button
          type="button"
          onClick={addFieldSet}
          disabled={disabled}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          Add Field Set
        </button>
      </div>

      {fieldSets.length === 0 && (
        <div className="text-gray-400 text-sm py-4 text-center">
          No field sets defined. Add one to get started.
        </div>
      )}

      {fieldSets.map((set) => {
        const isExpanded = expandedSets.has(set.id);
        const fieldKeyValidation = set.fields.map((field) =>
          field.key ? validateFieldKey(field.key, isWorld) : { valid: true }
        );

        return (
          <div
            key={set.id}
            className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800/50"
          >
            <div className="bg-gray-700/50 px-4 py-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => toggleSet(set.id)}
                className="flex-1 text-left flex items-center gap-2"
              >
                <svg
                  className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="font-medium text-gray-200">{set.name || 'Unnamed Set'}</span>
                {set.description && (
                  <span className="text-sm text-gray-400">- {set.description}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => removeFieldSet(set.id)}
                disabled={disabled}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
              >
                Remove Set
              </button>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Set Name *
                  </label>
                  <input
                    type="text"
                    value={set.name}
                    onChange={(e) => updateFieldSet(set.id, { name: e.target.value })}
                    disabled={disabled}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={set.description || ''}
                    onChange={(e) => updateFieldSet(set.id, { description: e.target.value })}
                    disabled={disabled}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">Fields</label>
                    <button
                      type="button"
                      onClick={() => addField(set.id)}
                      disabled={disabled}
                      className="px-3 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
                    >
                      Add Field
                    </button>
                  </div>

                  {set.fields.length === 0 && (
                    <div className="text-gray-400 text-sm py-2">No fields in this set.</div>
                  )}

                  <div className="space-y-3">
                    {set.fields.map((field, fieldIndex) => {
                      const validation = fieldKeyValidation[fieldIndex];
                      return (
                        <div
                          key={fieldIndex}
                          className="p-3 border border-gray-600 rounded bg-gray-700/30 space-y-2"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Field Key *
                              </label>
                              <input
                                type="text"
                                value={field.key}
                                onChange={(e) =>
                                  updateField(set.id, fieldIndex, { key: e.target.value })
                                }
                                disabled={disabled}
                                placeholder="e.g., chakra_nature"
                                className={`w-full px-2 py-1 text-sm bg-gray-700 border rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                                  field.key && !validation.valid
                                    ? 'border-red-500'
                                    : 'border-gray-600'
                                }`}
                              />
                              {field.key && !validation.valid && (
                                <p className="text-xs text-red-400 mt-1">{validation.error}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Field Label *
                              </label>
                              <input
                                type="text"
                                value={field.label}
                                onChange={(e) =>
                                  updateField(set.id, fieldIndex, { label: e.target.value })
                                }
                                disabled={disabled}
                                placeholder="e.g., Chakra Nature"
                                className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Type *
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) =>
                                  updateField(set.id, fieldIndex, {
                                    type: e.target.value as WorldFieldType,
                                  })
                                }
                                disabled={disabled}
                                className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                              >
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="array">Array</option>
                              </select>
                            </div>

                            <div className="flex items-end">
                              <label className="flex items-center gap-2 text-xs text-gray-400">
                                <input
                                  type="checkbox"
                                  checked={field.required || false}
                                  onChange={(e) =>
                                    updateField(set.id, fieldIndex, { required: e.target.checked })
                                  }
                                  disabled={disabled}
                                  className="rounded"
                                />
                                Required
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Description (optional)
                            </label>
                            <input
                              type="text"
                              value={field.description || ''}
                              onChange={(e) =>
                                updateField(set.id, fieldIndex, { description: e.target.value })
                              }
                              disabled={disabled}
                              placeholder="Help text for this field"
                              className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeField(set.id, fieldIndex)}
                            disabled={disabled}
                            className="w-full px-2 py-1 bg-red-500/50 text-red-200 rounded hover:bg-red-500/70 disabled:opacity-50 text-sm"
                          >
                            Remove Field
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


