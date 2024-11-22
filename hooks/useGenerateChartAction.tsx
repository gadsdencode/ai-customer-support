/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useMemo } from 'react';
import { useCopilotAction, ActionRenderProps } from '@copilotkit/react-core';
import { Parameter } from '@copilotkit/shared';

interface ChartData {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  };
}

type ChartParameters = [
  {
    name: 'data';
    type: 'object';
    description: 'Chart data including title, type and datasets';
    attributes: [
      { name: 'title'; type: 'string'; description: 'Chart title' },
      { name: 'type'; type: 'string'; description: 'Chart type (line, bar, or pie)' },
      { name: 'data'; type: 'object'; description: 'Chart datasets' }
    ];
  }
];

export function useGenerateChartAction() {
  return useCopilotAction({
    name: 'generateChart',
    description: 'Generate a chart visualization',
    parameters: [
      {
        name: 'data',
        type: 'object',
        description: 'Chart data including title, type and datasets',
        attributes: [
          { name: 'title', type: 'string', description: 'Chart title' },
          { name: 'type', type: 'string', description: 'Chart type (line, bar, or pie)' },
          { name: 'data', type: 'object', description: 'Chart datasets' }
        ]
      }
    ] as Parameter[],
    handler: async (args: { [x: string]: string | number | boolean | object | any[] }) => {
      // Handler implementation
      if ('data' in args) {
        return args.data as ChartData;
      }
      throw new Error('Invalid arguments');
    },
    render: (props: ActionRenderProps<ChartParameters>) => {
      if (props.status === 'complete' && props.args?.data) {
        return (
          <div key="chart-complete">
            <div>
              <p className="text-green-500 text-center text-lg font-bold border-2 border-green-500 p-2 rounded-md m-2 bg-green-500/20">
                Chart generated successfully!
              </p>
            </div>
            <div className="chart-container">
              {/* Chart rendering component would go here */}
              <h3>{props.args.data.title}</h3>
            </div>
          </div>
        ) as React.ReactElement;
      }
      return "" as const;
    }
  });
}