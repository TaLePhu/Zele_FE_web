import React from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = ({
  isOpen,
  onEmojiClick,
  onClose,
  position = 'top'
}) => {
  if (!isOpen) return null;

  const handleEmojiClick = (emojiData) => {
    onEmojiClick(emojiData.emoji);
    // Không đóng picker để có thể chọn nhiều emoji
  };

  return (
    <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 z-50`}>
      <div className="relative bg-white rounded-lg shadow-lg border border-gray-200">
        <button
          className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-sm z-10 shadow-md"
          onClick={onClose}
        >
          ×
        </button>
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          width={350}
          height={400}
          previewConfig={{
            showPreview: false
          }}
          searchDisabled={false}
          skinTonesDisabled={true}
          lazyLoadEmojis={true}
        />
        <div className="p-2 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 text-center">
            💡 Chọn nhiều emoji trước khi đóng
          </div>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
            onClick={onClose}
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmojiPickerComponent;
