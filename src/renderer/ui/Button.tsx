import React, { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseStyle = 'px-4 py-2 rounded-2xl font-semibold transition-all';
  
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-300 text-black hover:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const disabledStyle = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyle} 
        ${variantStyles[variant]} 
        ${disabled ? disabledStyle : ''} 
        ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
