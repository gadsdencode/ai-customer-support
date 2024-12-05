// app/components/ai/WeatherInfo.tsx

import React from 'react';
import { WeatherResponse } from '@/app/types/copilot';

interface WeatherInfoProps {
  data: WeatherResponse;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data }) => {
  return (
    <div className="weather-info">
      <h2>Weather Details</h2>
      <p><strong>Conditions:</strong> {data.conditions}</p>
      <p><strong>Temperature:</strong> {data.temperature}°C</p>
      <p><strong>Wind Direction:</strong> {data.wind_direction}</p>
      <p><strong>Wind Speed:</strong> {data.wind_speed} km/h</p>
    </div>
  );
};

export default WeatherInfo;
