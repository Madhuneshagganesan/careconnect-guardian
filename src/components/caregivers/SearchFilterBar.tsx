
import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filters: Array<{ id: string; label: string }>;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  filters
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by name, specialty, or service..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <select
            className="pl-10 pr-8 py-2 border border-input rounded-lg appearance-none bg-transparent focus:outline-none focus:ring-2 focus:ring-guardian-400"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filters.map(filter => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
