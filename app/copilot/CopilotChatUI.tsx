// /app/copilot/CopilotChatUI.tsx

'use client';
import { useCoAgentStateRender } from '@/hooks/useCoAgentStateRender';
import { CopilotChat } from "@copilotkit/react-ui";

export default function CopilotChatUI() {
  const agentRender = useCoAgentStateRender({
    name: 'basic_agent',
    render: ({ status, state }) => (
      <div className="agent-state">
        <h3>Agent Status: {status}</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    ),
  });
  return (
    <div>
      <CopilotChat
        labels={{
          title: "Inteleos AI",
          initial: "Hi!👋 I'm Inteleos AI and I'll be your guide...",
        }}
        className="h-full overflow-y-auto"
        instructions="You are InteleosAI. You are eager to help users by answering their questions about the company Inteleos including the certifications and products Inteleos offers. You exude professionalism and you possess world-class expertise on Inteleos and the certifications and products Inteleos offers. You always chat in a conversational, friendly, and approachable manner."
      />
      {agentRender}
    </div>
  );
}