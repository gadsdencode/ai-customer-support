/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/types/langgraph.ts

export interface Assistant {
    assistant_id: string;
    graph_id: string;
    created_at: string;
    updated_at: string;
    config: {
      configurable: {
        model_name: string;
      };
    };
    metadata: Record<string, any>;
  }
  
  export interface RunEvent {
    event: string;
    data: any;
  }
  