import React, { useState, useEffect } from 'react';

interface FileUploadProps {
  label: string;
  onChange: (file: File | null) => void;
  required?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, required }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  // Clean up object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300 tracking-wide uppercase font-display">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group w-full h-48 border-2 border-dashed border-slate-700 rounded-lg hover:border-blue-500 transition-colors bg-slate-900 flex items-center justify-center overflow-hidden">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-4">
            <svg
              className="mx-auto h-10 w-10 text-gray-500 mb-2 group-hover:text-blue-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-400 group-hover:text-gray-300">
              Clique ou arraste para enviar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};