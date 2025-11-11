import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGeneration } from '../hooks/useGeneration';
import { generationsApi } from '../api/generations';
import { Generation, StyleOption } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import { GenerationHistory } from '../components/GenerationHistory';

const STYLE_OPTIONS: { value: StyleOption; label: string }[] = [
  { value: 'realistic', label: 'Realistic' },
  { value: 'artistic', label: 'Artistic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'vintage', label: 'Vintage' },
];

export const Studio: React.FC = () => {
  const { user, logout } = useAuth();
  const { generate, abort, isLoading, error, result, retryCount } = useGeneration();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<StyleOption>('realistic');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (result) {
      loadHistory();
    }
  }, [result]);

  const loadHistory = async () => {
    try {
      const generations = await generationsApi.list(5);
      setHistory(generations);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    await generate({ prompt, style, image: imageFile });
  };

  const handleImageSelect = (file: File, preview: string) => {
    setImageFile(file);
    setPreviewUrl(preview);
  };

  const handleHistoryItemClick = (generation: Generation) => {
    setPrompt(generation.prompt);
    setStyle(generation.style as StyleOption);
    setPreviewUrl(generation.originalImageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Create Generation</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    previewUrl={previewUrl}
                    disabled={isLoading}
                  />

                  <div>
                    <label
                      htmlFor="prompt"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Prompt
                    </label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={3}
                      required
                      maxLength={500}
                      disabled={isLoading}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Describe the style or modifications you want..."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {prompt.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="style"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Style
                    </label>
                    <select
                      id="style"
                      value={style}
                      onChange={(e) => setStyle(e.target.value as StyleOption)}
                      disabled={isLoading}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {STYLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div
                      className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded"
                      role="alert"
                      aria-live="assertive"
                    >
                      <p>{error}</p>
                      {retryCount > 0 && (
                        <p className="text-sm mt-1">Retry attempt: {retryCount}/3</p>
                      )}
                    </div>
                  )}

                  {result && (
                    <div
                      className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded"
                      role="alert"
                    >
                      Generation successful!
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading || !imageFile || !prompt}
                      className="flex-1 justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Generating...' : 'Generate'}
                    </button>

                    {isLoading && (
                      <button
                        type="button"
                        onClick={abort}
                        className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Abort
                      </button>
                    )}
                  </div>

                  {isLoading && retryCount > 0 && (
                    <div className="text-center text-sm text-gray-600">
                      Model overloaded, retrying... (Attempt {retryCount}/3)
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <GenerationHistory
                history={history}
                onItemClick={handleHistoryItemClick}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
