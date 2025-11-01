import React from 'react';

interface InputProps {
  label: string;
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  error
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-breshop-navy font-medium mb-2"
      >
        {label} {required && <span className="text-breshop-coral">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
          error 
            ? 'border-red-500 focus:ring-red-300' 
            : 'border-breshop-gold/30 focus:ring-breshop-gold focus:border-breshop-gold'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
