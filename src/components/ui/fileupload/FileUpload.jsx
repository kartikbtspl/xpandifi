import React, { useRef } from 'react';
import { useController } from 'react-hook-form';
import Label from '../label/Label';
import { FiImage } from "react-icons/fi"; // Or use your own icon

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
    field: { onChange, value = [] },
    fieldState: { error },
  } = useController({ name, control });

  const inputRef = useRef();

  // Handle multiple file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.size / 1024 / 1024 <= maxSizeMB
    );
    if (validFiles.length !== files.length) {
      alert(`Some files exceed ${maxSizeMB}MB and were not added.`);
    }
    // Append to existing files
    onChange([...(value || []), ...validFiles]);
    e.target.value = '';
  };

  // Remove a file
  const handleRemove = (idx) => {
    const newFiles = value.filter((_, i) => i !== idx);
    onChange(newFiles);
  };

  // Render preview for image/video
  const renderPreview = (file) => {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) {
      return <img src={url} alt="preview" className="w-full h-full object-cover rounded" />;
    }
    if (file.type.startsWith('video/')) {
      return (
        <video src={url} className="w-full h-full object-cover rounded" controls />
      );
    }
    return null;
  };

  // Main file is the first, others are the rest
  const mainFile = value && value[0];
  const otherFiles = value && value.slice(1);

  const hasFiles = value && value.length > 0;

  return (
    <div className="mb-4">
      <Label text={label} {...labelProps} />
      <div className="border border-dashed rounded-xl p-3 bg-gray-50">
        {!hasFiles ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-10">
            <FiImage className="text-4xl text-gray-400 mb-2" />
            <div className="font-medium text-gray-700 mb-1">Drop image or browse</div>
            <div className="text-xs text-gray-400 mb-3">
              Format: .jpeg, .png, .mp4 &amp; Max file size: {maxSizeMB} MB
            </div>
            <input
              type="file"
              accept={accept}
              multiple
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
              {...inputProps}
            />
            <button
              type="button"
              className="px-4 py-1 border border-blue-400 rounded text-blue-500 hover:bg-blue-50 text-sm"
              onClick={() => inputRef.current && inputRef.current.click()}
            >
              Browse Files
            </button>
          </div>
        ) : (
          // Preview state
          <div>
            <div className="flex gap-4">
              {/* Main Product Image/Video */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Main Product Image/ Video</span>
                <div className="w-32 h-32 border border-dashed rounded-lg flex items-center justify-center bg-white relative">
                  {mainFile ? (
                    <>
                      {renderPreview(mainFile)}
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full px-1 text-xs text-red-500"
                        onClick={() => handleRemove(0)}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">No file</span>
                  )}
                </div>
              </div>
              {/* Other Images/ Videos */}
              <div className="flex-1">
                <span className="text-xs mb-1">Other Images/ Video</span>
                <div className="flex gap-2">
                  {otherFiles && otherFiles.length > 0 ? (
                    otherFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="w-24 h-24 border border-dashed rounded-lg flex items-center justify-center bg-white relative"
                      >
                        {renderPreview(file)}
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white rounded-full px-1 text-xs text-red-500"
                          onClick={() => handleRemove(idx + 1)}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="w-24 h-24 border border-dashed rounded-lg flex items-center justify-center bg-white text-gray-400 text-xs">
                      No files
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* File input and browse button */}
            <div className="flex flex-col items-center mt-4">
              <input
                type="file"
                accept={accept}
                multiple
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
                {...inputProps}
              />
              <button
                type="button"
                className="px-4 py-1 border border-blue-400 rounded text-blue-500 hover:bg-blue-50 text-sm"
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-400 mt-1">
                Format: jpeg, png, mp4. Max file size: {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default FileUpload;