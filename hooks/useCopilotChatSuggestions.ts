// hooks/useCopilotChatSuggestions.ts

import { useCopilotChatSuggestions } from "@copilotkit/react-ui"; 
 
export function CopilotChatSuggestions() {

  useCopilotChatSuggestions(
    {
      instructions: "Suggest the most relevant next actions.",
      minSuggestions: 2,
      maxSuggestions: 5,
    },
    [],
  );
}