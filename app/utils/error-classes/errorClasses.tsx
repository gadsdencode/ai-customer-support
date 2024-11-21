// /utils/error-classes/errorClasses.tsx

class CopilotReadableError extends Error {
    constructor(message: string) {
      super(`CopilotReadable Error: ${message}`);
      this.name = 'CopilotReadableError';
    }
  }

  export { CopilotReadableError };