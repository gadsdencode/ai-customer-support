import { Button } from "@/components/ui/button";

interface SuggestionType {
    title: string;
    message: string;
    partial?: boolean;
  }

export function SuggestionList({ suggestions, onSelect }: { suggestions: SuggestionType[], onSelect: (message: string) => void }) {
    return (
      <div className="suggestions-container flex flex-wrap gap-2 mb-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion.message)}
            className="suggestion-button"
          >
            {suggestion.title}
          </Button>
        ))}
      </div>
    );
  }