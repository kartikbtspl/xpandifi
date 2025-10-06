import React, { useState, useEffect } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const Counter = ({
  value: controlledValue,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  size = "md",
  width = "auto",
  color = "gray",
}) => {
  const [value, setValue] = useState(controlledValue ?? 0);

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  const handleChange = (newValue) => {
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    setValue(newValue);
    onChange?.(newValue);
  };

  const plusClick = () => handleChange(value + step);
  const minusClick = () => handleChange(value - step);

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) handleChange(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      plusClick();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      minusClick();
    }
  };

  // Size presets
  const sizeClasses = {
    sm: "h-8 text-sm w-[40px]",
    md: "h-10 text-base w-[120px]",
    lg: "h-12 text-lg w-[140px]",
  };

  return (
    <div
      className={`flex items-center justify-center ${sizeClasses[size]} bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg`}
      style={{ width }}
    >
      {/* Minus Button */}
      <button
        onClick={minusClick}
        disabled={value <= min}
        className={`flex items-center justify-center h-full w-full border-r hover:rounded-l-lg border-gray-200 transition-all duration-200 
          text-${color}-600 hover:bg-${color}-50 active:bg-${color}-100 disabled:opacity-40 cursor-pointer`}
        aria-label="Decrease"
      >
        <FiMinus size={18} />
      </button>

      {/* Input */}
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        min={min}
        max={max}
        aria-label="Counter value"
        className="w-12 text-center outline-none bg-transparent font-medium text-gray-800 focus:ring-0"
      />

      {/* Plus Button */}
      <button
        onClick={plusClick}
        disabled={value >= max}
        className={`flex items-center justify-center h-full w-full hover:rounded-r-lg border-l border-gray-200 transition-all duration-200 
          text-${color}-600 hover:bg-${color}-50 active:bg-${color}-100 disabled:opacity-40 cursor-pointer`}
        aria-label="Increase"
      >
        <FiPlus size={18} />
      </button>
    </div>
  );
};

export default Counter;
