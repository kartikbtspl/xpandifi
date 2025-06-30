import React from "react";
import Label from "../label/Label";

const hasClass = (className, pattern) =>
  new RegExp(`\\b${pattern}\\b`).test(className || "");

const Input = ({
  name,
  label,
  labelProps = {},
  placeholder = "",
  inputProps = {},
  className = "",
  error = "",
  icon,
  iconPosition = "left",
}) => {
  // Check if width or height already defined
  const hasCustomWidth = hasClass(className, "w-");
  const hasCustomHeight = hasClass(className, "h-");

  const baseWrapperClasses = [
    "inline-flex items-center",
    hasCustomWidth ? "" : "w-[320px]",
    hasCustomHeight ? "" : "h-[43px]",
    "rounded-[12px]",
    "border",
    error ? "border-red-500" : "border-gray-300",
    "pt-[11px]",
    "pr-3",
    "pb-[11px]",
    "pl-3",
    "gap-2.5",
    "focus-within:ring-2 focus-within:ring-blue-500",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mb-4">
      <Label text={label} htmlFor={name} {...labelProps} />

      <div className={baseWrapperClasses}>
        {icon && iconPosition === "left" && (
          <div className="flex items-center text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          placeholder={placeholder}
          {...inputProps}
          className={`flex-grow bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-base ${
            error ? "text-red-700" : ""
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />

        {icon && iconPosition === "right" && (
          <div className="flex items-center text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;