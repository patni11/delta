export {};

declare global {
  interface Window {
    electronAPI: {
      startScreenCapture: () => Promise<{ success: boolean; message?: string; sourceId?: string }>;
      stopScreenCapture: () => Promise<{ success: boolean; message?: string }>;
      onCaptureStatus: (callback: (event: any, status: boolean) => void) => void;
      onCaptureError: (callback: (event: any, error: string) => void) => void;
      enableScreenCapture: () => Promise<void>;
      disableScreenCapture: () => Promise<void>;
    };
    ipc: {
      send: (channel: string, value: unknown) => void;
      on: (channel: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
