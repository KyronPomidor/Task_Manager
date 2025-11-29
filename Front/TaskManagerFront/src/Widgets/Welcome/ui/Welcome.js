import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Welcome({
  user,
  selectedCategory,
  categories,
  isDarkMode = false,  
  colors,                 
}) {
  const [now, setNow] = useState(new Date());

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Date & time formatting
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time = `${hours}:${minutes} ${ampm}`;

  const categoryName =
    selectedCategory === "inbox"
      ? "Today"
      : categories.find((cat) => cat.id === selectedCategory)?.name ||
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  const textColor = colors?.text ?? (isDarkMode ? "#e5e5e5" : "#111827");

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        display: "flex",
        justifyContent: isMobile ? "center" : "space-between",
        marginLeft: isMobile ? 0 : "1.5vw",
        marginRight: "1.5vw",
        color: textColor,                     // <-- dynamic text colour
      }}
    >
      <section style={{ textAlign: isMobile ? "center" : "left" }}>
        <p
          style={{
            margin: 0,
            color: textColor,
            fontSize: "3rem",
            fontWeight: 300,
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {categoryName}
        </p>

        {selectedCategory === "inbox" && (
          <p
            style={{
              margin: "8px 0 0",
              color: textColor,
              fontSize: "1.5rem",
              opacity: 0.85,
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {day} {date} {month} {year} | {time}
          </p>
        )}
      </section>
    </motion.div>
  );
}