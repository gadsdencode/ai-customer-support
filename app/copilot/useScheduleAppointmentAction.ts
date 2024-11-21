import { useCopilotAction } from "@copilotkit/react-core";
import { useToast } from '@/components/ui/use-toast';

const useScheduleAppointmentAction = () => {
  const { toast } = useToast();

  return useCopilotAction({
    name: 'scheduleAppointment',
    description: 'Schedules an appointment on Google Calendar',
    parameters: [
      { name: 'title', type: 'string', description: 'Title of the event', required: true },
      { name: 'startTime', type: 'string', description: 'Start time of the event in ISO format', required: true },
      { name: 'endTime', type: 'string', description: 'End time of the event in ISO format', required: true },
      { name: 'timeZone', type: 'string', description: 'Time zone of the event', required: true },
      { name: 'reminders', type: 'object', description: 'Reminders for the event', required: false },
      { name: 'recurrence', type: 'string[]', description: 'Recurrence rules for the event', required: false },
      { name: 'location', type: 'string', description: 'Location of the event', required: false },
      { name: 'description', type: 'string', description: 'Description of the event', required: false },
    ],
    handler: async ({ title, startTime, endTime, timeZone, reminders, recurrence, location, description }) => {
      if (!title || !startTime || !endTime || !timeZone) {
        toast({
          title: "Appointment Scheduling Error",
          description: `InteleosAI needs more information to complete your appointment request. Please try again.`,
          variant: "destructive",
          duration: 3000,
        });
        throw new Error('Missing required parameters');
      }

      try {
        const response = await fetch('/api/scheduleAppointment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, startTime, endTime, timeZone, reminders, recurrence, location, description }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast({
            title: "Error",
            description: data.error || "Failed to schedule appointment.",
            variant: "destructive",
            duration: 3500,
          });
          throw new Error(data.error || 'Failed to schedule appointment');
        }

        const eventLink = data.event.htmlLink;
        toast({
          title: `Your appointment has been scheduled.`,
          description: `The appointment has been successfully scheduled. <br />[View event](${eventLink})`,
          variant: "default",
          duration: 3500,

        });

        return data.event;
      } catch (error) {
        console.error('Error scheduling appointment:', error);
        toast({
          title: "Appointment scheduling failed.",
          description: `InteleosAI was unable to schedule your appointment. Please try again.`,
          variant: "destructive",
          duration: 3500,


        });
        throw new Error('Failed to schedule appointment');
      }
    },
    render: ({ status }) => (status === 'complete' ? '✅ Appointment Scheduled!' : `One moment please, InteleosAI is scheduling your appointment.`),
  });
};



export default useScheduleAppointmentAction;
