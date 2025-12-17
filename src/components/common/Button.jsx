/**
 * Reusable Button Component with 3D Effects
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - Full width button
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-primary text-white shadow-[0_4px_0_#5aafa5] hover:shadow-[0_2px_0_#5aafa5] hover:scale-[1.02] active:translate-y-1 active:shadow-[0_1px_0_#5aafa5] focus:ring-primary-dark",
    secondary:
      "bg-white text-gray-900 border-2 border-gray-300 shadow-[0_4px_0_#d1d5db] hover:shadow-[0_2px_0_#d1d5db] hover:scale-[1.02] active:translate-y-1 active:shadow-[0_1px_0_#d1d5db] focus:ring-gray-400",
    outline:
      "border-2 border-primary text-primary bg-white shadow-[0_2px_0_#6DC3BB] hover:shadow-[0_1px_0_#6DC3BB] hover:scale-[1.02] active:translate-y-0.5 active:shadow-none hover:bg-primary/5 focus:ring-primary",
    danger: "bg-red-600 text-white shadow-[0_4px_0_#dc2626] hover:shadow-[0_2px_0_#dc2626] hover:scale-[1.02] active:translate-y-1 active:shadow-[0_1px_0_#dc2626] focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[44px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
