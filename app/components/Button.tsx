import React, { MouseEventHandler } from "react";

function Button({
  label,
  type,
  style = "light",
  preIcon,
  postIcon,
  className = "",
  onClick,
}: Readonly<{
  label: string;
  type: "button" | "submit" | "reset";
  style?: "primary" | "secondary" | "light";
  preIcon?: React.ReactElement;
  postIcon?: React.ReactElement;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}>) {
  const styled = () => {
    switch (style) {
      case "primary":
        return "bg-primary-400 text-gray-800 hover:brightness-90";
      case "secondary":
        return "bg-secondary-100 border border-secondary-300 text-gray-800 hover:bg-white";
      default:
        return "";
    }
  };
  return (
    <button
      type={type}
      className={`rounded-md py-1.5 px-3.5 cursor-pointer flex justify-center items-center min-w-max ${styled()} ${className}`}
      onClick={onClick}
    >
      {preIcon ?? null} <span>{label}</span> {postIcon ?? null}
    </button>
  );
}

export default Button;
