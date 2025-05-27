import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import EmojiPickerComponent from './EmojiPicker';

const EmojiButton = ({ 
  onEmojiSelect, 
  position = 'top',
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji);
    // Không đóng picker để có thể chọn nhiều emoji liên tiếp
  };

  return (
    <div className={`relative ${className}`} ref={buttonRef}>
      <button
        type="button"
        className={`p-2 transition-colors rounded-full hover:bg-gray-100 ${
          isOpen ? 'text-blue-500 bg-blue-50' : 'text-gray-500 hover:text-blue-500'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chọn emoji"
      >
        <MdOutlineEmojiEmotions size={20} />
      </button>
      
      <EmojiPickerComponent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onEmojiClick={handleEmojiSelect}
        position={position}
      />
    </div>
  );
};

export default EmojiButton;
