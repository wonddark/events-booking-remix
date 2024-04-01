import React from "react";

function Button({
  label,
  type,
  style = "light",
  preIcon,
  postIcon,
  className = "",
}: {
  label: string;
  type: "button" | "submit" | "reset";
  style?: "primary" | "secondary" | "light";
  preIcon?: React.ReactElement;
  postIcon?: React.ReactElement;
  className?: string;
}) {
  const styled = () => {
    switch (style) {
      case "primary":
        return "bg-primary-300 border border-primary-500 text-slate-700 hover:bg-primary-400";
      case "secondary":
        return "bg-secondary-100 border border-secondary-300 text-gray-800 hover:bg-white";
      default:
        return "";
    }
  };
  return (
    <button
      type={type}
      className={`h-8 px-5 rounded-lg cursor-pointer flex justify-center items-center min-w-max ${styled()} ${className}`}
    >
      {preIcon ?? null} <span>{label}</span> {postIcon ?? null}
    </button>
  );
}

export default Button;
