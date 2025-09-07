import './App.css';
import { useState, useEffect } from "react";

export default function Welcome() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date()); 
    }, 1000);

    return () => clearInterval(timer); 
  }, []);


  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = days[now.getDay()];

  const date = now.getDate();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[now.getMonth()];
  const year = now.getFullYear();


  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const time = `${hours}:${minutes} ${ampm}`;

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <section>
        <h2 style={{ display: "flex" }}>Today</h2>
        <b>{day} {date} {month} {year} | {time}</b>
      </section>
    </div>
  );
}