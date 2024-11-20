// CopilotFeaturesProvider.tsx
'use client'

import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { CopilotFeaturesContext } from '../contexts/CopilotFeaturesContext';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useToast } from "@/hooks/use-toast";

interface CopilotFeaturesProviderProps {
  children: ReactNode;
}

export function CopilotFeaturesProvider({ children }: CopilotFeaturesProviderProps) {
  const { toast } = useToast();
  // Application state
  const actions = useMemo(() => ({}), []);
  const suggestions = useMemo(() => [], []);

  const [appState, setAppState] = useState({
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Developer',
      avatar: '/user-avatar.png',
      company: 'Acme Inc.',
      location: 'New York, NY',
      department: 'Engineering',
      industry: 'Technology',
      personalInterests: ['Coding', 'Reading', 'Traveling', 'Podcasts'],
      professionalInterests: ['Software Development', 'Machine Learning', 'AI', 'Next.js', 'Tailwind CSS', 'TypeScript', 'HTML', 'CSS', 'Git', 'Docker', 'Kubernetes', 'Cloud', 'AWS', 'Azure', 'Google Cloud', 'OpenAI', 'CopilotKit', 'React UI', 'Framer Motion', 'GSAP', 'Lucide React', 'Tanstack Query', 'Tanstack Router', 'Tanstack Table', 'Tanstack Pagination', 'Tanstack Dialog', 'Tanstack Tooltip', 'Tanstack Popover', 'Tanstack Menu', 'Tanstack Accordion', 'Tanstack Tabs', 'Tanstack Listbox', 'Tanstack Combobox', 'Tanstack Alert', 'Tanstack Toast', 'Tanstack Drawer', 'Tanstack Modal', 'Tanstack Sheet', 'Tanstack AlertDialog', 'Tanstack ConfirmDialog'],
      keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'AI', 'Next.js', 'Tailwind CSS', 'TypeScript', 'HTML', 'CSS', 'Git', 'Docker', 'Kubernetes', 'Cloud', 'AWS', 'Azure', 'Google Cloud', 'OpenAI', 'CopilotKit', 'React UI', 'Framer Motion', 'GSAP', 'Lucide React', 'Tanstack Query', 'Tanstack Router', 'Tanstack Table', 'Tanstack Pagination', 'Tanstack Dialog', 'Tanstack Tooltip', 'Tanstack Popover', 'Tanstack Menu', 'Tanstack Accordion', 'Tanstack Tabs', 'Tanstack Listbox', 'Tanstack Combobox', 'Tanstack Alert', 'Tanstack Toast', 'Tanstack Drawer', 'Tanstack Modal', 'Tanstack Sheet', 'Tanstack AlertDialog', 'Tanstack ConfirmDialog', 'Tanstack Tooltip', 'Tanstack Popover', 'Tanstack Menu', 'Tanstack Accordion', 'Tanstack Tabs', 'Tanstack Listbox', 'Tanstack Combobox', 'Tanstack Alert', 'Tanstack Toast', 'Tanstack Drawer', 'Tanstack Modal', 'Tanstack Sheet', 'Tanstack AlertDialog', 'Tanstack ConfirmDialog'],
      keyInformation: 'John Doe is a software developer with 5 years of experience in the tech industry. He is skilled in JavaScript, Python, and React, and has a passion for building scalable and efficient software solutions.',
    },
    employees: [
      { id: 1, name: 'Alice Smith', role: 'Developer' },
      { id: 2, name: 'Bob Johnson', role: 'Designer' },
      { id: 3, name: 'Charlie Brown', role: 'Manager' },
      { id: 4, name: 'Diana Ross', role: 'CEO' },
      { id: 5, name: 'Ethan Hunt', role: 'Spy' },
      { id: 6, name: 'Fiona Apple', role: 'Singer' },
      { id: 7, name: 'George Clooney', role: 'Actor' },
      { id: 8, name: 'Hannah Montana', role: 'Singer' },
      { id: 9, name: 'Ian McKellen', role: 'Actor' },
      { id: 10, name: 'Jane Austen', role: 'Writer' },
      { id: 11, name: 'John Doe', role: 'Developer', avatar: '/user-avatar.png', company: 'Acme Inc.', location: 'New York, NY', department: 'Engineering', industry: 'Technology', personalInterests: ['Coding', 'Reading', 'Traveling'], professionalInterests: ['Software Development', 'Machine Learning', 'AI'], keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'AI'], keyInformation: 'John Doe is a software developer with 5 years of experience in the tech industry. He is skilled in JavaScript, Python, and React, and has a passion for building scalable and efficient software solutions.' },
      { id: 12, name: 'Jane Doe', role: 'Designer' },
    ],
  });

  // Provide readable state to the Copilot
  useCopilotReadable({
    description: 'Current user information',
    value: appState.user,
  });

  useCopilotReadable({
    description: 'List of employees',
    value: appState.employees,
  });

  // Define actions for the Copilot
  const greetUserHandler = useCallback(async () => {
    toast({
      title: `Hello, ${appState.user.name}!`,
      description: 'Welcome Customer Support AI!',
      variant: 'default',
      duration: 3500,
    });
  }, [appState.user.name]);
  
  useCopilotAction({
    name: 'greetUser',
    description: 'Greets the current user.',
    parameters: [],
    handler: greetUserHandler,
  });
  
  const addEmployeeHandler = useCallback(async ({ name, role }: { name: string, role: string }) => {
    setAppState(prevState => ({
      ...prevState,
      employees: [
        ...prevState.employees,
        { id: Date.now(), name, role },
      ],
    }));
    return `Added employee ${name} with role ${role}.`;
  }, [setAppState]);

  useCopilotAction({
    name: 'addEmployee',
    description: 'Adds a new employee to the list.',
    parameters: [
      {
        name: 'name',
        type: 'string',
        description: 'Name of the new employee',
      },
      {
        name: 'role',
        type: 'string',
        description: 'Role of the new employee',
      },
    ],
    handler: addEmployeeHandler,
  });

  const contextValue = useMemo(() => ({
    appState,
    setAppState,
    actions,
    suggestions,
  }), [appState]);

  useCopilotChatSuggestions(
    {
      instructions: "Suggest the most relevant next actions.",
      minSuggestions: 2,
      maxSuggestions: 5,
    },
    [appState],
  );

  return (
    <CopilotFeaturesContext.Provider value={contextValue}>
      {children}
    </CopilotFeaturesContext.Provider>
  );
}
