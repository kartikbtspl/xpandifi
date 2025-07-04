import React from 'react';
import { useController } from 'react-hook-form';
import Label from '../label/Label';

const Select = ({
  name,
  label,
  control,
  options = [],
  className = '',
  labelProps = {},
  inputProps = {}, // renamed for consistency
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className='mb-4'>
      <Label text={label} htmlFor={name} {...labelProps} />
      <select
        id={name}
        {...field}
        {...inputProps}
        className={`w-[320px] h-[43px] px-3 py-2 border rounded-[12px] text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
      >
        <option value=''>Select {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className='text-sm text-red-500 mt-1'>{error.message}</p>}
    </div>
  );
};

export default Select;
