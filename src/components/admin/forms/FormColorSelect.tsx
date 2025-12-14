'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { UseFormRegisterReturn, UseFormSetValue, useFormContext } from 'react-hook-form';
import { csvOptions } from '@/lib/utils/csvOptionsData';
import { getColorHex, hasColorHex, colorHexMap } from '@/lib/utils/colorHexMap';

interface FormColorSelectProps {
  register: UseFormRegisterReturn;
  setValue: UseFormSetValue<any>;
  error?: string;
  helpText?: string;
  optionsSource?: keyof typeof csvOptions;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  name: string;
}

// Helper function to check if a string is a valid hex color
function isValidHexColor(str: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
}

// Helper function to calculate relative luminance (brightness) of a hex color
// Returns a value between 0 (dark) and 1 (light)
function getLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle 3-digit hex
  const r = cleanHex.length === 3 
    ? parseInt(cleanHex[0] + cleanHex[0], 16) 
    : parseInt(cleanHex.substring(0, 2), 16);
  const g = cleanHex.length === 3 
    ? parseInt(cleanHex[1] + cleanHex[1], 16) 
    : parseInt(cleanHex.substring(2, 4), 16);
  const b = cleanHex.length === 3 
    ? parseInt(cleanHex[2] + cleanHex[2], 16) 
    : parseInt(cleanHex.substring(4, 6), 16);
  
  // Calculate relative luminance using WCAG formula
  const [rs, gs, bs] = [r, g, b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper function to determine if text should be dark or light based on background
function getTextColor(hex: string): string {
  if (!isValidHexColor(hex)) return 'text-gray-50';
  const luminance = getLuminance(hex);
  // If background is light (luminance > 0.5), use dark text; otherwise use light text
  return luminance > 0.5 ? 'text-gray-900' : 'text-gray-50';
}

export function FormColorSelect({
  register,
  setValue,
  error,
  helpText,
  optionsSource,
  options,
  placeholder = 'Select or enter color',
  disabled,
  name,
}: FormColorSelectProps) {
  const { watch } = useFormContext();
  const [inputValue, setInputValue] = useState('');
  const [selectedHex, setSelectedHex] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [originalColorName, setOriginalColorName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Watch the current value from the form
  const currentValue = watch(name);

  // Get options ONLY from colorHexMap (colors with hex values)
  // Filters by field type: eye_color/hair_color get semicolon variants, skin_tone gets non-semicolon entries
  const selectOptions = useMemo(() => {
    if (options) {
      return options;
    }
    
    // Only include colors from colorHexMap
    const colorOptions: string[] = [];
    
    Object.keys(colorHexMap).forEach((colorName) => {
      if (name === 'eye_color' || name === 'hair_color') {
        // For eye/hair colors, include entries with semicolons (e.g., "Red; Dark", "Blue; Cobalt")
        if (colorName.includes(';')) {
          colorOptions.push(colorName);
        }
      } else if (name === 'skin_tone') {
        // For skin tones, include entries without semicolons (skin tone entries don't have semicolons)
        if (!colorName.includes(';')) {
          colorOptions.push(colorName);
        }
      }
    });
    
    // Convert to array, sort, and map to option format
    return colorOptions
      .sort()
      .map((value) => ({
        value,
        label: value,
      }));
  }, [options, name]);

  // Initialize input value from form
  useEffect(() => {
    const value = currentValue || '';
    
    // Check if value is in "Color Name|#hex" format
    if (value.includes('|')) {
      const [colorName, hex] = value.split('|');
      if (colorName && hex && isValidHexColor(hex.trim())) {
        setInputValue(colorName.trim());
        setSelectedHex(hex.trim());
        setOriginalColorName(colorName.trim());
        return;
      }
    }
    
    // Check if value is in "#hex Color Name" format (hex at beginning)
    const hexAtStartMatch = value.match(/^(#[0-9A-Fa-f]{6})\s+(.+)$/i);
    if (hexAtStartMatch) {
      const hex = hexAtStartMatch[1];
      const colorName = hexAtStartMatch[2].trim();
      setInputValue(colorName);
      setSelectedHex(hex);
      setOriginalColorName(colorName);
      return;
    }
    
    setInputValue(value);
    
    // If current value is a hex color, set it
    if (isValidHexColor(value)) {
      setSelectedHex(value);
      setOriginalColorName(''); // Clear original name if it's a hex
    } else if (value && hasColorHex(value)) {
      // If it's a color name, set both the name and its hex
      const hex = getColorHex(value);
      if (hex) {
        setSelectedHex(hex);
        setOriginalColorName(value);
      } else {
        setSelectedHex('');
        setOriginalColorName(value);
      }
    } else {
      // It's a custom text value (not a recognized color name)
      setSelectedHex('');
      setOriginalColorName('');
    }
  }, [currentValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setOriginalColorName(value);
    
    // If it's a recognized color name, auto-fill the hex
    if (value && hasColorHex(value)) {
      const hex = getColorHex(value);
      if (hex) {
        setSelectedHex(hex);
        // Store as "Color Name|#hex" format to save hex code with the color name
        setValue(name, `${value}|${hex}`, { shouldValidate: true });
      } else {
        setSelectedHex('');
        setValue(name, value, { shouldValidate: true });
      }
    } else {
      // Not a recognized color name, just set the value
      setSelectedHex('');
      setValue(name, value, { shouldValidate: true });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If it's a valid hex color, update hex and clear original color name
    if (isValidHexColor(value)) {
      setSelectedHex(value);
      setOriginalColorName('');
      setValue(name, value, { shouldValidate: true });
    } else if (hasColorHex(value)) {
      // If it's a recognized color name, set both name and hex
      const hex = getColorHex(value);
      if (hex) {
        setSelectedHex(hex);
        setOriginalColorName(value);
      } else {
        setSelectedHex('');
        setOriginalColorName(value);
      }
      setValue(name, value, { shouldValidate: true });
    } else {
      // Custom text value
      setSelectedHex('');
      setOriginalColorName('');
      setValue(name, value, { shouldValidate: true });
    }
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setSelectedHex(hex);
    // If we have an original color name, keep it in the form; otherwise store the hex
    if (originalColorName) {
      // Store as "Color Name|#hex" format to preserve both
      setInputValue(originalColorName);
      setValue(name, `${originalColorName}|${hex}`, { shouldValidate: true });
    } else {
      // No original color name, store the hex
      setInputValue(hex);
      setValue(name, hex, { shouldValidate: true });
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Add # if user types without it
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    
    setSelectedHex(value);
    
    // If we have an original color name, keep it; otherwise store the hex
    if (originalColorName && isValidHexColor(value)) {
      // Store as "Color Name|#hex" format to preserve both
      setInputValue(originalColorName);
      setValue(name, `${originalColorName}|${value}`, { shouldValidate: true });
    } else {
      // No original color name, store the hex
      setInputValue(value);
      if (isValidHexColor(value)) {
        setValue(name, value, { shouldValidate: true });
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get hex color for an option
  const getOptionHex = (optionValue: string): string | null => {
    return getColorHex(optionValue) || (isValidHexColor(optionValue) ? optionValue : null);
  };

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return selectOptions;
    const query = searchQuery.toLowerCase();
    return selectOptions.filter(option => {
      const optionHex = getColorHex(option.value) || (isValidHexColor(option.value) ? option.value : null);
      return (
        option.label.toLowerCase().includes(query) ||
        (optionHex && optionHex.toLowerCase().includes(query))
      );
    });
  }, [selectOptions, searchQuery]);

  const baseClasses = 'w-full px-4 py-2.5 bg-gray-900/60 border border-gray-500/60 rounded-lg text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-2" ref={containerRef}>
      {/* Custom dropdown with color swatches */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={disabled}
          className={`${baseClasses} appearance-none pr-10 text-left flex items-center justify-between`}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {originalColorName || inputValue ? (
              <>
                {(() => {
                  const displayHex = selectedHex || getOptionHex(originalColorName || inputValue);
                  if (displayHex && isValidHexColor(displayHex)) {
                    return (
                      <>
                        <div 
                          className="w-5 h-5 rounded border-2 border-gray-600 flex-shrink-0"
                          style={{ backgroundColor: displayHex }}
                        />
                        <span className="truncate">{originalColorName || inputValue}</span>
                      </>
                    );
                  }
                  return <span className="truncate">{originalColorName || inputValue}</span>;
                })()}
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        
        {/* Dropdown menu with color swatches */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg flex flex-col max-h-96">
            {/* Search input */}
            <div className="p-2 border-b border-gray-700">
              <input
                type="text"
                placeholder="Search colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 bg-gray-900/60 border border-gray-500/60 rounded text-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500/50"
                autoFocus
              />
            </div>
            
            {/* Options list */}
            <div className="overflow-auto flex-1">
              {filteredOptions.length > 0 ? (
                <div className="py-1">
                  {filteredOptions.map((option) => {
                  const optionHex = getOptionHex(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleSelectChange({ target: { value: option.value } } as React.ChangeEvent<HTMLSelectElement>);
                        setShowDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-700 transition-colors text-gray-200"
                    >
                      {optionHex && isValidHexColor(optionHex) ? (
                        <>
                          <div 
                            className="w-6 h-6 rounded border-2 border-gray-500 flex-shrink-0"
                            style={{ backgroundColor: optionHex }}
                          />
                          <span className="flex-1">{option.label}</span>
                          <span className="text-xs text-gray-400 font-mono flex-shrink-0">{optionHex}</span>
                        </>
                      ) : (
                        <span className="flex-1">{option.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-400">
                  {searchQuery ? 'No colors match your search' : 'No options available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom value input / Hex code input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={selectedHex && isValidHexColor(selectedHex) ? selectedHex : (originalColorName || inputValue)}
          onChange={handleInputChange}
          placeholder="Or enter custom color / hex code (e.g., #FF5733)"
          disabled={disabled}
          style={{
            backgroundColor: selectedHex && isValidHexColor(selectedHex) ? selectedHex : undefined,
          }}
          className={`${baseClasses} flex-1 ${selectedHex && isValidHexColor(selectedHex) ? getTextColor(selectedHex) + ' font-mono' : ''}`}
        />
        {/* Color picker button */}
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          disabled={disabled}
          className="px-4 py-2.5 bg-gray-800/60 border border-gray-500/60 rounded-lg text-gray-50 hover:bg-gray-700/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title="Open color picker"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        </button>
      </div>

      {/* Color picker and hex input (shown when picker is open) */}
      {showColorPicker && (
        <div className="p-4 bg-gray-800/60 border border-gray-500/60 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-200 whitespace-nowrap">
              Color Picker:
            </label>
            <input
              type="color"
              value={selectedHex || '#000000'}
              onChange={handleColorPickerChange}
              disabled={disabled}
              className="h-10 w-20 cursor-pointer rounded border border-gray-500/60"
            />
            <div className="flex-1">
              <input
                type="text"
                value={selectedHex}
                onChange={handleHexInputChange}
                placeholder="#000000"
                disabled={disabled}
                className={`${baseClasses} text-sm font-mono`}
                maxLength={7}
              />
            </div>
          </div>
          {selectedHex && isValidHexColor(selectedHex) && (
            <div className="text-xs text-gray-400">
              Selected: <span className="font-mono text-gray-300">{selectedHex}</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden input for form registration */}
      <input type="hidden" {...register} />

      {error && (
        <p className="mt-1.5 text-sm text-red-400 font-medium">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1.5 text-xs text-gray-400/80">{helpText}</p>
      )}
    </div>
  );
}

