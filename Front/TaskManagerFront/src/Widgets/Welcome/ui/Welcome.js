import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Welcome({ user, selectedCategory }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Date & time formatting
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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

  // User name fallback
  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ display: "flex", justifyContent: "space-between", marginLeft: "1.5vw" }}
    >
      <section>
        {selectedCategory === "inbox" ? (
          <>
            <h2 style={{ margin: 0 }}>
              Hello, <span style={{ color: "#2563eb" }}>{userName}</span>
            </h2>
            <h3 style={{ margin: "4px 0" }}>Today</h3>
            <b>
              {day} {date} {month} {year} | {time}
            </b>
          </>
        ) : (
          <h2 style={{ margin: 0, color: "black" }}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </h2>
        )}
      </section>
    </motion.div>
  );
}
