import * as React from "react";

export default function Button({
  value,
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}) {
  const classes = [`btn`, `btn-${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children ?? value}
    </button>
  );
}
