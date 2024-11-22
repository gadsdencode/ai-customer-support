/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/copilot/AIChatSuggestions.tsx

import React, { useEffect, useRef } from 'react';
import { ExtendedCopilotContextParams } from '@/app/types/copilot';
import { useAISuggestions } from '@/app/copilot/useAISuggestions';
import { CopilotChatSuggestionConfiguration } from '@copilotkit/react-core';

interface SuggestionType {
  title: string;
  message: string;
  partial?: boolean;
}

interface SuggestionComponentProps {
  context: ExtendedCopilotContextParams;
}

interface IndividualSuggestionProps {
  title: string;
  message: string;
  onClick: (message: string) => void;
  partial: boolean;
  className: string;
}

const IndividualSuggestion: React.FC<IndividualSuggestionProps> = ({ title, message, onClick, partial, className }) => (
  <button className={className} onClick={() => onClick(message)}>
    <h3>{title}</h3>
    <p>{message}</p>
    {partial && <span>(Partial)</span>}
  </button>
);

const SuggestionComponent: React.FC<SuggestionComponentProps> = ({ context }) => {
  const [suggestions, refreshSuggestions] = useAISuggestions({
    instructions: "Provide suggestions based on the user's context.",
    minSuggestions: 1,
    maxSuggestions: 5,
    className: 'suggestion-class',
    onSuggestionsChanged: (newSuggestions: SuggestionType[]) => {
      // This callback is handled internally by useAISuggestions
    },
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const chatSuggestionConfiguration: { [key: string]: CopilotChatSuggestionConfiguration } = {
      default: {
        instructions: "Provide suggestions based on the user's context.",
        minSuggestions: 1,
        maxSuggestions: 5,
        className: 'suggestion-class',
      },
    };

    if (context) {
      refreshSuggestions();
    }
  }, [context, refreshSuggestions]);

  return (
    <div className="suggestion-container">
      {suggestions.map((suggestion, index) => (
        <IndividualSuggestion
          key={index}
          title={suggestion.title}
          message={suggestion.message}
          onClick={(message: string) => console.log('Suggestion clicked:', message)}
          partial={suggestion.partial || false}
          className=""
        />
      ))}
    </div>
  );
};

export default SuggestionComponent;
