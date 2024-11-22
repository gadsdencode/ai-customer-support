/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/types/copilot.ts

import { CopilotContextParams, CopilotChatSuggestionConfiguration } from '@copilotkit/react-core';
import { Message as OpenAIMessage } from '@copilotkit/runtime-client-gql';
import React from 'react';
import { Presentation } from '@/app/copilot/Presentation';
import { Slide } from '@/app/copilot/Slide';
import { Header } from '@/app/copilot/HeaderPPTGen';
import { SlideNumberIndicator } from '@/app/copilot/SlideNumberIndicator';
import { GenerateSlideButton } from '@/app/copilot/GenerateSlideButton';
import { DeleteSlideButton } from '@/app/copilot/DeleteSlideButton';
import { NavButton } from '@/app/copilot/NavButton';
import { PerformResearchSwitch } from '@/app/copilot/PerformResearchSwitch';
import { AddSlideButton } from '@/app/copilot/AddSlideButton';
import { SpeakCurrentSlideButton } from '@/app/copilot/SpeakCurrentSlideButton';
import { copilotComponents } from '@/app/copilot/components';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { useCopilotAction } from '@copilotkit/react-core';
import { useSlideTransition } from '@/hooks/useSlideTransition';
import { SlidePreviewCarousel } from '@/app/copilot/SlidePreviewCarousel';
import { PowerPointActions } from '@/app/copilot/PowerPointActions';
import { SlidePreview } from '@/app/copilot/SlidePreview';
import { usePowerPointState } from '@/hooks/usePowerPointState';
import { Parameter, MappedParameterTypes } from '@copilotkit/shared';
import { useAISuggestions } from '@/app/copilot/useAISuggestions';
import useCopilotPollAction from '@/app/copilot/useCopilotPollAction';
import PollComponent from '@/app/copilot/PollComponent';
import { useMakeCopilotReadable } from '@/hooks/useMakeCopilotReadable';
import { FrontendAction } from '@/app/contexts/TempInteleosContext';
import useAppendSlide from '@/app/copilot/useAppendSlide';
import { useGenerateChartAction } from '@/hooks/useGenerateChartAction';
import { useGenerateSpreadsheetAction } from '@/hooks/useGenerateSpreadsheetAction';
import { useGeneratePresentationAction } from '@/hooks/useGeneratePresentationAction';
import useUpdateSlide from '../copilot/useUpdateSlide';
import useScheduleAppointmentAction from '../copilot/useScheduleAppointmentAction';
import useResearchAction from '../copilot/useResearchAction';

export interface ReadableConfig {
    description: string;
    value: any;
    categories: string[];
  }

  export interface CopilotReadableResult {
    error?: Error;
    isLoading?: boolean;
  }
  
  /*export interface CopilotReadableOptions {
    description: string;
    value: any;
    categories: string[];
  }*/

export interface CopilotReadableOptions<T = any> {
  description: string;
  value: T;
  parentId?: string;
  categories?: string[];
  convert?: (description: string, value: T) => string;
}

export type Action<T extends Parameter[] | [] = []> = {
  name: string;
  description?: string;
  parameters?: T;
  handler: T extends [] ? () => any | Promise<any> : (args: MappedParameterTypes<T>) => any | Promise<any>;
};

export interface SlideModel {
  content: string;
  backgroundImageUrl: string;
  spokenNarration: string;
  title?: string;
}

// Define a type for slide data
export interface SlideData {
  title: string;
  content: string;
  spokenNarration?: string;
}

export type SpreadsheetData = {
    headers: string[];
    rows: (string | number)[][];
};

export type PresentationSlide = {
  title: string;
  content: string[];
};

export type PresentationData = {
  title: string;
  slides: PresentationSlide[];
};

export type EmailParams = {
    to: string;
    subject: string;
    body: string;
};

type SendEmailFunction = (params: EmailParams) => Promise<void>;

type InChatRenderFunction = (args: any) => JSX.Element;

export interface ExtendedCopilotContextParams extends Omit<CopilotContextParams, 'messages' | 'setMessages' | 'chatComponentsCache' | 'actions' | 'coAgentStateRenders' | 'generateSpreadsheet' | 'generatePresentation'> {
  appendSlide: typeof useAppendSlide;
  useAppendSlide: typeof useAppendSlide;
  actions: Record<string, FrontendAction<any>>;
  coAgentStateRenders: Record<string, any>;
  pollAction: typeof useCopilotPollAction;
  pollComponent: typeof PollComponent;
  useCopilotPollAction: typeof useCopilotPollAction;
  useAISuggestions: typeof useAISuggestions;
  sendEmail: SendEmailFunction;
  getChatCompletionFunctionDescriptions: () => any[];
  entryPoints: Record<string, any>;
  setEntryPoint: (name: string, value: any) => void;
  removeEntryPoint: (name: string) => void;
  chatComponentsCache: React.MutableRefObject<Record<string, string | InChatRenderFunction>>;
  getFunctionCallHandler: () => (...args: any[]) => Promise<any>;
  setFunctionCallHandler: (name: string, handler: (...args: any[]) => Promise<any>) => void;
  removeFunctionCallHandler: (name: string) => void;
  getChatCompletion: () => string;
  setChatCompletion: (completion: string) => void;
  removeChatCompletion: () => void;
  getChatComponent: () => string;
  setChatComponent: (component: string | InChatRenderFunction) => void;
  removeChatComponent: () => void;
  getChatSuggestion: () => string;
  setChatSuggestion: (suggestion: string) => void;
  removeChatSuggestion: () => void;
  messages: OpenAIMessage[];
  setMessages: React.Dispatch<React.SetStateAction<OpenAIMessage[]>>;
  addContext: (context: string) => string;
  removeContext: (context: string) => void;
  getContextString: () => string;
  addDocumentContext: (document: any) => string;
  removeDocumentContext: (documentId: string) => string;
  getDocumentsContext: (categories: string[]) => any[];
  chatSuggestionConfiguration: Record<string, any>;
  addChatSuggestionConfiguration: (id: string, suggestion: CopilotChatSuggestionConfiguration) => void;
  removeChatSuggestionConfiguration: (id: string) => void;
  copilotApiConfig: {
      chatApiEndpoint: string;
      chatApiEndpointV2: string;
      headers: Record<string, string>;
      body: Record<string, any>;
  };
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  chatInstructions: string;
  setChatInstructions: React.Dispatch<React.SetStateAction<string>>;
  generateSpreadsheet: (data: SpreadsheetData, filename: string) => Promise<string>;
  generatePresentation: (data: PresentationData, filename: string) => Promise<string>;
  Presentation: typeof Presentation;
  Slide: typeof Slide;
  Header: typeof Header;
  SlideNumberIndicator: typeof SlideNumberIndicator;
  GenerateSlideButton: typeof GenerateSlideButton;
  DeleteSlideButton: typeof DeleteSlideButton;
  NavButton: typeof NavButton;
  PerformResearchSwitch: typeof PerformResearchSwitch;
  AddSlideButton: typeof AddSlideButton;
  SpeakCurrentSlideButton: typeof SpeakCurrentSlideButton;
  copilotComponents: typeof copilotComponents;
  XLSX: typeof XLSX;
  pptxgen: typeof pptxgen;
  useCopilotAction: typeof useCopilotAction;
  useSlideTransition: typeof useSlideTransition;
  SlidePreviewCarousel: typeof SlidePreviewCarousel;
  PowerPointActions: typeof PowerPointActions;
  SlidePreview: typeof SlidePreview;
  usePowerPointState: typeof usePowerPointState;
  slides: SlideData[];
  setSlides: React.Dispatch<React.SetStateAction<SlideData[]>>;
  addSlide: (slide: SlideData) => void;
  currentSlide: number;
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
  direction: number;
  setDirection: React.Dispatch<React.SetStateAction<number>>;
  nextSlide: () => void;
  prevSlide: () => void;
  initialSlides: SlideData[];
  setInitialSlides: React.Dispatch<React.SetStateAction<SlideData[]>>;
  useMakeCopilotReadable: (options: CopilotReadableOptions) => ReturnType<typeof useMakeCopilotReadable>;
  useGenerateChartAction: typeof useGenerateChartAction;
  useGenerateSpreadsheetAction: typeof useGenerateSpreadsheetAction;
  useGeneratePresentationAction: typeof useGeneratePresentationAction;
  useUpdateSlide: typeof useUpdateSlide;
  useScheduleAppointmentAction: typeof useScheduleAppointmentAction;
  useResearchAction: typeof useResearchAction;
}

export type { SendEmailFunction, InChatRenderFunction };