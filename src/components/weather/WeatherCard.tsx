import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

interface WeatherCardProps {
  weatherData: WeatherData;
  isCelsius: boolean;
  convertTemperature: (temp: number) => number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, isCelsius, convertTemperature }) => {

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const formatCondition = (condition: string) => {
    return condition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* main weather card */}
      <Card className="lg:col-span-2 backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">{weatherData.date}</CardTitle>
          <div className="text-lg font-semibold text-gray-700">
            {weatherData.city}, {weatherData.country}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={getWeatherIconUrl(weatherData.iconCode)}
                alt={weatherData.condition}
                className="w-24 h-24"
              />
              <div>
                <div className="text-5xl font-bold text-gray-800">
                  {Math.round(weatherData.temperature)}°{isCelsius ? 'C' : 'F'}
                </div>
                <div className="text-xl text-gray-600">{formatCondition(weatherData.condition)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Feels Like</div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(weatherData.feelsLike)}°{isCelsius ? 'C' : 'F'}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-200 to-orange-300 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="text-2xl font-bold text-gray-800">{weatherData.humidity}%</div>
            </div>
            <div className="bg-gradient-to-r from-orange-300 to-orange-400 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Wind Speed</div>
              <div className="text-2xl font-bold text-gray-800">{Math.round(weatherData.windSpeed * 3.6)} km/h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* side infocard */}
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">Weather Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
            <span className="text-gray-700">☀️ Sunrise</span>
            <span className="font-semibold text-gray-800">{weatherData.sunrise}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg">
            <span className="text-gray-700">🌅 Sunset</span>
            <span className="font-semibold text-gray-800">{weatherData.sunset}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-300 to-orange-400 rounded-lg">
            <span className="text-gray-700">🌡️ High</span>
            <span className="font-semibold text-gray-800">
              {Math.round(weatherData.tempMax)}°{isCelsius ? 'C' : 'F'}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-black/10 to-gray-300 rounded-lg">
            <span className="text-gray-700">❄️ Low</span>
            <span className="font-semibold text-gray-800">
              {Math.round(weatherData.tempMin)}°{isCelsius ? 'C' : 'F'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherCard;