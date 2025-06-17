import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio';
}

interface FilterSidebarProps {
  filters: FilterSection[];
  onFilterChange: (filters: Record<string, string[]>) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  isMobile = false,
  onClose
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleFilterChange = (section: string, value: string, isChecked: boolean) => {
    setSelectedFilters(prev => {
      const updated = { ...prev };
      if (!updated[section]) updated[section] = [];
      
      if (isChecked) {
        updated[section] = [...updated[section], value];
      } else {
        updated[section] = updated[section].filter(v => v !== value);
      }
      
      if (updated[section].length === 0) {
        delete updated[section];
      }
      
      onFilterChange(updated);
      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className={`bg-white rounded-lg shadow-md ${isMobile ? 'h-full' : 'sticky top-4'}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold text-charcoal-gray">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-energetic-orange hover:text-orange-600"
            >
              Clear all
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} className="p-1">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filters.map((section, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between py-2"
            >
              <h3 className="font-medium text-charcoal-gray">{section.title}</h3>
              {expandedSections[section.title] ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {(expandedSections[section.title] !== false) && (
              <div className="mt-3 space-y-2">
                {section.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center gap-2 cursor-pointer hover:text-natural-sage"
                  >
                    <input
                      type={section.type}
                      name={section.type === 'radio' ? section.title : undefined}
                      checked={selectedFilters[section.title]?.includes(option.value) || false}
                      onChange={(e) => handleFilterChange(section.title, option.value, e.target.checked)}
                      className="w-4 h-4 text-energetic-orange focus:ring-energetic-orange"
                    />
                    <span className="text-sm text-charcoal-gray">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="text-xs text-gray-500">({option.count})</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;