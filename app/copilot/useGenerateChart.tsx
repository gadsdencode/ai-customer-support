/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Chart from 'chart.js/auto';
import { useCopilotAction } from "@copilotkit/react-core";
import { useCopilotReadable } from "@copilotkit/react-core";
export default function useGenerateChartAction() {
  useCopilotAction({
    name: "generateChart",
    description: "Generate a chart based on provided data",
    parameters: [
      {
        name: "data",
        type: "object",
        description: "Chart data including labels and datasets",
        attributes: [
          { name: "labels", type: "string[]", description: "X-axis labels" },
          {
            name: "datasets",
            type: "object[]",
            description: "Array of dataset objects",
            attributes: [
              { name: "label", type: "string", description: "Dataset label" },
              { name: "data", type: "number[]", description: "Dataset values" },
            ],
          },
        ],
      },
      {
        name: "type",
        type: "string",
        description: "Type of chart (e.g., 'bar', 'line', 'pie')",
      },
    ],
    handler: async ({ data, type }: { data: any; type: string }) => {
      const canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
      
      new Chart(canvas, {
        type: type as any,
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Generated Chart'
            }
          }
        },
      });

      return "Chart generated successfully!";
    },
    render: ({ status }: { status: string }) => {
      if (status === "inProgress") return "Preparing to generate chart...";
      if (status === "executing") return "Generating chart...";
      if (status === "complete") return "Chart generated successfully!";
      return "";
    },
  });
};