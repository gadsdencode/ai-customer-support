/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/copilot/PollComponent.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useCopilotAction } from '@copilotkit/react-core';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import useAuth from '@/app/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Initialize Supabase client
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

interface PollOption {
  id: string;
  option_text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  created_by: string;
  created_at: string;
  total_votes: number;
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface PollComponentProps {
  pollId: string;
  userId?: string;
}

const PollComponent: React.FC<PollComponentProps> = React.memo(({ pollId }) => {
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchPoll = useCallback(async () => {
    try {
      const { data: pollData, error: pollError } = await supabase
        .from('poll_results')
        .select('*')
        .eq('poll_id', pollId);

      if (pollError) throw new Error(`Error fetching poll: ${pollError.message}`);

      if (pollData && pollData.length > 0) {
        const pollResult = pollData[0];
        setPoll({
          id: pollResult.poll_id,
          question: pollResult.question,
          options: pollData.map(option => ({
            id: option.option_id,
            option_text: option.option_text,
            votes: option.votes
          })),
          created_by: '',
          created_at: '',
          total_votes: pollResult.total_votes
        });
      } else {
        throw new Error('Poll not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, [pollId]);

  const fetchComments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('poll_id', pollId)
        .order('created_at', { ascending: false });

      if (error) throw new Error(`Error fetching comments: ${error.message}`);

      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      // Optionally set an error state for comments
    }
  }, [pollId]);

  const checkUserVoted = useCallback(async () => {
    if (!user?.id) {
      setIsVoted(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('has_user_voted', {
        p_poll_id: pollId,
        p_user_id: user.id
      });

      if (error) throw new Error(`Error checking user vote: ${error.message}`);

      setIsVoted(data);
    } catch (err) {
      console.error('Error checking user vote:', err);
      setIsVoted(false);
    }
  }, [pollId, user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPoll(), fetchComments(), checkUserVoted()]);
      setLoading(false);
    };

    fetchData();

    const pollSubscription = supabase
      .channel(`poll:${pollId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, fetchPoll)
      .subscribe();

    const commentsSubscription = supabase
      .channel(`comments:${pollId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, fetchComments)
      .subscribe();

    return () => {
      pollSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
    };
  }, [pollId, fetchPoll, fetchComments, checkUserVoted]);

  const handleVote = async () => {
    if (!selectedOption || isVoted || !user?.id) return;

    try {
      const { error } = await supabase.rpc('increment_vote', {
        p_option_id: selectedOption,
        p_user_id: user.id,
      });

      if (error) throw new Error(`Error voting: ${error.message}`);

      setIsVoted(true);
      await fetchPoll();
    } catch (err) {
      console.error('Error voting:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while voting');
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user?.id) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({ poll_id: pollId, user_id: user.id, content: newComment });

      if (error) throw new Error(`Error adding comment: ${error.message}`);

      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding a comment');
    }
  };

  const handleShare = () => {
    navigator.share({
      title: poll?.question,
      url: `${window.location.origin}/poll/${pollId}`,
    }).catch(console.error);
  };

  if (loading) return <div>{t('loading')}</div>;
  if (error) return <div>{t('errorOccurred')}: {error}</div>;
  if (!poll) return <div>{t('pollNotFound')}</div>;

  return (
    <ErrorBoundary fallback={<div>{t('errorOccurred')}</div>}>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">{poll.question}</h2>
        <div className="space-y-3">
          {poll.options.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                type="radio"
                id={option.id}
                name="poll-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                disabled={isVoted || !user}
                className="mr-3"
              />
              <label htmlFor={option.id} className="flex-grow">
                {option.option_text}
                {isVoted && (
                  <div className="mt-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2"
                      style={{ width: `${(option.votes / poll.total_votes) * 100}%` }}
                    ></div>
                  </div>
                )}
              </label>
              {isVoted && <span className="ml-2 text-sm text-gray-500">{option.votes} {t('votes')}</span>}
            </div>
          ))}
        </div>
        {!isVoted && user && (
          <Button
            onClick={handleVote}
            disabled={!selectedOption}
            variant="outline"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            {t('vote')}
          </Button>
        )}
        {isVoted && <p className="mt-4 text-center text-gray-600">{t('thankYouForVoting')}</p>}
        {!user && <p className="mt-4 text-center text-gray-600">{t('loginToVote')}</p>}
        <Button onClick={handleShare} variant="outline" className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
          {t('share')}
        </Button>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">{t('comments')}</h3>
          {user ? (
            <>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder={t('addComment')}
              />
              <Button
                onClick={handleComment}
                variant="outline"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {t('postComment')}
              </Button>
            </>
          ) : (
            <p className="text-gray-600">{t('loginToComment')}</p>
          )}
          <div className="mt-4 space-y-2">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-100 p-2 rounded-md">
                <p>{comment.content}</p>
                <small className="text-gray-500">{new Date(comment.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
});

PollComponent.displayName = 'PollComponent';

export default PollComponent;