import React, { useRef } from 'react';

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  previewUrl: string | null;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  previewUrl,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Please select a JPEG or PNG image');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(file, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Upload Image</label>

      <div
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload image"
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {previewUrl ? (
          <div className="space-y-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-64 rounded-lg"
            />
            <p className="text-sm text-gray-500">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary-600">Click to upload</span> or
              drag and drop
            </div>
            <p className="text-xs text-gray-500">JPEG or PNG (max 10MB)</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};
