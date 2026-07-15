


// Button.jsx
import React from "react";
const Button = ({
  children,
  isLoading = false,
  type = "button",
  color = "blue", 
  size = "md",
  fullWidth = true,
  className = "",
  ...props
}) => {
  // Tailwind color variants
  const colors = {
    blue: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20",
    green: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
    red: "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20",
    gray: "bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-none",
  };
  // Tailwind size variants
  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-2.5 px-6 text-base",
    lg: "py-3.5 px-8 text-lg",
  };
  return (
    <button
      type={type}
      disabled={isLoading || props.disabled}
      className={`${
        fullWidth ? "w-full" : "w-auto"
      } rounded-lg font-semibold transition-all duration-200 shadow-sm active:scale-[0.98] ${
        colors[color] || colors.blue
      } ${sizes[size] || sizes.md} ${isLoading ? "opacity-60 cursor-not-allowed active:scale-100" : ""} ${className}`}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};
Button.whyDidYouRender = true;
export default Button;
