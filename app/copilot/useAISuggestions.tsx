/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/hooks/useAISuggestions.tsx

import { useState, useCallback, useEffect } from 'react';
import { useCopilotContext } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

interface SuggestionType {
  title: string;
  message: string;
  partial?: boolean;
}

interface CopilotChatSuggestionConfiguration {
  instructions: string;
  [key: string]: any; // Allow any additional properties
}

export const useAISuggestions = (
  config: CopilotChatSuggestionConfiguration,
  dependencies: React.DependencyList = []
): [SuggestionType[], () => void] => {
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const context = useCopilotContext();

  const suggestionsConfig: CopilotChatSuggestionConfiguration = {
    ...config,
    instructions: config.instructions,
    onSuggestionsChanged: (newSuggestions: SuggestionType[]) => {
      setSuggestions(newSuggestions.map((suggestion) => ({
        title: suggestion.title,
        message: suggestion.message,
        partial: suggestion.partial,
      })));
    },
  };

  useCopilotChatSuggestions(suggestionsConfig);

  const refreshSuggestions = useCallback(() => {
    setSuggestions([]);
    // Note: We can't use refresh() as it doesn't exist on the return type of useCopilotChatSuggestions
    // Instead, we'll rely on the effect to trigger a refresh
  }, []);

  useEffect(() => {
    refreshSuggestions();
  }, [refreshSuggestions, ...dependencies]);

  return [suggestions, refreshSuggestions];
};