import React from 'react';

export const FormField = ({ label, required = false, children }) => {
  return (
    <div>
      <label className="block text-sm mb-1">
        {label}{required && '*'}
      </label>
      {children}
    </div>
  );
};