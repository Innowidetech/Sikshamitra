import React from 'react';

export const FileUpload = ({
  label,
  id,
  required = false,
  accept,
  description = 'Upload your files here'
}) => {
  return (
    <div>
      <label className="block text-sm mb-3">
        {label}{required && '*'}
      </label>
      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">{description}</p>
        <input
          type="file"
          required={required}
          accept={accept}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className="text-blue-600 text-sm mt-2 cursor-pointer inline-block"
        >
          Choose File
        </label>
      </div>
    </div>
  );
};