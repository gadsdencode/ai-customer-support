// /app/copilot/useResearchAction.ts

import { useCopilotAction } from "@copilotkit/react-core";
import { useToast } from '@/hooks/use-toast';
import { research } from '@/app/copilot/tavily';

const useResearchAction = () => {
const { toast } = useToast();


  return useCopilotAction({
    name: 'research',
    description: 'Conducts research on a specified topic using the Tavily API and OpenAI.',
    parameters: [
      { name: 'topic', type: 'string', description: 'The topic to research. Must be 5 characters or longer.', required: true },
    ],
    handler: async ({ topic }) => {
      if (!topic || topic.length < 5) {
        toast({
          title: "Research Error",
          description: `Sorry, AI needs a question that is at least 5 characters long.`,
          variant: "destructive",
          duration: 3000,
        });
        throw new Error('The topic must be at least 5 characters long.');
      }

      try {
        const result = await research(topic);
        toast({
          title: "✅ Research Complete",
          description: `AI has successfully researched your question!`,
          variant: "default",
          duration: 3000,


        });
        return result;
      } catch (error) {
        console.error('Error conducting research:', error);
        toast({
          title: "Error",
          description: `Sorry, AI wasn't able to conduct the requested research. Please try again.`,
          variant: "destructive",
          duration: 3000,


        });
        throw new Error('Failed to conduct research.');
      }
    },
    render: ({ status }) => (status === 'complete' ? '✅ Research Complete!' : `One moment, AI is researching your question...`),
  });
};



export default useResearchAction;
