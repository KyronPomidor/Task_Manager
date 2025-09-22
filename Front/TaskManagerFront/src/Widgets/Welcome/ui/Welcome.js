import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Welcome({ user, selectedCategory, categories }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Date & time formatting
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const time = `${hours}:${minutes} ${ampm}`;

  // Find category name for non-inbox categories
  const categoryName = selectedCategory === "inbox"
    ? "Today"
    : categories.find((cat) => cat.id === selectedCategory)?.name || selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ display: "flex", justifyContent: "space-between", marginLeft: "1.5vw" }}
    >
      <section>
        <p
          style={{
            margin: 0,
            color: "black",
            fontSize: "3rem",
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          {categoryName}
        </p>
        {selectedCategory === "inbox" && (
          <p
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "1.2rem", // Slightly smaller than header but still clear
            }}
          >
            {day} {date} {month} {year} | {time}
          </p>
        )}
      </section>
    </motion.div>
  );
}