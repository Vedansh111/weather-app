import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast'; 
import CitySearch from './CitySearch';
import WeatherCard from './WeatherCard';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  date: string;
  iconCode: string; 
  sunrise: string; 
  sunset: string;   
  tempMin: number;  
  tempMax: number;  
}

const WeatherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); 
  const [isCelsius, setIsCelsius] = useState(true);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false); 
  const [currentCity, setCurrentCity] = useState<string>('Ahmedabad');
  const OPENWEATHER_API_KEY = import.meta.env.VITE_WEATHER_APP_KEY;

  const fetchWeatherData = useCallback(async (city: string, units: 'metric' | 'imperial' = 'metric') => {
    if (!OPENWEATHER_API_KEY) {
      toast({
        title: "API Key Missing",
        description: "OpenWeatherMap API key is not configured.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingWeather(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=${units}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling.');
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

      const formatTime = (unixTimestamp: number, timezoneOffset: number) => {
        const date = new Date((unixTimestamp + timezoneOffset) * 1000);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        });
      };

      const newWeatherData: WeatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: data.main.feels_like,
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        iconCode: data.weather[0].icon,
        sunrise: formatTime(data.sys.sunrise, data.timezone),
        sunset: formatTime(data.sys.sunset, data.timezone),
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
      };

      setWeatherData(newWeatherData);
      setCurrentCity(city);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      toast({
        title: "Weather Fetch Error",
        description: error.message || "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
      setWeatherData(null); 
    } finally {
      setIsLoadingWeather(false);
    }
  }, [OPENWEATHER_API_KEY, toast]); 

  useEffect(() => {
    fetchWeatherData(currentCity, isCelsius ? 'metric' : 'imperial');
  }, [fetchWeatherData, isCelsius, currentCity]); 

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
  };

  const convertTemperature = (temp: number) => {
    if (isCelsius) return Math.round(temp); 
    return Math.round((temp * 9/5) + 32); 
  };

  const userName = user?.name || user?.email?.split('@')[0] || 'User';


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-600 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <Card className="mb-6 backdrop-blur-sm bg-white/90 border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Welcome back, {userName}!
              </CardTitle>
              <p className="text-gray-600">Your personal weather dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={isCelsius ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsCelsius(true)}
                  className="w-12"
                >
                  °C
                </Button>
                <Button
                  variant={!isCelsius ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsCelsius(false)}
                  className="w-12"
                >
                  °F
                </Button>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* city search */}
        <div className="mb-6">
          <CitySearch onCitySelect={handleCitySelect} isLoading={isLoadingWeather} />
        </div>

        {/* weather content */}
        {isLoadingWeather ? (
          <Card className="p-6 text-center text-gray-700 backdrop-blur-sm bg-white/90 border-0 shadow-xl">
            <CardContent>
              <p>Loading weather data...</p>
            </CardContent>
          </Card>
        ) : weatherData ? (
          <WeatherCard
            weatherData={weatherData}
            isCelsius={isCelsius}
            convertTemperature={convertTemperature} 
          />
        ) : (
          <Card className="p-6 text-center text-gray-700 backdrop-blur-sm bg-white/90 border-0 shadow-xl">
            <CardContent>
              <p>No weather data available. Search for a city!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;