import './App.css';
import { useState } from "react";

export default function Filters({ onFilterSelect }) {
  const filters = ["Completed", "Can Start", "Deadline"];
  const [activeFilters, setActiveFilters] = useState([]);

  const handleClick = (filter) => {
    let updatedFilters;
    if (activeFilters.includes(filter)) {
     
      updatedFilters = activeFilters.filter(f => f !== filter);
    } else {

      updatedFilters = [...activeFilters, filter];
    }
    setActiveFilters(updatedFilters);
    if (onFilterSelect) onFilterSelect(updatedFilters);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "3vw",
      marginBottom: "2vh",
      marginTop:"7vh"
    }}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleClick(filter)}
          style={{
            padding: "0.5em 1.5em",
            borderRadius: "20px",
            border: activeFilters.includes(filter) ? "1px solid #d0b71bff" : "1px solid #ccc",
            backgroundColor: activeFilters.includes(filter) ? "#f2d03bff" : "#fff",
            color: activeFilters.includes(filter) ? "#fff" : "#000",
            cursor: "pointer",
            fontWeight: "500",
            whiteSpace: "nowrap",
            fontSize: "clamp(14px, 2vw, 16px)",
            transition: "all 0.2s ease",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}