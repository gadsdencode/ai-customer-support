// /app/hooks/useSuggestions.ts

import { useState, useEffect, useRef } from 'react';
import { ExtendedCopilotContextParams } from '@/app/types/copilot';
import { CopilotChatSuggestionConfiguration } from '@copilotkit/react-core';
import logger from '@/utils/logger';

export const useSuggestions = (context: ExtendedCopilotContextParams) => {
  const [suggestions, setSuggestions] = useState<{ title: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const chatSuggestionConfiguration: { [key: string]: CopilotChatSuggestionConfiguration } = {
        default: {
          instructions: "Provide suggestions based on the user's context.",
          minSuggestions: 1,
          maxSuggestions: 5,
          className: 'suggestion-class',
        },
      };
      await loadSuggestions();
    } catch (err) {
      logger.error("Failed to load suggestions", { error: err });
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (context) {
      loadSuggestions();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [context]);

  return { suggestions, loading, error, reloadSuggestions: loadSuggestions };
};