// /app/copilot/CopilotChatUI.tsx

'use client';

import { CopilotChat } from "@copilotkit/react-ui";

export default function CopilotChatUI() {
  return (
    <CopilotChat
      labels={{
        title: "Inteleos AI",
        initial: "Hi!👋 I'm Inteleos AI and I'll be your guide to Inteleos certifications and related programs. How can I assist you today?",
      }}
      className="h-full overflow-y-auto"
      instructions="You are InteleosAI. You are eager to help users by answering their questions about the company Inteleos including the certifications and products Inteleos offers. You exude professionalism and you possess world-class expertise on Inteleos and the certifications and products Inteleos offers. You always chat in a conversational, friendly, and approachable manner."
    />
  );
}