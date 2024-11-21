import { useCopilotAction } from "@copilotkit/react-core";
import * as XLSX from 'xlsx';
import logger from '@/app/utils/logger';
import { SpreadsheetData } from '@/app/types/copilot';
// /hooks/useGenerateSpreadsheetAction.ts
export const useGenerateSpreadsheetAction = () => {
    // Move hook to top level
    const action = useCopilotAction({
      name: "generateSpreadsheet",
      description: "Generate an Excel spreadsheet based on provided data",
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
      ],
      handler: async ({ data, filename }: { data: SpreadsheetData; filename: string }) => {
        logger.info("Generating spreadsheet");
        try {
          if (!Array.isArray(data.rows) || data.rows.length === 0) {
            throw new Error("Invalid or empty data rows");
          }
          const worksheet = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          XLSX.writeFile(workbook, `${filename}.xlsx`);   

          return "Spreadsheet generated successfully!";
        } catch (error) {
          logger.error("Error generating spreadsheet:", error);
          throw new Error("Failed to generate spreadsheet: " + (error instanceof Error ? error.message : String(error)));
        }
      },
      render: ({ status }: { status: string }) => {
        if (status === "inProgress") return "Preparing to generate spreadsheet...";
        if (status === "executing") return "Generating spreadsheet...";
        if (status === "complete") return "Spreadsheet generated successfully!";
        return "";
      },
    });
  
    return action;
  };