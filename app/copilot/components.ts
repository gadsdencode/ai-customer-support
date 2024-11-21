// /app/copilot/components.ts

import { Presentation } from './Presentation';
import { Slide } from './Slide';
import { Header } from './HeaderPPTGen';
import { SlideNumberIndicator } from './SlideNumberIndicator';
import { GenerateSlideButton } from './GenerateSlideButton';
import { DeleteSlideButton } from './DeleteSlideButton';
import { NavButton } from './NavButton';
import { PerformResearchSwitch } from './PerformResearchSwitch';
import { AddSlideButton } from './AddSlideButton';
import { SpeakCurrentSlideButton } from './SpeakCurrentSlideButton';
import { SlidePreview } from './SlidePreview';
import { SlidePreviewCarousel } from './SlidePreviewCarousel';
import { useSlideTransition } from '../hooks/useSlideTransition';
import { VirtualizedThumbnails } from './VirtualizedThumbnails';
import { SlideThumbnail } from './SlideThumbnail';
import { useMakeCopilotReadable } from './useCopilotReadable';
import useCopilotPollAction from './useCopilotPollAction';
import PollComponent from './PollComponent';

export const copilotComponents = {
  Presentation,
  Slide,
  Header,
  SlideNumberIndicator,
  GenerateSlideButton,
  DeleteSlideButton,
  NavButton,
  PerformResearchSwitch,
  AddSlideButton,
  SpeakCurrentSlideButton,
  SlidePreview,
  SlidePreviewCarousel,
  useSlideTransition,
  VirtualizedThumbnails,
  SlideThumbnail,
  useCopilotPollAction,
  PollComponent,
  useMakeCopilotReadable,
};