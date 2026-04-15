import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`dashboard-card ${className}`.trim()}>
      {title && (
        <div className="dashboard-card-title">
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
