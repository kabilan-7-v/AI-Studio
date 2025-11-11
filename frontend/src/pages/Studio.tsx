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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">AI Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/profile"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition duration-150"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{user?.name || user?.email}</span>
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
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
              <div className="bg-white shadow-2xl rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Create Generation</h2>
                </div>

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
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg"
                      role="alert"
                      aria-live="assertive"
                    >
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                      {retryCount > 0 && (
                        <p className="text-sm mt-1">Retry attempt: {retryCount}/3</p>
                      )}
                    </div>
                  )}

                  {result && (
                    <div
                      className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-lg"
                      role="alert"
                    >
                      <p className="font-medium">Success!</p>
                      <p className="text-sm">Generation completed successfully</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading || !imageFile || !prompt}
                      className="flex-1 justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 shadow-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : 'Generate'}
                    </button>

                    {isLoading && (
                      <button
                        type="button"
                        onClick={abort}
                        className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150"
                      >
                        Abort
                      </button>
                    )}
                  </div>

                  {isLoading && retryCount > 0 && (
                    <div className="text-center">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                        <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm text-blue-600 font-medium">
                          Model overloaded, retrying... (Attempt {retryCount}/3)
                        </span>
                      </div>
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
