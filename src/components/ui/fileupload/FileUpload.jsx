import React from 'react';
import { useController } from 'react-hook-form';
import Label from '../label/Label'
const FileUpload = ({
  name,
  label,
  control,
  accept = '.jpg,.png,.mp4',
  maxSizeMB = 25,
  inputProps = {},
  labelProps = {},
}) => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({ name, control });

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file && file.size / 1024 / 1024 > maxSizeMB) {
      alert(`File size exceeds ${maxSizeMB}MB`);
      return;
    }
    onChange(file);
  };

  return (
    <div className='mb-4'>
      <Label text={label} {...labelProps} />
      <div className='w-full h-[150px] border border-dashed rounded-xl flex flex-col items-center justify-center bg-gray-50'>
        <input
          type='file'
          accept={accept}
          onChange={handleFileChange}
          className='hidden'
          id={name}
          {...inputProps}
        />
        <label
          htmlFor={name}
          className='cursor-pointer text-sm text-blue-500'
        >
          Drop image or <span className='underline'>browse</span>
        </label>
        <p className='text-xs text-gray-400'>
          Format: jpeg, png, mp4. Max file size: {maxSizeMB}MB
        </p>
      </div>
      {error && <p className='text-sm text-red-500'>{error.message}</p>}
    </div>
  );
};

export default FileUpload;
