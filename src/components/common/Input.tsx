import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-breshop-navy font-medium mb-2">
        {label} {rest.required && <span className="text-breshop-coral">*</span>}
      </label>
      <input
        id={id}
        {...rest}
        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-breshop-gold focus:border-breshop-gold transition ${
          error ? 'border-red-500' : 'border-breshop-gold/30'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
