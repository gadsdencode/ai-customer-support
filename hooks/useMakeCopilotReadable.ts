/* eslint-disable @typescript-eslint/no-explicit-any */
// /hooks/useMakeCopilotReadable.ts
// import { CopilotReadableOptions } from '@/app/types/copilot';
import { useCopilotReadable } from '@copilotkit/react-core';
import logger from '@/app/utils/logger';
import { CopilotReadableError } from '@/app/utils/error-classes/errorClasses';
import { useContext, useEffect } from 'react';
// import { CopilotFeaturesContext } from '@/app/contexts/CopilotFeaturesContext';
import { InteleosContext } from '@/app/contexts/InteleosContext';
import { createReadableConfigs } from '@/app/configs/copilotReadableConfigs';
import { ExtendedCopilotContextParams } from '@/app/types/copilot';
import useAppendSlide from '@/app/copilot/useAppendSlide';
import { Presentation } from '@/app/copilot/Presentation';
import { Header } from '@/app/copilot/HeaderPPTGen';
import { SlideNumberIndicator } from '@/app/copilot/SlideNumberIndicator';
import { GenerateSlideButton } from '@/app/copilot/GenerateSlideButton';
import { DeleteSlideButton } from '@/app/copilot/DeleteSlideButton';
import { NavButton } from '@/app/copilot/NavButton';
import { PerformResearchSwitch } from '@/app/copilot/PerformResearchSwitch';
import { AddSlideButton } from '@/app/copilot/AddSlideButton';
import { SpeakCurrentSlideButton } from '@/app/copilot/SpeakCurrentSlideButton';
import { SlidePreview } from '@/app/copilot/SlidePreview';
import { SlidePreviewCarousel } from '@/app/copilot/SlidePreviewCarousel';
import { useSlideTransition } from '@/hooks/useSlideTransition';
// import { PowerPointActions } from '@/app/copilot/PowerPointActions';
import { usePowerPointState } from '@/hooks/usePowerPointState';
import useCopilotPollAction from '@/app/copilot/useCopilotPollAction';
import PollComponent from '@/app/copilot/PollComponent';
import { useGenerateSpreadsheetAction } from '@/hooks/useGenerateSpreadsheetAction';
import { useGeneratePresentationAction } from '@/hooks/useGeneratePresentationAction';
import useGenerateChartAction from '@/app/copilot/useGenerateChart';
import useUpdateSlide from '@/app/copilot/useUpdateSlide';

export const useMakeCopilotReadable = () => {
  const contextValues = useContext(InteleosContext) as ExtendedCopilotContextParams;
  const { slides, setSlides, addSlide, currentSlide, setCurrentSlide, direction, setDirection, nextSlide, prevSlide, initialSlides } = usePowerPointState();

  // Move useCopilotReadable to the top level
  const copilotReadable = useCopilotReadable({
    description: 'Inteleos company information and CX data',
    value: contextValues.addDocumentContext,
    categories: ['documentContext'],
  }) as unknown as (config: {
    description: string;
    value: any;
    categories: string[];
  }) => void;

  useEffect(() => {
    const myAppState = {
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
        pollAction: useCopilotPollAction,
        pollComponent: PollComponent,
        useCopilotPollAction: useCopilotPollAction,
    };

    const readableConfigs = createReadableConfigs(contextValues, myAppState);

    // Process all configurations
    readableConfigs.forEach(config => {
      try {
        if (typeof copilotReadable === 'function') {
          copilotReadable({
            description: config.description,
            value: config.value,
            categories: config.categories,
          });
        } else {
          logger.error('copilotReadable is not a function');
        }
      } catch (error) {
        logger.error(
          new CopilotReadableError(`Failed to make ${config.description} readable`)
        );
        logger.error(error instanceof Error ? error.message : String(error));
      }
    });
  }, [contextValues, copilotReadable, slides, setSlides, addSlide, currentSlide, setCurrentSlide, direction, setDirection, nextSlide, prevSlide, initialSlides]);
};

// Alternative approach using multiple useCopilotReadable calls
export const useMakeCopilotReadable2 = () => {
  const contextValues = useContext(InteleosContext) as ExtendedCopilotContextParams;
  
  // Separate hook calls for each configuration
  const documentReadable = useCopilotReadable({
    description: "Inteleos company information and CX data",
    value: contextValues.addDocumentContext,
    categories: ['documentContext'],
  });

  const appContextReadable = useCopilotReadable({
    description: "Application context information and tools",
    value: {
      sendEmail: contextValues.sendEmail,
      useAppendSlide: contextValues.useAppendSlide,
      useUpdateSlide: contextValues.useUpdateSlide,
      SlidePreview: SlidePreview,
      useGenerateChartAction: contextValues.useGenerateChartAction,
      useGenerateSpreadsheetAction: contextValues.useGenerateSpreadsheetAction,
      useGeneratePresentationAction: contextValues.useGeneratePresentationAction,
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
      slides: contextValues.slides,
      setSlides: contextValues.setSlides,
      addSlide: contextValues.addSlide,
      currentSlide: contextValues.currentSlide,
      setCurrentSlide: contextValues.setCurrentSlide,
      direction: contextValues.direction,
      setDirection: contextValues.setDirection,
      nextSlide: contextValues.nextSlide,
      prevSlide: contextValues.prevSlide,
      initialSlides: contextValues.initialSlides,
      pollAction: contextValues.pollAction,
      pollComponent: contextValues.pollComponent,
      useCopilotPollAction: contextValues.useCopilotPollAction,
    },
    categories: ['appContext'],
  });

  useEffect(() => {
    // Handle any side effects if needed
    if (documentReadable && (documentReadable as any).error) {
      logger.error(new CopilotReadableError("Failed to make document readable"));
    }
    if (appContextReadable && (appContextReadable as any).error) {
      logger.error(new CopilotReadableError("Failed to make app context readable"));
    }
  }, [documentReadable, appContextReadable]);
};