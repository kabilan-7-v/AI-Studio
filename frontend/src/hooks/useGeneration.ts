import { useState, useRef } from 'react';
import { generationsApi } from '../api/generations';
import { Generation, GenerationRequest } from '../types';

const MAX_RETRIES = 3;

interface UseGenerationReturn {
  generate: (data: GenerationRequest) => Promise<void>;
  abort: () => void;
  isLoading: boolean;
  error: string | null;
  result: Generation | null;
  retryCount: number;
}

export const useGeneration = (): UseGenerationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Generation | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = async (data: GenerationRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setRetryCount(0);

    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      try {
        // Create new abort controller for this attempt
        abortControllerRef.current = new AbortController();

        const generation = await generationsApi.create(
          data,
          abortControllerRef.current.signal
        );

        setResult(generation);
        setIsLoading(false);
        return;
      } catch (err) {
        attempts++;
        setRetryCount(attempts);

        // Check if aborted
        if (err instanceof Error && err.name === 'CanceledError') {
          setError('Generation cancelled');
          setIsLoading(false);
          return;
        }

        // Check if model overloaded
        const isModelOverloaded =
          err &&
          typeof err === 'object' &&
          'response' in err &&
          err.response &&
          typeof err.response === 'object' &&
          'data' in err.response &&
          err.response.data &&
          typeof err.response.data === 'object' &&
          'message' in err.response.data &&
          err.response.data.message === 'Model overloaded';

        if (isModelOverloaded && attempts < MAX_RETRIES) {
          // Retry with exponential backoff
          const backoffMs = Math.pow(2, attempts) * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        // Final error
        const errorMessage =
          err &&
          typeof err === 'object' &&
          'response' in err &&
          err.response &&
          typeof err.response === 'object' &&
          'data' in err.response &&
          err.response.data &&
          typeof err.response.data === 'object' &&
          'message' in err.response.data
            ? String(err.response.data.message)
            : 'Failed to generate image';

        setError(errorMessage);
        setIsLoading(false);
        return;
      }
    }

    setError('Failed after maximum retries');
    setIsLoading(false);
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setError('Generation cancelled');
    }
  };

  return {
    generate,
    abort,
    isLoading,
    error,
    result,
    retryCount,
  };
};
