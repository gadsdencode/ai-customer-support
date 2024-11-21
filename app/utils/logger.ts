/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/logger.ts

const serializeError = (error: any) => {
  if (error instanceof Error) {
      return { message: error.message, stack: error.stack };
  }
  return error;
};

const logger = {
  info: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.log(...args);
      } else {
          // Client-side logging
          console.log(...args);
      }
  },
  error: (...args: any[]) => {
      const serializedArgs = args.map(arg => serializeError(arg));
      if (typeof window === 'undefined') {
          // Server-side logging
          console.error(...serializedArgs);
      } else {
          // Client-side logging
          console.error(...serializedArgs);
      }
  },
  warn: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.warn(...args);
      } else {
          // Client-side logging
          console.warn(...args);
      }
  },
  debug: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.debug(...args);
      } else {
          // Client-side logging
          console.debug(...args);
      }
  },
  log: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.log(...args);
      } else {
          // Client-side logging
          console.log(...args);
      }
  },
  trace: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.trace(...args);
      } else {
          // Client-side logging
          console.trace(...args);
      }
  },
  table: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.table(...args);
      } else {
          // Client-side logging
          console.table(...args);
      }
  },
  group: (...args: any[]) => {
      if (typeof window === 'undefined') {
          // Server-side logging
          console.group(...args);
      } else {
          // Client-side logging
          console.group(...args);
      }
  }
  // Add other log levels as needed (warn, debug, etc.)
};

export default logger;
