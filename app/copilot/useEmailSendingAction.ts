// app/copilot/useEmailSendingAction.ts

import { useMemo, useCallback } from 'react';
import { useCopilotAction } from "@copilotkit/react-core";
import { SendEmailFunction } from '@/app/types/copilot';
import { useToast } from '@/components/ui/use-toast';

const useEmailSendingAction = (): SendEmailFunction => {
  const { toast } = useToast();

  const handleSendEmail = useCallback(async ({ to, subject, body }: { to: string; subject: string; body: string }) => {
    if (!to || !subject || !body) {
      toast({
        title: "Email Sending Error",
        description: "Missing required parameters for sending email.",
        variant: "destructive",
        duration: 3000,
      });
      throw new Error('Missing required parameters');
    }

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to send email.",
          variant: "destructive",
          duration: 3500,
        });
        throw new Error(data.error || 'Failed to send email');
      }

      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
        variant: "default",
        duration: 3500,
      });

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Email sending failed",
        description: "Unable to send the email. Please try again.",
        variant: "destructive",
        duration: 3500,
      });
      throw new Error('Failed to send email');
    }
  }, [toast]);

  useCopilotAction({
    name: 'sendEmail',
    description: 'Sends an email using Gmail',
    parameters: [
      { name: 'to', type: 'string', description: 'Recipient email address', required: true },
      { name: 'subject', type: 'string', description: 'Email subject', required: true },
      { name: 'body', type: 'string', description: 'Email body content', required: true },
    ],
    handler: handleSendEmail,
    render: ({ status }) => (status === 'complete' ? '✅ Email Sent!' : 'Sending email...'),
  });

  // Return a function that matches SendEmailFunction type
  return useMemo(() => {
    const sendEmail: SendEmailFunction = async (params: { to: string; subject: string; body: string }): Promise<void> => {
      try {
        await handleSendEmail(params);
      } catch (error) {
        console.error('Error in sendEmail:', error);
        throw error;
      }
    };
    return sendEmail;
  }, [handleSendEmail]);
};

export default useEmailSendingAction;