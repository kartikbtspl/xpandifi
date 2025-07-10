import React from 'react';

const Button = ({
  label = 'Create Campaign',
  onClick,
  className = '',
  type = 'button',
  loading = false,
  isIcon=true,
  ...inputProps
}) => {
  const defaultClass =
    'flex items-center justify-center px-4 py-2 rounded-full text-white bg-[#445E94] hover:bg-blue-900 text-sm transition disabled:opacity-50';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`${defaultClass} ${className}`}
      {...inputProps}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {`${label}...`}
        </>
      ) : (
        <>
          {isIcon?<span className="mr-2 text-base">+</span>:''} {label}
        </>
      )}
    </button>
  );
};

export default Button;

