import React from "react";

const ringStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  border: "4px solid #E1BEE7",
  borderTop: "4px solid #7B2D8B",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const LoadingSpinner: React.FC<{ inline?: boolean }> = ({ inline = false }) => (
  <div style={{ minHeight: inline ? "auto" : "100vh", display: "grid", placeItems: "center", background: inline ? "transparent" : "rgba(255,255,255,0.75)" }}>
    <div style={{ display: "grid", gap: 8, placeItems: "center" }}>
      <div style={{ ...ringStyle, width: inline ? 20 : 48, height: inline ? 20 : 48 }} />
      {!inline && <span style={{ color: "#7B2D8B", fontWeight: 600 }}>Loading...</span>}
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;
