/* eslint-disable @typescript-eslint/no-unused-vars */
// app/components/ai/CoAgentStateDisplay.tsx

'use client'; // Ensure this is at the top if using Next.js with the App Router

import React from 'react';
// import { useCoAgentStateRender } from '@copilotkit/react-core';
import { useCoAgentStateRender } from '@/hooks/useCoAgentStateRender';
import { AgentState } from '@/app/types/copilot';
import WeatherInfo from './WeatherInfo';

const AgentStateDisplay: React.FC = () => {
  useCoAgentStateRender<AgentState>({
    name: 'basic_agent', // Replace with your actual agent name
    // nodeName: 'specific_node', // Optional: specify a node if needed
    render: ({ status, state, nodeName }) => {
      // You can handle different statuses or nodes if necessary
      return (
        <WeatherInfo data={state.final_response} />
      );
    },
  });

  return null; // This hook handles rendering, so no need to return any JSX here
};

export default AgentStateDisplay;
