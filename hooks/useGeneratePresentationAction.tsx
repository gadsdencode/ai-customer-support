/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /hooks/useGeneratePresentationAction.ts

import { useCopilotAction } from '@copilotkit/react-core'; // Replace with the actual path
import pptxgen from 'pptxgenjs'; // Ensure pptxgenjs is installed: npm install pptxgenjs
import SlidePreviewCarousel from '../app/copilot/SlidePreviewCarousel'; // Replace with the actual path
import logger from '../utils/logger'; // Replace with your logging utility

// Define the structure of a single slide
type SlideData = {
    title: string;
    content: string[];
  };
  
  // Define the structure of the entire presentation data
  type PresentationData = {
    title: string;
    slides: SlideData[];
  };
  
  // Define the hook
  export const useGeneratePresentationAction = (
    slides: SlideData[],
    currentSlide: number,
    direction: number,
    nextSlide: () => void,
    prevSlide: () => void
  ) => {
    const action = useCopilotAction(
      {
        name: "generatePresentation",
        description: "Generate a PowerPoint presentation based on provided data",
        parameters: [
          {
            name: "data",
            type: "object",
            description: "Presentation data including title and slides",
            attributes: [
              {
                name: "title",
                type: "string",
                description: "Presentation title",
              },
              {
                name: "slides",
                type: "object[]",
                description: "Array of slide objects",
                attributes: [
                  {
                    name: "title",
                    type: "string",
                    description: "Slide title",
                  },
                  {
                    name: "content",
                    type: "string[]",
                    description: "Slide content as array of strings",
                  },
                ],
              },
            ],
          },
          {
            name: "filename",
            type: "string",
            description: "Name of the file to be generated",
          },
        ],
        handler: async ({ data, filename }: { data: PresentationData; filename: string }) => {
          logger.info("Generating presentation");
          try {
            const pres = new pptxgen();
            pres.layout = 'LAYOUT_WIDE';
  
            // Add title slide
            const titleSlide = pres.addSlide();
            titleSlide.addText(data.title, {
              x: 1,
              y: 1,
              w: '80%',
              h: 1,
              fontSize: 44,
              bold: true,
              align: 'center',
            });
  
            // Add each slide
            data.slides.forEach((slide) => {
              const newSlide = pres.addSlide();
              newSlide.addText(slide.title, {
                x: 0.5,
                y: 0.5,
                w: '90%',
                h: 1,
                fontSize: 32,
                bold: true,
              });
              slide.content.forEach((content, index) => {
                newSlide.addText(content, {
                  x: 0.5,
                  y: 1.5 + index * 0.5,
                  w: '90%',
                  h: 0.5,
                  fontSize: 18,
                });
              });
            });
  
            // Generate and save the presentation file
            await pres.writeFile({ fileName: `${filename}.pptx` });
            logger.info("Presentation generated successfully");
            return "Presentation generated successfully!";
          } catch (error) {
            logger.error("Error generating presentation:", error);
            throw new Error("Failed to generate presentation");
          }
        },
        render: ({ status, args }: { status: string; args: any }) => {
          if (status === "complete") {
            return (
              <div>
                <div>
                  <p className="text-green-500 text-center text-lg font-bold border-2 border-green-500 p-2 rounded-md m-2 bg-green-500/20">
                    Presentation generated successfully!
                  </p>
                </div>
                <SlidePreviewCarousel
                  slides={args.data.slides}
                  backgroundImageUrl={'/images/APCA_transparent.png'}
                />
              </div>
            );
          }
          return null;
        },
      },
      [] // Empty dependencies array ensures the action is only created once
    );
  
    return action;
  };