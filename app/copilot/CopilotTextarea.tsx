import { CopilotTextarea } from "@copilotkit/react-textarea";
import { useState } from "react";

export function CopilotText() {
  const [text, setText] = useState("");

  return (
    <>
      <CopilotTextarea
        className="px-4 py-4 bg-gray-700"
        value={text}
        onValueChange={(value: string) => setText(value)}
        placeholder="Write your notes here and watch AI intelligently make suggestions!"
        autosuggestionsConfig={{
          textareaPurpose: "Notes about a user's tax-related questions and concerns. Likely written in a colloquial style, but adjust as needed.",
          chatApiConfigs: {
            suggestionsApiConfig: {
              forwardedParams: {
                max_tokens: 20,
                stop: [".", "?", "!"],
              },
            },
          },
        }}
      />
    </>
  );
}
