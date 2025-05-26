import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CitySearchProps {
  onCitySelect: (city: string) => void;
  isLoading: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const popularCities = [
    "Ahmedabad",
    "London",
    "Dubai",
    "Tokyo",
    "Paris",
    "New York",
    "Mumbai",
    "Sydney",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && !isLoading) {
      onCitySelect(searchTerm.trim());
      setSearchTerm("");
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-gray-300 focus:border-orange-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Popular cities:</span>
          {popularCities.map((city) => (
            <Button
              key={city}
              variant="outline"
              size="sm"
              onClick={() => onCitySelect(city)}
              className="text-xs hover:bg-orange-50 hover:border-orange-300"
              disabled={isLoading}
            >
              {city}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CitySearch;
