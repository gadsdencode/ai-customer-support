// /hooks/useMakeCopilotReadable.ts
// import { CopilotReadableOptions } from '@/app/types/copilot';
import { useCopilotReadable } from '@copilotkit/react-core';
import logger from '@/app/utils/logger';
import { CopilotReadableError } from '@/app/utils/error-classes/errorClasses';
import { useContext, useEffect } from 'react';
import { CopilotAuthContext } from '@/app/contexts/CopilotContext';
import { createReadableConfigs } from '@/config/copilotReadableConfigs';

export const useMakeCopilotReadable = () => {
  const contextValues = useContext(CopilotAuthContext) as ExtendedCopilotContextParams;

  // Move useCopilotReadable to the top level
  const copilotReadable = useCopilotReadable;

  useEffect(() => {
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
    };

    const readableConfigs = createReadableConfigs(contextValues, myAppState);

    // Process all configurations
    readableConfigs.forEach(config => {
      try {
        copilotReadable({
          description: config.description,
          value: config.value,
          categories: config.categories,
        });
      } catch (error) {
        logger.error(
          new CopilotReadableError(`Failed to make ${config.description} readable`)
        );
        logger.error(error instanceof Error ? error.message : String(error));
      }
    });
  }, [contextValues, copilotReadable]);
};

// Alternative approach using multiple useCopilotReadable calls
export const useMakeCopilotReadable2 = () => {
  const contextValues = useContext(CopilotAuthContext) as ExtendedCopilotContextParams;
  
  // Separate hook calls for each configuration
  const documentReadable = useCopilotReadable({
    description: "Inteleos company information and CX data",
    value: contextValues.documentContent,
    categories: ['documentContext'],
  });

  const appContextReadable = useCopilotReadable({
    description: "Application context information and tools",
    value: {
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
    },
    categories: ['appContext'],
  });

  useEffect(() => {
    // Handle any side effects if needed
    if (documentReadable.error) {
      logger.error(new CopilotReadableError("Failed to make document readable"));
    }
    if (appContextReadable.error) {
      logger.error(new CopilotReadableError("Failed to make app context readable"));
    }
  }, [documentReadable.error, appContextReadable.error]);
};