// /app/copilot/CopilotChatUI.tsx

'use client';
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { useState, useCallback } from 'react';

// Enhanced type definitions with more specific state management
type InteleosAgentResponse = {
  companyInfo?: string;
  certifications?: string[];
  productDetails?: Record<string, unknown>;
}

type AgentState = {
  final_response?: InteleosAgentResponse;
  currentStep?: 'initializing' | 'processing' | 'completed' | 'error';
  confidence?: number;
  error?: string;
}

export default function CopilotChatUI() {
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Use useCoAgent with enhanced type safety and initial state
  const agent = useCoAgent<AgentState>({
    name: "inteleos-agent",
    initialState: {
      final_response: {},
      currentStep: 'initializing',
      confidence: 0
    }
  });

  // Memoized state update handler with type safety
  const handleStateUpdate = useCallback(() => {
    agent.setState({
      ...agent.state,
      currentStep: 'processing',
      confidence: 0.5,
      final_response: {
        companyInfo: "Inteleos is a leading technology solutions provider",
        certifications: ["ISO 9001", "CMMI Level 5"]
      }
    });
  }, [agent]);

  // Error boundary simulation
  const handleErrorSimulation = useCallback(() => {
    agent.setState({
      ...agent.state,
      currentStep: 'error',
      error: 'Simulated agent error occurred'
    });
  }, [agent]);

  return (
    <div className="flex flex-col space-y-4">
      <CopilotChat
        labels={{
          title: "Inteleos AI",
          initial: "Hi!👋 I'm Inteleos AI and I'll be your guide...",
        }}
        className="h-full overflow-y-auto"
        instructions="You are InteleosAI. You are eager to help users by answering their questions about the company Inteleos including the certifications and products Inteleos offers. You exude professionalism and you possess world-class expertise on Inteleos and the certifications and products Inteleos offers. You always chat in a conversational, friendly, and approachable manner."
      />
      
      {/* Debug toggle */}
      <div className="flex items-center space-x-2">
        <label className="inline-flex items-center">
          <input 
            type="checkbox" 
            checked={isDebugMode}
            onChange={() => setIsDebugMode(!isDebugMode)}
            className="form-checkbox"
          />
          <span className="ml-2">Show Debug Information</span>
        </label>
      </div>
      
      {isDebugMode && (
        <div className="agent-state bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Agent Details</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Name:</strong> {agent.name}
            </div>
            <div>
              <strong>Running:</strong> {agent.running ? 'Active' : 'Inactive'}
            </div>
            <div>
              <strong>Current Step:</strong> {agent.state.currentStep}
            </div>
            <div>
              <strong>Confidence:</strong> {agent.state.confidence?.toFixed(2)}
            </div>
          </div>

          {agent.state.final_response && (
            <div className="mt-4">
              <strong>Response:</strong>
              <pre className="bg-white p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(agent.state.final_response, null, 2)}
              </pre>
            </div>
          )}

          {agent.state.error && (
            <div className="mt-4 text-red-500">
              <strong>Error:</strong> {agent.state.error}
            </div>
          )}
          
          <div className="flex space-x-2 mt-4">
            <button 
              onClick={handleStateUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update State
            </button>
            <button 
              onClick={handleErrorSimulation}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Simulate Error
            </button>
            <button 
              onClick={() => agent.start()} 
              disabled={agent.running}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 hover:bg-green-600"
            >
              Start Agent
            </button>
            <button 
              onClick={() => agent.stop()} 
              disabled={!agent.running}
              className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50 hover:bg-yellow-600"
            >
              Stop Agent
            </button>
          </div>
        </div>
      )}
    </div>
  );
}