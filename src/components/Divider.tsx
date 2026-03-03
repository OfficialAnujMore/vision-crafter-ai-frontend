import React from "react";

type DividerProps = {
  label?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  color?: string;
};

const spacingMap: Record<NonNullable<DividerProps["spacing"]>, string> = {
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
};

const Divider: React.FC<DividerProps> = ({
  label,
  className = "",
  orientation = "horizontal",
  spacing = "sm",
  color = "rgba(148, 163, 184, 0.35)",
}) => {
  const margin = spacingMap[spacing];

  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={className}
        style={{
          width: "1px",
          alignSelf: "stretch",
          backgroundColor: color,
          margin: `0 ${margin}`,
        }}
      />
    );
  }

  if (!label) {
    return (
      <hr
        role="separator"
        aria-orientation="horizontal"
        className={className}
        style={{
          border: 0,
          borderTop: `1px solid ${color}`,
          margin: `${margin} 0`,
          width: "100%",
        }}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        margin: `${margin} 0`,
        width: "100%",
      }}
    >
      <span style={{ flex: 1, height: "1px", backgroundColor: color }} />
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          opacity: 0.85,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: "1px", backgroundColor: color }} />
    </div>
  );
};

export default Divider;