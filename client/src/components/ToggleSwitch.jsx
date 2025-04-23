import React from 'react';

const ToggleSwitch = ({ enabled, onChange, label }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={enabled}
          onChange={onChange}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
          enabled ? 'bg-rose-500' : 'bg-gray-200'
        }`}>
        </div>
        <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
          enabled ? 'transform translate-x-6' : ''
        }`}>
        </div>
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
};

export default ToggleSwitch; 