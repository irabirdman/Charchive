'use client';

import { useState, useMemo } from 'react';
import { csvOptions } from '@/lib/utils/csvOptionsData';
import { FIELD_LABELS } from '@/lib/utils/dropdownOptions';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

interface DropdownOptionsManagerProps {
  initialOptions?: Record<string, string[]>;
  initialHexCodes?: Record<string, Record<string, string>>;
}

export function DropdownOptionsManager({ initialOptions, initialHexCodes }: DropdownOptionsManagerProps) {
  const [options, setOptions] = useState<Record<string, string[]>>(
    initialOptions || csvOptions
  );
  const [hexCodes, setHexCodes] = useState<Record<string, Record<string, string>>>(
    initialHexCodes || {}
  );

  // Helper to get hex code for a color
  const getColorHex = (field: string, value: string): string | null => {
    return hexCodes[field]?.[value] || null;
  };
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, Set<string>>>({});
  const [globalSearch, setGlobalSearch] = useState('');
  const [addMessage, setAddMessage] = useState<{ field: string; message: string; type: 'success' | 'error' } | null>(null);

  const fieldLabels = FIELD_LABELS;

  const toggleField = (field: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  const handleAddOption = (field: string, value: string) => {
    if (!value.trim()) return;

    const trimmed = value.trim();
    setOptions((prev) => {
      const current = prev[field] || [];
      // Check case-insensitively to avoid duplicates
      const normalizedCurrent = current.map(v => v.toLowerCase());
      if (normalizedCurrent.includes(trimmed.toLowerCase())) {
        const fieldLabel = fieldLabels[field] || field;
        setAddMessage({ 
          field, 
          message: `"${trimmed}" already exists in ${fieldLabel}`,
          type: 'error' 
        });
        setTimeout(() => setAddMessage(null), 3000);
        return prev;
      }
      const fieldLabel = fieldLabels[field] || field;
      setAddMessage({ 
        field, 
        message: `Added "${trimmed}" to ${fieldLabel}`,
        type: 'success' 
      });
      setTimeout(() => setAddMessage(null), 3000);
      return {
        ...prev,
        [field]: [...current, trimmed].sort(),
      };
    });
  };

  const handleRemoveOption = (field: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((v) => v !== value),
    }));
    // Remove from selected items if it was selected
    setSelectedItems((prev) => {
      const fieldSelected = prev[field] || new Set();
      if (fieldSelected.has(value)) {
        const next = new Set(fieldSelected);
        next.delete(value);
        return { ...prev, [field]: next };
      }
      return prev;
    });
  };

  const handleBulkDelete = (field: string) => {
    const selected = selectedItems[field] || new Set();
    if (selected.size === 0) return;

    setOptions((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((v) => !selected.has(v)),
    }));
    setSelectedItems((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleSelectItem = (field: string, value: string) => {
    setSelectedItems((prev) => {
      const fieldSelected = prev[field] || new Set();
      const next = new Set(fieldSelected);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return { ...prev, [field]: next };
    });
  };

  const toggleSelectAll = (field: string) => {
    const filtered = getFilteredOptions(field);
    const selected = selectedItems[field] || new Set();
    const allSelected = filtered.every((v) => selected.has(v));

    setSelectedItems((prev) => {
      if (allSelected) {
        const next = new Set(selected);
        filtered.forEach((v) => next.delete(v));
        return { ...prev, [field]: next };
      } else {
        const next = new Set(selected);
        filtered.forEach((v) => next.add(v));
        return { ...prev, [field]: next };
      }
    });
  };

  const getFilteredOptions = (field: string): string[] => {
    const fieldOptions = options[field] || [];
    const searchQuery = searchQueries[field]?.toLowerCase() || '';
    const globalQuery = globalSearch.toLowerCase();

    return fieldOptions.filter((option) => {
      const matchesFieldSearch = !searchQuery || option.toLowerCase().includes(searchQuery);
      const matchesGlobalSearch = !globalQuery || 
        fieldLabels[field]?.toLowerCase().includes(globalQuery) ||
        option.toLowerCase().includes(globalQuery);
      return matchesFieldSearch && matchesGlobalSearch;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    // Log what we're about to send
    try {
      const requestBody = { options, hexCodes };
      
      const response = await fetch('/api/admin/dropdown-options', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to save options';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // If fields were updated, refresh data from server
      if (data.updatedFields && data.updatedFields.length > 0) {
        try {
          const refreshResponse = await fetch('/api/admin/dropdown-options');
          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.options) {
              setOptions(refreshData.options);
            }
            if (refreshData.hexCodes) {
              setHexCodes(refreshData.hexCodes);
            }
          }
        } catch (refreshError) {
          // Silently fail refresh - data is already saved
        }
      }
      
      setSaveMessage({ 
        type: 'success', 
        text: data.message || (data.updatedFields?.length > 0 
          ? `Options saved successfully for ${data.updatedFields.length} field(s)!` 
          : 'No changes detected - all options are already saved.')
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (error) {
      console.error('[Client] Error saving options:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save options. Please try again.';
      setSaveMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const fields = useMemo(() => {
    const allFields = Object.keys(options).sort();
    if (!globalSearch) return allFields;
    
    const query = globalSearch.toLowerCase();
    return allFields.filter((field) => {
      const label = fieldLabels[field] || field;
      return label.toLowerCase().includes(query) || 
             (options[field] || []).some((opt) => opt.toLowerCase().includes(query));
    });
  }, [options, globalSearch, fieldLabels]);

  const fieldsWithCounts = useMemo(() => {
    return fields.map((field) => ({
      field,
      count: options[field]?.length || 0,
      label: fieldLabels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    })).sort((a, b) => b.count - a.count);
  }, [fields, options, fieldLabels]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Dropdown Options Manager</h2>
          <p className="text-gray-400 mt-1">
            Manage available options for form dropdown fields across the platform.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.type === 'success'
              ? 'bg-green-900/50 border border-green-700 text-green-300'
              : 'bg-red-900/50 border border-red-700 text-red-300'
          }`}
        >
          {saveMessage.text}
        </div>
      )}

      {/* Global Search */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Search All Fields
        </label>
        <input
          type="text"
          placeholder="Search across all fields and options..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="w-full px-4 py-2 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50"
        />
      </div>

      {/* Fields List */}
      <div className="space-y-4">
        {fieldsWithCounts.map(({ field, count, label }) => {
          const isExpanded = expandedFields.has(field);
          const filteredOptions = getFilteredOptions(field);
          const selected = selectedItems[field] || new Set();
          const selectedCount = filteredOptions.filter((v) => selected.has(v)).length;
          const allSelected = filteredOptions.length > 0 && selectedCount === filteredOptions.length;
          const searchQuery = searchQueries[field] || '';

          return (
            <div
              key={field}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Field Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => toggleField(field)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'} transition-transform`} aria-hidden="true" suppressHydrationWarning></i>
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100">{label}</h3>
                    <p className="text-sm text-gray-400">
                      {count} {count === 1 ? 'option' : 'options'}
                      {searchQuery && ` • ${filteredOptions.length} shown`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isExpanded && selectedCount > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBulkDelete(field);
                      }}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete {selectedCount} Selected
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-700 p-4 space-y-4">
                  {/* Add New Option */}
                  {addMessage && addMessage.field === field && (
                    <div
                      className={`p-2 rounded-md text-sm ${
                        addMessage.type === 'success'
                          ? 'bg-green-900/50 border border-green-700 text-green-300'
                          : 'bg-red-900/50 border border-red-700 text-red-300'
                      }`}
                    >
                      {addMessage.message}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={
                        field === 'hair_color' || field === 'eye_color'
                          ? 'Add new option (e.g., "Blue; Light" or "Red; Dark")...'
                          : 'Add new option...'
                      }
                      className="flex-1 px-3 py-2 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          handleAddOption(field, input.value);
                          input.value = '';
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        handleAddOption(field, input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Search */}
                  <div>
                    <input
                      type="text"
                      placeholder={`Search ${label.toLowerCase()}...`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQueries((prev) => ({ ...prev, [field]: e.target.value }));
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50"
                    />
                  </div>

                  {/* Options Table */}
                  {filteredOptions.length > 0 ? (
                    <div className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-700">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() => toggleSelectAll(field)}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-500 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-300">
                            Select All ({selectedCount} selected)
                          </span>
                        </label>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                          <tbody className="divide-y divide-gray-700">
                            {filteredOptions.map((value, index) => {
                              const isSelected = selected.has(value);
                              return (
                                <tr
                                  key={value}
                                  className={`hover:bg-gray-700/30 transition-colors ${
                                    isSelected ? 'bg-purple-900/20' : ''
                                  }`}
                                >
                                  <td className="px-4 py-2 w-12">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleSelectItem(field, value)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="rounded border-gray-500 text-purple-600 focus:ring-purple-500"
                                    />
                                  </td>
                                  <td className="px-4 py-2 text-gray-200">
                                    {(field === 'hair_color' || field === 'eye_color' || field === 'skin_tone') ? (() => {
                                      const hexColor = getColorHex(field, value);
                                      if (hexColor) {
                                        return (
                                          <div className="flex items-center gap-3">
                                            <div
                                              className="w-6 h-6 rounded border-2 border-gray-500 flex-shrink-0"
                                              style={{ backgroundColor: hexColor }}
                                              title={hexColor}
                                            />
                                            <span className="flex-1">{value}</span>
                                            <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                                              {hexColor}
                                            </span>
                                          </div>
                                        );
                                      }
                                      return <span>{value}</span>;
                                    })() : (
                                      <span>{value}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 w-16 text-right">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveOption(field, value);
                                      }}
                                      className="text-red-400 hover:text-red-300 transition-colors px-2 py-1"
                                      title="Remove"
                                    >
                                      <i className="fas fa-times" aria-hidden="true" suppressHydrationWarning></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      {searchQuery ? 'No options match your search.' : 'No options available.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

