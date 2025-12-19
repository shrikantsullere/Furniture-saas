import { MdClose } from 'react-icons/md';

/**
 * Reusable Modal Component
 */
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  // const sizes = {
  //   sm: "max-w-md",
  //   md: "max-w-lg",
  //   lg: "max-w-2xl",
  //   xl: "max-w-4xl",
  // };
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };
  

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center
                   p-2 sm:p-4 overflow-y-auto"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className={`w-full ${sizeClasses[size] || "max-w-2xl"} 
                      bg-white rounded-xl my-8`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200
                          flex items-center justify-between
                          bg-primary text-white rounded-t-xl">
            <h2 className="text-lg sm:text-xl font-semibold truncate pr-2">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-white/80
                         min-w-[44px] min-h-[44px]
                         flex items-center justify-center"
              aria-label="Close modal"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Content (Scrollable Area) */}
          <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
