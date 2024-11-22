/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /app/contexts/InteleosContext.tsx
'use client'
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { CopilotReadableOptions, ExtendedCopilotContextParams, SlideData } from '../types/copilot';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../utils/supabase/client';
import useGenerateChartAction from '../copilot/useGenerateChart';
import useScheduleAppointmentAction from '../copilot/useScheduleAppointmentAction';
import useResearchAction from '../copilot/useResearchAction';
import { useAISuggestions } from '../copilot/useAISuggestions';
import useEmailSendingAction from '../copilot/useEmailSendingAction';
import { DocumentPointer } from '@copilotkit/react-core';
import { Message } from '@copilotkit/runtime-client-gql';
import logger from '../utils/logger';
import useAppendSlide from '../copilot/useAppendSlide';
import useUpdateSlide from '../copilot/useUpdateSlide';
import { copilotComponents } from '../copilot/components';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { useCopilotAction } from '@copilotkit/react-core';
import { Presentation } from '../copilot/Presentation';
import { Header } from '../copilot/HeaderPPTGen';
import { SlideNumberIndicator } from '../copilot/SlideNumberIndicator';
import { GenerateSlideButton } from '../copilot/GenerateSlideButton';
import { DeleteSlideButton } from '../copilot/DeleteSlideButton';
import { NavButton } from '../copilot/NavButton';
import { PerformResearchSwitch } from '../copilot/PerformResearchSwitch';
import { AddSlideButton } from '../copilot/AddSlideButton';
import { SpeakCurrentSlideButton } from '../copilot/SpeakCurrentSlideButton';
import { SlidePreview } from '../copilot/SlidePreview';
import { SlidePreviewCarousel } from '../copilot/SlidePreviewCarousel';
import { useSlideTransition } from '../../hooks/useSlideTransition';
import { PowerPointActions } from '../copilot/PowerPointActions';
import { usePowerPointState } from '../../hooks/usePowerPointState';
import useCopilotPollAction from '../copilot/useCopilotPollAction';
import PollComponent from '../copilot/PollComponent';
import { useMakeCopilotReadable } from '../../hooks/useMakeCopilotReadable';
import { useGenerateSpreadsheetAction } from '../../hooks/useGenerateSpreadsheetAction';
import { useGeneratePresentationAction } from '../../hooks/useGeneratePresentationAction';
import { SupabaseError, DataNotFoundError } from '../utils/error-classes/errorClasses';
type PollActionType = ReturnType<typeof useCopilotPollAction>;
type SpreadsheetData = {
  headers: string[];
  rows: (string | number)[][];
};

type PresentationSlide = {
  title: string;
  content: string[];
};

type PresentationData = {
  title: string;
  slides: PresentationSlide[];
};
type InChatRenderFunction = (args: any) => JSX.Element;

interface CopilotContextProviderProps {
  children?: ReactNode;
}

export interface FrontendAction<T> {
  name: string;
  description: string;
  parameters: T;
  handler: (args: T) => Promise<any>;
  render: (args: any) => string | JSX.Element;
}

type FrontendActionType = ReturnType<typeof useCopilotAction>;

export const InteleosContext = createContext<ExtendedCopilotContextParams | undefined>(undefined);

export const InteleosContextProvider: React.FC<CopilotContextProviderProps> = ({ children }) => {
  const [documentContent, setDocumentContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatInstructions, setChatInstructions] = useState('');
  const { toast } = useToast();
  const {
    currentSlide,
    direction,
    nextSlide,
    prevSlide,
    setCurrentSlide,
    setDirection,
    slides,
    setSlides,
    addSlide,
  } = useSlideTransition();
  const [initialSlides, setInitialSlides] = useState<SlideData[]>([]);
  const sendEmailAction = useEmailSendingAction();
  const generateChartAction = useGenerateChartAction();
  const scheduleAppointmentAction = useScheduleAppointmentAction();
  const researchAction = useResearchAction();
  const pollAction = useCopilotPollAction();
  const pollComponent = PollComponent;
  

  

  useEffect(() => {
    const fetchDocumentContent = async () => {
        try {
            const { data, error } = await supabase
                .from('inteleos-context-document')
                .select('content');

            if (error) throw new SupabaseError(error.message);
            if (!data?.length) throw new DataNotFoundError('No document content found');

            // Join array of content into single string
            setDocumentContent(data.map(row => row.content).join('\n'));
        } catch (error) {
            logger.error('Error fetching document content:', error);
        }
    };
    fetchDocumentContent();
}, [toast]);

  const document: DocumentPointer = {
    id: "2",
    name: "Inteleos Company Information",
    sourceApplication: "Notepad",
    iconImageUri: "/images/GoogleDocs.svg",
    getContents: () => documentContent,
  };

  useEffect(() => {
    // Define the myAppState object here
    const myAppState = {
      sendEmail: sendEmailAction,
      useAppendSlide: useAppendSlide,
      useUpdateSlide: useUpdateSlide,
      SlidePreview: SlidePreview,
      useGenerateChartAction: useGenerateChartAction,
      useGenerateSpreadsheetAction: useGenerateSpreadsheetAction,
      useGeneratePresentationAction: useGeneratePresentationAction,
      Presentation: Presentation,
      Header: Header,
      SlideNumberIndicator: SlideNumberIndicator,
      GenerateSlideButton: GenerateSlideButton,
      DeleteSlideButton: DeleteSlideButton,
      NavButton: NavButton,
      PerformResearchSwitch: PerformResearchSwitch,
      AddSlideButton: AddSlideButton,
      SpeakCurrentSlideButton: SpeakCurrentSlideButton,
      SlidePreviewCarousel: SlidePreviewCarousel,
      useSlideTransition: useSlideTransition,
      slides: slides,
      setSlides: setSlides,
      addSlide: addSlide,
      currentSlide: currentSlide,
      setCurrentSlide: setCurrentSlide,
      direction: direction,
      setDirection: setDirection,
      nextSlide: nextSlide,
      prevSlide: prevSlide,
      initialSlides: initialSlides,
      setInitialSlides: setInitialSlides,
      pollAction: pollAction,
      pollComponent: pollComponent,
      useCopilotPollAction: useCopilotPollAction,
    }
  }, [documentContent, sendEmailAction,
    generateChartAction, pollAction, pollComponent,
    addSlide,
    currentSlide,
    direction,
    nextSlide,
    prevSlide,
    slides,
    setSlides,
    initialSlides,
    setInitialSlides,
    setCurrentSlide,
    setDirection,
  ]);

  // Register the schedule appointment action
  useScheduleAppointmentAction();
  // Register the research action
  useResearchAction();

  const suggestionsContext: ExtendedCopilotContextParams = {
    showDevConsole: false,
    coagentStates: {},
    setCoagentStates: () => { },
    agentSession: { agentName: '' },
    setAgentSession: () => { },
    removeAction: () => { },
    coAgentStateRenders: {},
    setCoAgentStateRender: () => { },
    removeCoAgentStateRender: () => { },
    actions: {} as Record<string, FrontendAction<any>>,
    setAction: () => { },
    initialSlides: [],
    setInitialSlides: () => { },
    useAISuggestions: useAISuggestions,
    pollAction: () => pollAction,
    pollComponent: pollComponent,
    getChatCompletionFunctionDescriptions: () => [],
    generateSpreadsheet: async (data: SpreadsheetData, filename: string) => {
      logger.info("Generating spreadsheet");
      try {
        const worksheet = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
        logger.info("Worksheet created successfully");
        const workbook = XLSX.utils.book_new();
        logger.info("Workbook created successfully");
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        logger.info("Sheet appended successfully");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        logger.info("Spreadsheet generated successfully!");
        return "Spreadsheet generated successfully!";
      } catch (error) {
        logger.error("Error generating spreadsheet:", error);
        throw new Error("Failed to generate spreadsheet");
      }
    },

    generatePresentation: async (data: PresentationData, filename: string) => {
      logger.info("Generating presentation");
      try {
        const pres = new pptxgen();
        logger.info("Creating new presentation");
        pres.layout = 'LAYOUT_WIDE';

        // Title slide
        const titleSlide = pres.addSlide();
        logger.info("Adding title slide to presentation");
        titleSlide.addText(data.title, { x: 1, y: 1, w: '80%', h: 1, fontSize: 44, bold: true, align: 'center' });

        // Content slides
        data.slides.forEach((slide) => {
          logger.info("Adding slide to presentation");
          const newSlide = pres.addSlide();
          newSlide.addText(slide.title, { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true });
          slide.content.forEach((content, index) => {
            logger.info("Adding content to slide");
            newSlide.addText(content, { x: 0.5, y: 1.5 + index * 0.5, w: '90%', h: 0.5, fontSize: 18 });
          });
        });

        await pres.writeFile({ fileName: `${filename}.pptx` });
        logger.info("Presentation generated successfully!");
        return "Presentation generated successfully!";
      } catch (error) {
        logger.error("Error generating presentation:", error);
        throw new Error("Failed to generate presentation");
      }
    },
    ...copilotComponents,
    entryPoints: {},
    setEntryPoint: () => { },
    removeEntryPoint: () => { },
    chatComponentsCache: useRef<Record<string, string | InChatRenderFunction>>({}),
    getFunctionCallHandler: () => () => Promise.resolve(),
    setFunctionCallHandler: () => { },
    removeFunctionCallHandler: () => { },
    getChatCompletion: () => "",
    setChatCompletion: () => { },
    removeChatCompletion: () => { },
    getChatComponent: () => "",
    setChatComponent: () => { },
    removeChatComponent: () => { },
    getChatSuggestion: () => "",
    setChatSuggestion: () => { },
    removeChatSuggestion: () => { },
    messages: [] as Message[],
    setMessages: () => { },
    addContext: () => "",
    removeContext: () => { },
    getContextString: () => '',
    addDocumentContext: () => "",
    removeDocumentContext: () => "",
    getDocumentsContext: () => [],
    chatSuggestionConfiguration: {},
    addChatSuggestionConfiguration: () => { },
    removeChatSuggestionConfiguration: () => { },
    copilotApiConfig: { chatApiEndpoint: "", chatApiEndpointV2: "", headers: {}, body: {} },
    isLoading,
    setIsLoading,
    chatInstructions,
    setChatInstructions,
    sendEmail: sendEmailAction,
    Presentation: Presentation,
    Header: Header,
    SlideNumberIndicator: SlideNumberIndicator,
    GenerateSlideButton: GenerateSlideButton,
    DeleteSlideButton: DeleteSlideButton,
    NavButton: NavButton,
    PerformResearchSwitch: PerformResearchSwitch,
    AddSlideButton: AddSlideButton,
    SpeakCurrentSlideButton: SpeakCurrentSlideButton,
    copilotComponents: copilotComponents,
    XLSX: XLSX,
    pptxgen: pptxgen,
    useCopilotAction: useCopilotAction,
    SlidePreviewCarousel: SlidePreviewCarousel,
    useSlideTransition: useSlideTransition,
    PowerPointActions: PowerPointActions,
    SlidePreview: SlidePreview,
    usePowerPointState: usePowerPointState,
    currentSlide: currentSlide,
    setCurrentSlide: setCurrentSlide,
    direction,
    setDirection,
    nextSlide,
    prevSlide,
    slides,
    setSlides,
    addSlide,
    useCopilotPollAction,
    useAppendSlide,
    useUpdateSlide,
    useGenerateChartAction,
    useGenerateSpreadsheetAction,
    useGeneratePresentationAction,
    useScheduleAppointmentAction,
    useResearchAction,
    appendSlide: useAppendSlide,
  };

  // Register the schedule appointment action
  useScheduleAppointmentAction();
  // Register the research action
  useResearchAction();
  useSlideTransition();
  // useEnhancedCopilotSuggestions();
  useAISuggestions({
    instructions: "Provide suggestions based on the user's context and the next-best-actions that logically follow.",
    minSuggestions: 4,
    maxSuggestions: 6,
    className: 'suggestion-button text-white-important hover:text-white-important focus:text-white-important',
  });

  useAppendSlide({
    setSlides: () => { },
    setCurrentSlideIndex: () => { },
    slides: [],
  });
  useUpdateSlide({
    partialUpdateSlide: () => { },
  });
  // Add this to the CopilotAuthContextProvider
  useGenerateChartAction();

  return (
    <InteleosContext.Provider value={suggestionsContext}>
      {children}
    </InteleosContext.Provider>
  );
};

export const useInteleos = () => {
  const context = useContext(InteleosContext);
  if (context === undefined) {
    throw new Error('useInteleos must be used within a InteleosContextProvider');
  }
  return context;
};