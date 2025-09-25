import React, { useState, useEffect } from "react";
import { Card } from "antd";
import dayjs from "dayjs";
import { getParentColor } from "../../../utils/colorUtils";
import "../styles/Calendar.css";

export default function CalendarPage({ tasks, allTasks, onCardClick }) {
  const [calendarTasks, setCalendarTasks] = useState({});
  const [viewDate, setViewDate] = useState(dayjs()); // track displayed month

  useEffect(() => {
    const tasksByDate = {};
    tasks.forEach((task) => {
      if (task.deadline) {
        const dateKey = task.deadline;
        if (!tasksByDate[dateKey]) {
          tasksByDate[dateKey] = [];
        }
        tasksByDate[dateKey].push(task);
      }
    });
    setCalendarTasks(tasksByDate);
  }, [tasks]);

  const currentDate = dayjs(); // real today
  const currentMonth = viewDate.month(); // use viewDate, not today
  const currentYear = viewDate.year();
  const daysInMonth = viewDate.daysInMonth();
  const firstDayOfMonth = dayjs(`${currentYear}-${currentMonth + 1}-1`).day(); 
  const totalDays = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const day = i - firstDayOfMonth + 1;
    if (day > 0 && day <= daysInMonth) {
      days.push(dayjs(`${currentYear}-${currentMonth + 1}-${day}`));
    } else {
      days.push(null);
    }
  }

  const goPrevMonth = () => setViewDate(viewDate.subtract(1, "month"));
  const goNextMonth = () => setViewDate(viewDate.add(1, "month"));

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={goPrevMonth}>{"<"}</button>
        <h2>{viewDate.format("MMMM YYYY")}</h2>
        <button onClick={goNextMonth}>{">"}</button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="day-card empty" />;
          }
          const dateStr = day.format("YYYY-MM-DD");
          const tasksForDay = calendarTasks[dateStr] || [];
          const isToday = day.isSame(currentDate, "day");

          return (
            <Card
              key={dateStr}
              className="day-card"
              bodyStyle={{ padding: 8 }}
              style={{ background: "#fff" }}
            >
              <div className={`day-title ${isToday ? "today" : ""}`}>
                {day.format("D")}
              </div>
              {tasksForDay.map((task) => {
                const parentColors = task.parentIds.map(getParentColor);
                const taskBackgroundColor =
                  task.parentIds.length > 0
                    ? parentColors[0]
                    : getParentColor(task.id);

                return (
                  <div
                    key={task.id}
                    className="task-item"
                    style={{ background: taskBackgroundColor, cursor: "pointer" }}
                    onClick={() => onCardClick(task)}
                  >
                    <span
                      className={`task-title ${
                        task.completed ? "done" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                );
              })}
            </Card>
          );
        })}
      </div>
    </div>
  );
}