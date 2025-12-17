import { MdClose } from 'react-icons/md';

/**
 * Reusable Modal Component
 */
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className={`bg-white rounded-lg shadow-xl ${sizes[size]} w-full max-w-[95vw] sm:max-w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-primary text-white rounded-t-lg">
            <h2 className="text-lg sm:text-xl font-semibold truncate pr-2">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Close modal"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
