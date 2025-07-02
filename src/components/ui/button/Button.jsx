import React from 'react';

const Button = ({
  label = 'Create Campaign',
  onClick,
  className = '',
  type = 'button',
  ...inputProps
}) => {
  const defaultClass =
    'flex items-center px-4 py-2 rounded-full text-white bg-[#445E94] hover:bg-blue-900 text-sm transition';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${defaultClass} ${className}`}
      {...inputProps}
    >
      <span className="mr-2 text-base">+</span> {label}
    </button>
  );
};

export default Button;
