// /utils/error-classes/errorClasses.tsx

class CopilotReadableError extends Error {
    constructor(message: string) {
      super(`CopilotReadable Error: ${message}`);
      this.name = 'CopilotReadableError';
    }
  }

  export { CopilotReadableError };

  export class SupabaseError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'SupabaseError';
    }
  }
  
  export class DataNotFoundError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'DataNotFoundError';
    }
  }