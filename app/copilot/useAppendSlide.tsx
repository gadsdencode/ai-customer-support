/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/copilot/useAppendSlide.tsx

import { useCopilotAction, ActionRenderProps } from "@copilotkit/react-core";
import { SlideModel } from "@/app/types/copilot";
import { SlidePreview } from "./SlidePreview";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Parameter } from "@copilotkit/shared";

interface AppendSlideParams {
  setSlides: Dispatch<SetStateAction<SlideModel[]>>;
  setCurrentSlideIndex: Dispatch<SetStateAction<number>>;
  slides: SlideModel[];
}

interface SlideContent {
  content: string;
  backgroundImageUrl: string;
  spokenNarration: string;
  title?: string;
}

export default function useAppendSlide({
  setSlides,
  setCurrentSlideIndex,
  slides,
}: AppendSlideParams): void {
  const handleAppendSlide = useCallback(
    ({ content, backgroundImageUrl, spokenNarration, title }: SlideContent) => {
      const newSlide: SlideModel = {
        content,
        backgroundImageUrl,
        spokenNarration,
        title: title || "",
      };

      setSlides((prevSlides) => {
        const updatedSlides = [...prevSlides, newSlide];
        setCurrentSlideIndex(updatedSlides.length - 1);
        return updatedSlides;
      });
    },
    [setSlides, setCurrentSlideIndex]
  );

  useCopilotAction({
    name: "appendSlide",
    description: "Add a new slide to the presentation",
    parameters: [
      {
        name: "content",
        type: "string",
        description: "The content of the slide",
        required: true,
      },
      {
        name: "backgroundImageUrl",
        type: "string",
        description: "The background image URL",
        required: true,
      },
      {
        name: "spokenNarration",
        type: "string",
        description: "Narration for the slide",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "Title of the slide",
        required: false,
      },
    ] as Parameter[],

    handler: handleAppendSlide as any,
    render: (props: ActionRenderProps) => {
      const { content, backgroundImageUrl, spokenNarration, title } = props.args[0] as SlideContent;
      const isDone = props.status === "complete";

      return (
        <SlidePreview 
          content={content || ''}
          spokenNarration={spokenNarration || ''}
          done={isDone}
          currentSlideIndex={slides.length}
          direction={0}
          backgroundImageUrl={backgroundImageUrl || ""}
          onNavigate={() => {}}
          currentSlide={slides.length}
          nextSlide={() => {}}
          prevSlide={() => {}}
          setCurrentSlide={() => {}}
          setDirection={() => {}}
          addSlide={() => {}}
          title={title || ''}
          slides={slides as any}
        />
      );
    },
  });
}