import React, { forwardRef } from "react";
import Label from "../label/Label";

const TextArea = forwardRef(
  (
    {
      name,
      label,
      labelProps = {},
      placeholder = "",
      textAreaProps = {},
      className = "",
      error = "",
      value,
      onChange,
      onBlur,
      disabled,
      rows = 4,
    },
    ref
  ) => {
    return (
      <div className="mb-4 mt-1">
        <Label text={label} htmlFor={name} {...labelProps} />
        <div
          className={`w-full rounded-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } py-2 px-4 focus-within:ring-2 focus-within:ring-blue-500 bg-white shadow-xs ${className}`}
        >
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            ref={ref}
            rows={rows}
            {...textAreaProps}
            className={`w-full resize-none bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-base font-normal ${
              error ? "text-red-700" : ""
            }`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        </div>
        {error && (
          <p
            id={`${name}-error`}
            className="mt-1 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

export default TextArea;
