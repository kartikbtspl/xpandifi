import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import Label from '../label/Label';

const RangeDatePicker = ({
  control,
  name,
  label = 'Start - End Date',
  placeholder = 'Select Date',
  minDate,
  maxDate,
  rules,
  inputProps = {},
  labelProps = {},
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: { start: '', end: '' },
  });

  const handleDateChange = (type, dateValue) => {
    const newValue = { ...value, [type]: dateValue };
    onChange(newValue);

    if (newValue.start && newValue.end) {
      setTimeout(() => setShowPicker(false), 300);
    }
  };

  const formattedRange =
    value.start && value.end
      ? `${format(parseISO(value.start), 'MMM dd, yyyy')} - ${format(
          parseISO(value.end),
          'MMM dd, yyyy'
        )}`
      : placeholder;

  return (
    <div className="w-full mt-3">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
          {...labelProps}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={`w-full text-left rounded-md border ${
            error ? 'border-red-500' : 'border-gray-300'
          } bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
        >
          <span
            className={`${
              !value.start && !value.end ? 'text-gray-400' : 'text-gray-800'
            }`}
          >
            {formattedRange}
          </span>
        </button>

        {showPicker && (
          <div className="absolute z-10 mt-2 w-[500px] rounded-md border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={value.start || ''}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  min={minDate}
                  max={value.end || maxDate}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  {...inputProps}
                />
              </div>

              <div className="pt-7 text-gray-400">—</div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={value.end || ''}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  min={value.start || minDate}
                  max={maxDate}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  {...inputProps}
                />
              </div>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600">{error.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RangeDatePicker;

