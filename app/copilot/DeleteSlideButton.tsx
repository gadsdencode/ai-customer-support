/* eslint-disable @typescript-eslint/no-unused-vars */
import { SlideModel } from "../types/copilot";
import { ActionButton } from "./ActionButton";
import { FcFullTrash } from "react-icons/fc";

interface DeleteSlideButtonProps {
  currentSlideIndex: number;
  setCurrentSlideIndex: (fn: (i: number) => number) => void;
  slides: SlideModel[];
  setSlides: (fn: (slides: SlideModel[]) => SlideModel[]) => void;
}

export function DeleteSlideButton({
  currentSlideIndex,
  setCurrentSlideIndex,
  slides,
  setSlides,
}: DeleteSlideButtonProps) {
  return (
    <ActionButton
      disabled={slides.length == 1}
      onClick={() => {
        // delete the current slide
        setSlides((slides) => [
          ...slides.slice(0, currentSlideIndex),
          ...slides.slice(currentSlideIndex + 1),
        ]);
        setCurrentSlideIndex((i) => 0);
      }}
    >
      <FcFullTrash className="h-5 w-5" />
    </ActionButton>
  );
}
