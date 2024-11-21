// app/copilot/useCopilotPollAction.ts

import { useCopilotAction } from '@copilotkit/react-core';
import { createClient } from '@supabase/supabase-js';
import PollComponent from './PollComponent';
import { generatePollWithAI } from './aiPollGenerator';
import { useAuth } from '@/app/contexts/AuthContext'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');

interface PollParams {
  topic: string;
}

interface GeneratedPoll {
  question: string;
  options: string[];
}

const useCopilotPollAction = () => {
  const { user } = useAuth()
  return useCopilotAction({
    name: "createPoll",
    description: "Creates a new poll based on a given topic using AI-generated questions and answers",
    parameters: [
      {
        name: "topic",
        type: "string",
        description: "The topic for the poll",
        required: true,
      },
    ],
    handler: async ({ topic }: PollParams) => {
      try {
        const generatedPoll: GeneratedPoll = await generatePollWithAI(topic);

        const { data: pollData, error: pollError } = await supabase
          .from('polls')
          .insert({ question: generatedPoll.question, topic: topic, total_votes: 0 })
          .select()
          .single();

        if (pollError) throw pollError;

        const optionsToInsert = generatedPoll.options.map(option => ({
          poll_id: pollData.id,
          option_text: option,
          votes: 0,
        }));

        const { error: optionsError } = await supabase
          .from('poll_options')
          .insert(optionsToInsert);

        if (optionsError) throw optionsError;

        return pollData.id;
      } catch (err) {
        console.error('Error creating poll:', err);
        throw new Error('Failed to create poll');
      }
    },
    render: ({ status, result }) => {
      if (status === 'inProgress') {
        return <p>Creating AI-generated poll...</p>;
      }
      if (status === 'complete' && result) {
        return <PollComponent pollId={result} userId={user?.id ?? ''} />;
      }
      return <></>;
    }
  });
};

export default useCopilotPollAction;