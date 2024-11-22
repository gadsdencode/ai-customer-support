/* eslint-disable @typescript-eslint/no-explicit-any */
// /config/copilotReadableConfigs.ts
import { ReadableConfig } from '@/app/types/copilot';
import { ExtendedCopilotContextParams } from '@/app/types/copilot';
//import useAppendSlide from '@/app/copilot/useAppendSlide';
//import useUpdateSlide from '@/app/copilot/useUpdateSlide';
//import { useGenerateChartAction } from '@/hooks/useGenerateChartAction';
//import { useGenerateSpreadsheetAction } from '@/hooks/useGenerateSpreadsheetAction';
//import { useGeneratePresentationAction } from '@/hooks/useGeneratePresentationAction';

export const createReadableConfigs = (
  contextValues: ExtendedCopilotContextParams,
  myAppState: any
): ReadableConfig[] => [
  {
    description: "Inteleos company information and CX data",
    value: contextValues.addDocumentContext,
    categories: ['documentContext']
  },
  {
    description: "Application context information and tools",
    value: {
      sendEmail: contextValues.sendEmail,
      useAppendSlide: contextValues.useAppendSlide,
      useUpdateSlide: contextValues.useUpdateSlide,
      useGenerateChartAction: contextValues.useGenerateChartAction,
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
    value: contextValues.pollComponent,
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
    value: contextValues.sendEmail,
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
    value: contextValues.generateSpreadsheet,
    categories: ['spreadsheetAction']
  },
  {
    description: "Presentation context",
    value: contextValues.generatePresentation,
    categories: ['presentationAction']
  },
  {
    description: "Slide speaking functionality context",
    value: contextValues.SpeakCurrentSlideButton,
    categories: ['slideAction']
  },
  {
    description: "Slide speaking component",
    value: contextValues.SpeakCurrentSlideButton,
    categories: ['slideAction']
  }
];