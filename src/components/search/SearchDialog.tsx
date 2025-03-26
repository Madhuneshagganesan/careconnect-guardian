
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent,
  DialogClose
} from '@/components/ui/dialog';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchDialogProps {
  trigger: React.ReactNode;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ trigger }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // Sample data for quick search
  const quickSearches = [
    'Elderly Care',
    'Personal Care',
    'Physiotherapy',
    'Medication Management',
    'Household Help',
    'Overnight Care'
  ];
  
  // Mock search function
  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Simulate API call with some mock data
    const mockCaregivers = [
      { id: 1, type: 'caregiver', name: 'Priya Sharma', specialty: 'Elder Care Specialist' },
      { id: 2, type: 'caregiver', name: 'Rajesh Kumar', specialty: 'Physiotherapy Assistant' },
      { id: 5, type: 'caregiver', name: 'Deepa Nair', specialty: 'Senior Care Specialist' }
    ];
    
    const mockServices = [
      { id: 1, type: 'service', name: 'Personal Care', description: 'Help with daily activities' },
      { id: 2, type: 'service', name: 'Physiotherapy', description: 'Rehabilitation exercises' },
      { id: 3, type: 'service', name: 'Companionship', description: 'Social engagement and support' }
    ];
    
    // Filter mock data based on search term
    const filteredCaregivers = mockCaregivers.filter(caregiver => 
      caregiver.name.toLowerCase().includes(term.toLowerCase()) || 
      caregiver.specialty.toLowerCase().includes(term.toLowerCase())
    );
    
    const filteredServices = mockServices.filter(service => 
      service.name.toLowerCase().includes(term.toLowerCase()) || 
      service.description.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults([...filteredCaregivers, ...filteredServices]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    performSearch(term);
  };
  
  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };
  
  const handleResultClick = (result: any) => {
    if (result.type === 'caregiver') {
      navigate(`/caregivers/${result.id}`);
    } else if (result.type === 'service') {
      navigate('/services');
    }
  };
  
  const handleSearchSubmit = () => {
    // Navigate to search results page with search term as query parameter
    if (searchTerm.trim()) {
      navigate(`/caregivers?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-4">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian-400"
                placeholder="Search for caregivers, services..."
                autoFocus
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button 
              className="ml-2 p-3 bg-guardian-500 text-white rounded-lg hover:bg-guardian-600 transition-colors focus:outline-none focus:ring-2 focus:ring-guardian-400"
              onClick={handleSearchSubmit}
            >
              <ArrowRight size={20} />
            </button>
          </div>
          
          {!searchTerm && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Quick Searches</h3>
              <div className="flex flex-wrap gap-2">
                {quickSearches.map((term, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-guardian-50 text-guardian-700 rounded-full text-sm hover:bg-guardian-100 transition-colors"
                    onClick={() => handleQuickSearch(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="mt-4 max-h-60 overflow-y-auto">
              <h3 className="text-sm font-medium mb-2">Results</h3>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <DialogClose key={`${result.type}-${result.id}`} asChild>
                    <button
                      className="w-full text-left p-3 rounded-lg hover:bg-guardian-50 transition-colors flex items-start"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="w-8 h-8 bg-guardian-100 rounded-full flex items-center justify-center text-guardian-600 mr-3 flex-shrink-0">
                        {result.type === 'caregiver' ? 'C' : 'S'}
                      </div>
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.type === 'caregiver' ? result.specialty : result.description}
                        </div>
                      </div>
                    </button>
                  </DialogClose>
                ))}
                
                <DialogClose asChild>
                  <button
                    className="w-full text-center p-2 text-guardian-500 hover:text-guardian-600 transition-colors text-sm"
                    onClick={handleSearchSubmit}
                  >
                    View all results
                  </button>
                </DialogClose>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
