import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300 tracking-wide uppercase font-display">
        {label}
      </label>
      <input
        className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-600 ${className}`}
        {...props}
      />
    </div>
  );
};