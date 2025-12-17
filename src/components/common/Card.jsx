/**
 * Reusable Card Component
 */
const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
