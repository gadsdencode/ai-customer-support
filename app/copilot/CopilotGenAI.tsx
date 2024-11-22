// src/components/CopilotGenAI.tsx

import React, { useState, useCallback } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Enhanced types for our data structures
type SpreadsheetData = {
  headers: string[];
  rows: (string | number)[][];
};

type SpreadsheetStyle = {
  headerColor: string;
  headerFontColor: string;
  cellColor: string;
  cellFontColor: string;
};

type PresentationSlide = {
  title: string;
  content: string[];
};

type PresentationData = {
  title: string;
  slides: PresentationSlide[];
};

type PresentationStyle = {
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
};

type FileFormat = 'xlsx' | 'csv' | 'pptx' | 'pdf';

const CopilotGenAI: React.FC = () => {
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback((value: number) => {
    setProgress(value);
  }, []);

  const generateSpreadsheet = async (
    data: SpreadsheetData,
    filename: string,
    style: SpreadsheetStyle,
    format: FileFormat
  ) => {
    try {
      const worksheet = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);

      // Apply custom styles
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: R };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          if (!worksheet[cellRef]) continue;
          
          worksheet[cellRef].s = {
            fill: { fgColor: { rgb: R === 0 ? style.headerColor.replace('#', '') : style.cellColor.replace('#', '') } },
            font: { color: { rgb: R === 0 ? style.headerFontColor.replace('#', '') : style.cellFontColor.replace('#', '') } }
          };
        }
        updateProgress((R / range.e.r) * 100);
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      if (format === 'xlsx') {
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      } else if (format === 'csv') {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
      }

      return `${format.toUpperCase()} file generated successfully!`;
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()} file:`, error);
      throw new Error(`Failed to generate ${format.toUpperCase()} file`);
    }
  };

  const generatePresentation = async (
    data: PresentationData,
    filename: string,
    style: PresentationStyle,
    format: FileFormat
  ) => {
    try {
      if (format === 'pptx') {
        const pres = new pptxgen();
  
        // Define the slide master using Tailwind custom colors
        pres.defineSlideMaster({
          title: 'MASTER_SLIDE',
          background: { color: style.theme === 'dark' ? 'rgb(116,148,204)' : 'rgb(12, 76, 148)' },
          objects: [
            {
              rect: {
                x: 0,
                y: 0,
                w: '100%',
                h: '10%',
                fill: { color: style.theme === 'dark' ? 'rgb(244,116,52)' : 'rgb(244,100,35)' }
              }
            }
          ]
        });
  
        // Add title slide using the defined slide master
        const titleSlide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
        titleSlide.addText(data.title, {
          x: 1,
          y: 1,
          w: '80%',
          h: 1,
          fontSize: 44,
          bold: true,
          align: 'center',
          color: style.theme === 'dark' ? '#FFFFFF' : '#000000',
          fontFace: style.fontFamily
        });
  
        // Add content slides
        data.slides.forEach((slide, index) => {
          const newSlide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
          newSlide.addText(slide.title, {
            x: 0.5,
            y: 0.5,
            w: '90%',
            h: 1,
            fontSize: 32,
            bold: true,
            color: style.theme === 'dark' ? '#FFFFFF' : '#000000',
            fontFace: style.fontFamily
          });
          slide.content.forEach((content, contentIndex) => {
            newSlide.addText(content, {
              x: 0.5,
              y: 1.5 + contentIndex * 0.5,
              w: '90%',
              h: 0.5,
              fontSize: 18,
              color: style.theme === 'dark' ? '#FFFFFF' : '#000000',
              fontFace: style.fontFamily
            });
          });
          updateProgress((index / data.slides.length) * 100);
        });
  
        await pres.writeFile({ fileName: `${filename}.pptx` });
      } else if (format === 'pdf') {
        const doc = new jsPDF();
        doc.setFont(style.fontFamily);
        doc.setTextColor(style.theme === 'dark' ? 255 : 0);
  
        // Title page
        doc.setFontSize(24);
        doc.text(data.title, 105, 20, { align: 'center' });
  
        data.slides.forEach((slide, index) => {
          if (index > 0) doc.addPage();
          doc.setFontSize(18);
          doc.text(slide.title, 20, 20);
          doc.setFontSize(12);
          slide.content.forEach((content, contentIndex) => {
            doc.text(content, 20, 40 + contentIndex * 10);
          });
          updateProgress((index / data.slides.length) * 100);
        });
  
        doc.save(`${filename}.pdf`);
      }
  
      return `${format.toUpperCase()} file generated successfully!`;
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()} file:`, error);
      throw new Error(`Failed to generate ${format.toUpperCase()} file`);
    }
  };
    

  useCopilotAction({
    name: "generateSpreadsheet",
    description: "Generate a spreadsheet based on provided data with custom styling",
    parameters: [
      {
        name: "data",
        type: "object",
        description: "Spreadsheet data including headers and rows",
        attributes: [
          { name: "headers", type: "string[]", description: "Column headers" },
          { name: "rows", type: "object[]", description: "Data rows" },
        ],
      },
      {
        name: "filename",
        type: "string",
        description: "Name of the file to be generated",
      },
      {
        name: "style",
        type: "object",
        description: "Custom styling for the spreadsheet",
        attributes: [
          { name: "headerColor", type: "string", description: "Header background color" },
          { name: "headerFontColor", type: "string", description: "Header font color" },
          { name: "cellColor", type: "string", description: "Cell background color" },
          { name: "cellFontColor", type: "string", description: "Cell font color" },
        ],
      },
      {
        name: "format",
        type: "string",
        description: "File format (xlsx or csv)",
        enum: ["xlsx", "csv"],
      },
    ],
    handler: async ({ data, filename, style, format }: { 
      data: SpreadsheetData; 
      filename: string; 
      style: SpreadsheetStyle;
      format: FileFormat;
    }) => {
      return generateSpreadsheet(data, filename, style, format);
    },
    render: ({ status }: { status: string }) => {
      if (status === "inProgress") return (
        <div className="text-custom-blue dark:text-custom-blue-dark">
          Preparing to generate spreadsheet... {progress.toFixed(0)}%
        </div>
      );
      if (status === "executing") return (
        <div className="text-custom-orange dark:text-custom-orange-dark">
          Generating spreadsheet... {progress.toFixed(0)}%
        </div>
      );
      if (status === "complete") return (
        <div className="text-green-500">Spreadsheet generated successfully!</div>
      );
      return <></>;  // Return an empty fragment instead of null
    },
  });

  useCopilotAction({
    name: "generatePresentation",
    description: "Generate a presentation based on provided data with custom styling",
    parameters: [
      {
        name: "data",
        type: "object",
        description: "Presentation data including title and slides",
        attributes: [
          { name: "title", type: "string", description: "Presentation title" },
          {
            name: "slides",
            type: "object[]",
            description: "Array of slide objects",
            attributes: [
              { name: "title", type: "string", description: "Slide title" },
              { name: "content", type: "string[]", description: "Slide content as array of strings" },
            ],
          },
        ],
      },
      {
        name: "filename",
        type: "string",
        description: "Name of the file to be generated",
      },
      {
        name: "style",
        type: "object",
        description: "Custom styling for the presentation",
        attributes: [
          { name: "theme", type: "string", description: "Presentation theme (light or dark)", enum: ["light", "dark"] },
          { name: "primaryColor", type: "string", description: "Primary color" },
          { name: "secondaryColor", type: "string", description: "Secondary color" },
          { name: "fontFamily", type: "string", description: "Font family" },
        ],
      },
      {
        name: "format",
        type: "string",
        description: "File format (pptx or pdf)",
        enum: ["pptx", "pdf"],
      },
    ],
    handler: async ({ data, filename, style, format }: { 
      data: PresentationData; 
      filename: string;
      style: PresentationStyle;
      format: FileFormat;
    }) => {
      return generatePresentation(data, filename, style, format);
    },
    render: ({ status }: { status: string }) => {
      if (status === "inProgress") return (
        <div className="text-custom-blue dark:text-custom-blue-dark">
          Preparing to generate presentation... {progress.toFixed(0)}%
        </div>
      );
      if (status === "executing") return (
        <div className="text-custom-orange dark:text-custom-orange-dark">
          Generating presentation... {progress.toFixed(0)}%
        </div>
      );
      if (status === "complete") return (
        <div className="text-green-500 text-center text-sm border-2 border-green-500 p-2 rounded-md">Presentation generated successfully!</div>
      );
      return <></>; // Return an empty fragment instead of null
    },
  });

  return null; // This component doesn't render anything visible
};

export default CopilotGenAI;