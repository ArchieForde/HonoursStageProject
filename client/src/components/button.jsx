export default function Button({ 
  children, 
  icon: Icon, 
  variant = "primary",
  size = "md",
  disabled = false,
  onClick, 
  className = "", 
  ...props 
}) {
  const baseStyles = "flex items-center gap-2 font-semibold transition rounded-lg";
  
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-500 text-white disabled:bg-purple-400",
    secondary: "border border-purple-400/40 hover:bg-purple-400/10 text-white disabled:opacity-50",
    ghost: "text-purple-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
