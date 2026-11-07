/**
 * Google Chrome Built-in AI (Gemini Nano) Centralized Service
 * 
 * Implements capability detection, model initialization, session pooling,
 * resource disposal, and graceful fallback detection according to W3C / Chrome Built-in AI specs.
 */

export type AiCapabilityStatus =
  | 'checking'
  | 'available'       // Readily available on-device
  | 'downloadable'    // Model requires download via Chrome components
  | 'downloading'     // Download in progress
  | 'ready'           // Session initialized
  | 'unsupported'     // Browser does not support Chrome Built-in AI
  | 'failed';         // API error or device limitation

export interface AiCapabilityInfo {
  status: AiCapabilityStatus;
  message: string;
  hasPromptApi: boolean;
  hasSummarizerApi: boolean;
  hasWriterApi: boolean;
  downloadProgress?: number; // 0 to 100
  instructions?: string;
}

// Global Chrome Built-in AI typings
declare global {
  interface Window {
    ai?: {
      languageModel?: {
        capabilities?: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        availability?: (options?: any) => Promise<'readily' | 'after-download' | 'no'>;
        create?: (options?: any) => Promise<any>;
      };
      summarizer?: {
        capabilities?: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create?: (options?: any) => Promise<any>;
      };
      writer?: {
        capabilities?: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create?: (options?: any) => Promise<any>;
      };
      rewriter?: {
        capabilities?: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
        create?: (options?: any) => Promise<any>;
      };
    };
  }
}

let activeSession: any = null;

/**
 * Checks for Chrome Built-in AI / Gemini Nano support
 */
export async function checkChromeAiSupport(): Promise<AiCapabilityInfo> {
  if (typeof window === 'undefined') {
    return {
      status: 'unsupported',
      message: 'Running in a non-browser environment.',
      hasPromptApi: false,
      hasSummarizerApi: false,
      hasWriterApi: false,
    };
  }

  const aiObj = window.ai;
  if (!aiObj) {
    return {
      status: 'unsupported',
      message: 'Chrome Built-in AI is not detected in this browser.',
      hasPromptApi: false,
      hasSummarizerApi: false,
      hasWriterApi: false,
      instructions: 'Available in Chrome 128+ with flags enabled (chrome://flags/#prompt-api-for-gemini-nano). Offline fallback engine is active.',
    };
  }

  const languageModel = aiObj.languageModel;
  const hasPromptApi = !!languageModel;
  const hasSummarizerApi = !!aiObj.summarizer;
  const hasWriterApi = !!aiObj.writer;

  if (!languageModel) {
    return {
      status: 'unsupported',
      message: 'Prompt API for Gemini Nano is not available.',
      hasPromptApi: false,
      hasSummarizerApi,
      hasWriterApi,
      instructions: 'Enable chrome://flags/#prompt-api-for-gemini-nano in Google Chrome.',
    };
  }

  try {
    let availability: 'readily' | 'after-download' | 'no' = 'no';

    if (typeof languageModel.availability === 'function') {
      availability = await languageModel.availability();
    } else if (typeof languageModel.capabilities === 'function') {
      const caps = await languageModel.capabilities();
      availability = caps.available;
    }

    if (availability === 'readily') {
      return {
        status: 'available',
        message: 'Chrome Built-in Gemini Nano is installed and ready for on-device inference.',
        hasPromptApi,
        hasSummarizerApi,
        hasWriterApi,
      };
    } else if (availability === 'after-download') {
      return {
        status: 'downloadable',
        message: 'Gemini Nano is supported but needs to download on your device (~1.5GB).',
        hasPromptApi,
        hasSummarizerApi,
        hasWriterApi,
        instructions: 'Open chrome://components and click "Check for update" next to "Optimization Guide On Device Model".',
      };
    } else {
      return {
        status: 'unsupported',
        message: 'Gemini Nano is not currently enabled for your device hardware.',
        hasPromptApi,
        hasSummarizerApi,
        hasWriterApi,
        instructions: 'Your device hardware may not meet the minimum RAM or VRAM requirements for Gemini Nano. The local fallback engine will be used.',
      };
    }
  } catch (error) {
    return {
      status: 'failed',
      message: `Failed to query Chrome AI capabilities: ${(error as Error).message}`,
      hasPromptApi,
      hasSummarizerApi,
      hasWriterApi,
    };
  }
}

/**
 * Creates or reuses a prompt session with Gemini Nano
 */
export async function getOrCreateLanguageModelSession(
  systemPrompt?: string,
  onDownloadProgress?: (progress: number) => void
): Promise<any> {
  if (typeof window === 'undefined' || !window.ai?.languageModel?.create) {
    throw new Error('Chrome Built-in AI Prompt API is not supported in this environment.');
  }

  if (activeSession) {
    return activeSession;
  }

  try {
    const session = await window.ai.languageModel.create({
      systemPrompt: systemPrompt || 'You are an expert technical interviewer and computer science mentor.',
      monitor(m: any) {
        if (m && typeof m.addEventListener === 'function') {
          m.addEventListener('downloadprogress', (e: any) => {
            const progress = e.total > 0 ? Math.round((e.loaded / e.total) * 100) : 0;
            if (onDownloadProgress) onDownloadProgress(progress);
          });
        }
      },
    });

    activeSession = session;
    return session;
  } catch (err) {
    console.error('Failed to initialize Chrome Built-in AI session:', err);
    throw err;
  }
}

/**
 * Executes a prompt against Chrome Built-in AI with cancellation support
 */
export async function promptChromeAi(
  prompt: string,
  systemPrompt?: string,
  signal?: AbortSignal
): Promise<string> {
  const session = await getOrCreateLanguageModelSession(systemPrompt);
  
  if (signal?.aborted) {
    throw new Error('Prompt request was cancelled.');
  }

  try {
    const response = await session.prompt(prompt, { signal });
    return response;
  } catch (err: any) {
    if (signal?.aborted) {
      throw new Error('Prompt request was cancelled.');
    }
    // If session was corrupted, dispose it so next call re-initializes
    destroyAiSession();
    throw err;
  }
}

/**
 * Safely disposes the active AI session and releases on-device GPU/RAM memory
 */
export function destroyAiSession(): void {
  if (activeSession) {
    try {
      if (typeof activeSession.destroy === 'function') {
        activeSession.destroy();
      }
    } catch (e) {
      console.warn('Error while destroying AI session:', e);
    }
    activeSession = null;
  }
}
