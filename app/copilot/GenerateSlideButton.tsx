import { CopilotContextParams, CopilotTask } from "@copilotkit/react-core";
import { useState } from "react";
import { ActionButton } from "./ActionButton";
import { FcMindMap } from "react-icons/fc";

interface GenerateSlideButtonProps {
  context: CopilotContextParams;
}

export function GenerateSlideButton({ context }: GenerateSlideButtonProps) {
  const [isGeneratingSlide, setIsGeneratingSlide] = useState(false);
  return (
    <ActionButton
      inProgress={isGeneratingSlide}
      onClick={async () => {
        try {
          const slideContent = prompt("What should the new slide be about?");
          if (slideContent === null) {
            return;
          }
          setIsGeneratingSlide(true);
          const generateSlideTask = new CopilotTask({
            instructions:
              "Make a new slide given this user input: " +
              slideContent +
              "\n DO NOT carry out research",
          });
          await generateSlideTask.run(context);
        } finally {
          setIsGeneratingSlide(false);
        }
      }}
    >
      <FcMindMap className={"h-5 w-5"} />
    </ActionButton>
  );
}
