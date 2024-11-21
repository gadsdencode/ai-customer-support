// /app/copilot/sendEmailButton.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import useEmailSendingAction from './useEmailSendingAction';

const SendEmailButton: React.FC = () => {
  const sendEmail = useEmailSendingAction();

  const handleSendEmail = async () => {
    try {
      await sendEmail({
        to: 'recipient@example.com',
        subject: 'Test Email',
        body: 'This is a test email sent by the AI.',
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <Button variant="outline" className='text-black hover:text-white rounded w-full' onClick={handleSendEmail}>Send Test Email</Button>
  );
};

export default SendEmailButton;