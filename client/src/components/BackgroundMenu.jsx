// BackgroundMenu.jsx
import React from 'react';

const PRESET_BACKGROUNDS = [
  { id: 'none', label: 'None' },
  { id: 'blur', label: 'Blur' },
  { id: 'preset1', label: 'Beach', url: '/backgrounds/beach.jpg' },
  { id: 'preset2', label: 'Mountains', url: '/backgrounds/mountains.jpg' },
  { id: 'preset3', label: 'City', url: '/backgrounds/city.jpg' },
];

export default function BackgroundMenu({ backgroundOption, setBackgroundOption, backgroundImage, setBackgroundImage }) {
  
  const onSelectOption = (option) => {
    setBackgroundOption(option);
    if (option === 'none' || option === 'blur') {
      setBackgroundImage(null);
    } else {
      const selected = PRESET_BACKGROUNDS.find(bg => bg.id === option);
      setBackgroundImage(selected?.url || null);
    }
  };

  return (
    <div className="bg-gray-100 rounded p-3 shadow">
      <h3 className="font-bold mb-2">Background</h3>
      <div className="flex flex-col gap-2">
        {PRESET_BACKGROUNDS.map(bg => (
          <button
            key={bg.id}
            onClick={() => onSelectOption(bg.id)}
            className={`text-left px-3 py-1 rounded hover:bg-blue-200 ${
              backgroundOption === bg.id ? 'bg-blue-400 text-white' : 'bg-white'
            }`}
          >
            {bg.label}
          </button>
        ))}
      </div>
    </div>
  );
}
