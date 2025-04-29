
import React from 'react';

interface FilterPillsProps {
  filters: Array<{ id: string; label: string }>;
  selectedFilter: string;
  onFilterSelect: (filterId: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  selectedFilter,
  onFilterSelect
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(filter => (
        <button
          key={filter.id}
          className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
            selectedFilter === filter.id
              ? 'bg-guardian-500 text-white'
              : 'bg-white border border-border text-muted-foreground hover:bg-guardian-50 hover:text-guardian-500'
          }`}
          onClick={() => onFilterSelect(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPills;
