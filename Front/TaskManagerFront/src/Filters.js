import './App.css';
import { useState, useEffect } from "react";

export default function Filters({ onFilterSelect }) {
  const OPTIONS = [
    { id: "completed", label: "Completed", value: "Completed" },
    { id: "canstart",  label: "Can Start", value: "Can Start" },
    { id: "deadline",  label: "Deadline",  value: "Deadline" },
  ];

  const [activeFilters, setActiveFilters] = useState(["Can Start"]);

  const toggle = (value) => {
    const next = activeFilters.includes(value)
      ? activeFilters.filter(v => v !== value)
      : [...activeFilters, value];

    setActiveFilters(next);
    onFilterSelect?.(next);
  };

  useEffect(() => {
  onFilterSelect?.(["Can Start"]);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        marginBottom: "2vh",
      }}
    >
      {OPTIONS.map(opt => (
        <label
          key={opt.id}
          htmlFor={opt.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            cursor: "pointer",
            fontSize: "clamp(14px, 2vw, 16px)",
          }}
        >
          <input
            id={opt.id}
            type="checkbox"
            checked={activeFilters.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            style={{
              width: 16,
              height: 16,
              accentColor: "#f2d03bff",
              cursor: "pointer",
            }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
