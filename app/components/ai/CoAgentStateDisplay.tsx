// app/components/ai/CoAgentStateDisplay.tsx

'use client';

import React from 'react';
import WeatherInfo from './WeatherInfo';
import { Loader2 } from 'lucide-react';
import { WeatherResponse } from '@/app/types/copilot';
import { useAgentUIContext } from '@/app/providers/AGUIProvider';

interface WeatherState {
  final_response: WeatherResponse;
}

const CoAgentStateDisplay: React.FC = () => {
  const { weatherAgent } = useAgentUIContext();
  const { status, state } = weatherAgent;
  
  const renderWeatherUI = () => {
    if (status === 'thinking') {
      return (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing weather request...</span>
        </div>
      );
    }
    
    if (status === 'response' && state && 'final_response' in state) {
      const weatherState = (state as unknown) as WeatherState;
      if ('final_response' in weatherState && 
          typeof weatherState.final_response === 'object' && 
          weatherState.final_response !== null) {
        return <WeatherInfo data={weatherState.final_response} />;
      }
    }
    
    return (
      <div className="text-sm text-muted-foreground">
        Waiting for weather data...
      </div>
    );
  };

  return (
    <div className="agent-state-display p-4 bg-secondary rounded-lg">
      {renderWeatherUI()}
    </div>
  );
};

export default CoAgentStateDisplay;
