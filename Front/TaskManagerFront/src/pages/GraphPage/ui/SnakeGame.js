import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";

export function SnakeGame({ tasks, setTasks, categories, updateTask }) {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState("RIGHT");
  const [directionQueue, setDirectionQueue] = useState([]);
  const GRID_SIZE = 20;
  const WIDTH = 600;
  const HEIGHT = 400;

  const initialSnake = [
    { x: GRID_SIZE * 5, y: GRID_SIZE * 5 },
    { x: GRID_SIZE * 4, y: GRID_SIZE * 5 },
    { x: GRID_SIZE * 3, y: GRID_SIZE * 5 },
    { x: GRID_SIZE * 2, y: GRID_SIZE * 5 },
    { x: GRID_SIZE * 1, y: GRID_SIZE * 5 },
  ];

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({
    x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE,
    y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE,
  });

  const opposite = (dir) => {
    if (dir === "UP") return "DOWN";
    if (dir === "DOWN") return "UP";
    if (dir === "LEFT") return "RIGHT";
    if (dir === "RIGHT") return "LEFT";
    return null;
  };

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw snake
    snake.forEach((part) => {
      ctx.fillStyle = "green";
      ctx.fillRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
  }, [snake, food]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const move = () => {
      // Apply next direction from queue if available
      if (directionQueue.length > 0) {
        const nextDir = directionQueue[0];
        setDirection(nextDir);
        setDirectionQueue(directionQueue.slice(1));
      }

      let head = { ...snake[0] };
      switch (direction) {
        case "RIGHT":
          head.x += GRID_SIZE;
          break;
        case "LEFT":
          head.x -= GRID_SIZE;
          break;
        case "UP":
          head.y -= GRID_SIZE;
          break;
        case "DOWN":
          head.y += GRID_SIZE;
          break;
        default:
          break;
      }

      let newSnake = [head, ...snake];

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 1);
        setFood({
          x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE,
          y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE,
        });

        // Integrate with tasks: complete a random incomplete task
        const incompleteTasks = tasks.filter((t) => !t.completed);
        if (incompleteTasks.length > 0) {
          const randomIndex = Math.floor(Math.random() * incompleteTasks.length);
          const taskToComplete = incompleteTasks[randomIndex];
          const updatedTask = { ...taskToComplete, completed: true };
          setTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
          updateTask(updatedTask);
        }
      } else {
        newSnake.pop();
      }

      // Wall collision
      if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snake.some((part, index) => index > 0 && part.x === head.x && part.y === head.y)) {
        setGameOver(true);
        return;
      }

      setSnake(newSnake);
    };

    const interval = setInterval(move, 150);
    return () => clearInterval(interval);
  }, [direction, directionQueue, snake, food, gameOver, tasks, setTasks, updateTask]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDir;
      switch (e.key) {
        case "ArrowRight":
          newDir = "RIGHT";
          break;
        case "ArrowLeft":
          newDir = "LEFT";
          break;
        case "ArrowUp":
          newDir = "UP";
          break;
        case "ArrowDown":
          newDir = "DOWN";
          break;
        default:
          return;
      }

      let lastDir = direction;
      if (directionQueue.length > 0) {
        lastDir = directionQueue[directionQueue.length - 1];
      }

      if (newDir !== lastDir && newDir !== opposite(lastDir)) {
        setDirectionQueue((prev) => [...prev, newDir]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction, directionQueue]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setDirection("RIGHT");
    setDirectionQueue([]);
    setSnake(initialSnake);
    setFood({
      x: Math.floor(Math.random() * (WIDTH / GRID_SIZE)) * GRID_SIZE,
      y: Math.floor(Math.random() * (HEIGHT / GRID_SIZE)) * GRID_SIZE,
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#fff",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: "10px" }}>Score: {score}</div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ border: "1px solid black" }}
      />
      {gameOver && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <p>Game Over! Final Score: {score}</p>
          <Button type="primary" onClick={restartGame}>
            Restart
          </Button>
        </div>
      )}
    </div>
  );
}