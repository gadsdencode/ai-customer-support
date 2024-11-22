/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useCopilotReadable } from "@copilotkit/react-core";

interface CopilotReadableOptions {
  description: string;
  value: any;
  parentId?: string;
  categories?: string[];
  convert?: (description: string, value: any) => string;
}

interface CopilotReadableProps {
  options: CopilotReadableOptions;
}

export const CopilotReadableComponent: React.FC<CopilotReadableProps> = ({ options }) => {
  useCopilotReadable(options);
  return null;
};

export const useMakeCopilotReadable = (options: CopilotReadableOptions) => {
  return React.createElement(CopilotReadableComponent, { options });
};