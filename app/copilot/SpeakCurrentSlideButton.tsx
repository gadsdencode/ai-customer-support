// /app/copilot/SpeakCurrentSlideButton.tsx

import { useState } from "react";
import { ActionButton } from "./ActionButton";
import { FcSpeaker } from "react-icons/fc";
import { resetGlobalAudio, speak } from "../utils/globalAudio";

interface SpeakCurrentSlideButtonProps {
  spokenNarration: string;
}

export function SpeakCurrentSlideButton({
  spokenNarration,
}: SpeakCurrentSlideButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  return (
    <ActionButton inProgress={isSpeaking}>
      <FcSpeaker
        className="h-5 w-5"
        onClick={async () => {
          resetGlobalAudio();
          try {
            setIsSpeaking(true);
            await speak(spokenNarration);
          } finally {
            setIsSpeaking(false);
          }
        }}
      />
    </ActionButton>
  );
}
