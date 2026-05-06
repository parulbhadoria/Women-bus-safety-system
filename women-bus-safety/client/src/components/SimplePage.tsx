import React from "react";
import { Link } from "react-router-dom";

const SimplePage: React.FC<{ title: string; links?: { to: string; label: string }[] }> = ({ title, links = [] }) => (
  <div style={{ padding: 20, background: "#F8F0FF", minHeight: "100vh" }}>
    <h2 style={{ color: "#7B2D8B" }}>{title}</h2>
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {links.map((l) => (
        <Link key={l.to} to={l.to}>
          <button>{l.label}</button>
        </Link>
      ))}
    </div>
  </div>
);

export default SimplePage;
