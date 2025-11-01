import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2";
  
  const variantClasses = {
    primary: "bg-breshop-navy text-white hover:bg-breshop-navy/90 focus:ring-breshop-navy/50",
    secondary: "bg-breshop-pink text-white hover:bg-breshop-coral focus:ring-breshop-pink/50"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
