import React, { useEffect } from 'react';

const Errorpopups = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
  const textColor = 'text-white';

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${bgColor} ${textColor} flex items-center justify-between z-50`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">
        &times;
      </button>
    </div>
  );
};

export default Errorpopups;