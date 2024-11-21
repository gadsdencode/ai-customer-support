// /app/copilot/useUpdateSlide.tsx

import { useCopilotAction } from "@copilotkit/react-core";
import { SlideModel } from "../../types";
import { SlidePreview } from "./SlidePreview";

interface UpdateSlideParams {
  partialUpdateSlide: (partialSlide: Partial<SlideModel>) => void;
}

export default function useUpdateSlide({
  partialUpdateSlide,
}: UpdateSlideParams) {
  useCopilotAction({
    name: "updateSlide",
    description: "Update the current slide.",
    parameters: [
      {
        name: "content",
        description:
          "The content of the slide. Should generally consist of a few bullet points.",
      },
      {
        name: "backgroundImageUrl",
        description:
          "The url of the background image for the slide. Use the getImageUrl tool to retrieve a URL for a topic.",
      },
      {
        name: "spokenNarration",
        description:
          "The spoken narration for the slide. This is what the user will hear when the slide is shown.",
      },
    ],
    handler: async ({ content, backgroundImageUrl, spokenNarration }) => {
      partialUpdateSlide({
        content,
        backgroundImageUrl,
        spokenNarration,
      });
    },
    render: (props) => {
      return (
        <SlidePreview 
          content={props.args.content || ""}
          spokenNarration={props.args.spokenNarration}
          done={props.status === "complete"}
          onNavigate={() => {}}
          currentSlide={0}
          direction={0}
          nextSlide={() => {}}
          prevSlide={() => {}}
          addSlide={() => {}}
          backgroundImageUrl={props.args.backgroundImageUrl}
          currentSlideIndex={0}
          setCurrentSlide={() => {}}
          setDirection={() => {}}
          slides={[]}
          title={""}
        />
      );
    },
  });
}