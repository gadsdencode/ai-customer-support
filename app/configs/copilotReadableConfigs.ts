/* eslint-disable @typescript-eslint/no-explicit-any */
// /config/copilotReadableConfigs.ts
import { ReadableConfig } from '@/types/copilot';

export const createReadableConfigs = (
  contextValues: ExtendedCopilotContextParams,
  myAppState: any
): ReadableConfig[] => [
  {
    description: "Inteleos company information and CX data",
    value: contextValues.documentContent,
    categories: ['documentContext']
  },
  {
    description: "Application context information and tools",
    value: {
      sendEmail: contextValues.sendEmailAction,
      useAppendSlide: contextValues.useAppendSlide,
      useUpdateSlide: contextValues.useUpdateSlide,
      useGenerateChartAction: contextValues.generateChartAction,
      useGenerateSpreadsheetAction: contextValues.useGenerateSpreadsheetAction,
      useGeneratePresentationAction: contextValues.useGeneratePresentationAction,
      ...contextValues.copilotComponents,
      pollAction: contextValues.pollAction,
      pollComponent: contextValues.pollComponent,
      useCopilotPollAction: contextValues.useCopilotPollAction,
    },
    categories: ['appContext']
  },
  {
    description: 'Application state information',
    value: myAppState,
    categories: ['appContext']
  },
  {
    description: "Poll action functionality",
    value: contextValues.pollAction,
    categories: ['pollAction']
  },
  {
    description: "Poll creation functionality",
    value: contextValues.useCopilotPollAction,
    categories: ['pollAction']
  },
  {
    description: "Poll component rendering",
    value: contextValues.PollComponent,
    categories: ['pollAction']
  },
  {
    description: "Slide preview carousel component",
    value: contextValues.SlidePreviewCarousel,
    categories: ['slideAction']
  },
  {
    description: "Individual slide preview component",
    value: contextValues.SlidePreview,
    categories: ['slideAction']
  },
  {
    description: "Slide transition management",
    value: contextValues.useSlideTransition,
    categories: ['slideAction']
  },
  {
    description: "Email functionality",
    value: contextValues.sendEmailAction,
    categories: ['appContext']
  },
  {
    description: "Appointment scheduling functionality",
    value: contextValues.useScheduleAppointmentAction,
    categories: ['appointmentAction']
  },
  {
    description: "Research functionality",
    value: contextValues.useResearchAction,
    categories: ['researchAction']
  },
  {
    description: "Chart generation functionality",
    value: contextValues.useGenerateChartAction,
    categories: ['chartAction']
  },
  {
    description: "Slide addition functionality",
    value: contextValues.useAppendSlide,
    categories: ['slideAction']
  },
  {
    description: "Slide update functionality",
    value: contextValues.useUpdateSlide,
    categories: ['slideAction']
  },
  {
    description: "Spreadsheet generation functionality",
    value: contextValues.useGenerateSpreadsheetAction,
    categories: ['spreadsheetAction']
  },
  {
    description: "Presentation generation functionality",
    value: contextValues.useGeneratePresentationAction,
    categories: ['presentationAction']
  },
  {
    description: "Spreadsheet context",
    value: contextValues.suggestionsContext.generateSpreadsheet,
    categories: ['spreadsheetAction']
  },
  {
    description: "Presentation context",
    value: contextValues.suggestionsContext.generatePresentation,
    categories: ['presentationAction']
  },
  {
    description: "Slide speaking functionality context",
    value: contextValues.suggestionsContext.SpeakCurrentSlideButton,
    categories: ['slideAction']
  },
  {
    description: "Slide speaking component",
    value: contextValues.SpeakCurrentSlideButton,
    categories: ['slideAction']
  }
];