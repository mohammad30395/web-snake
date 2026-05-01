"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trophy } from "lucide-react";
import { saveScore } from "@/lib/storage";

const BOARD_SIZE = 24;
const CELL_SIZE = 22;
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  KeyW: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  KeyS: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  KeyA: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  KeyD: { x: 1, y: 0 },
};

const touchDirections = {
  up: DIRECTIONS.ArrowUp,
  down: DIRECTIONS.ArrowDown,
  left: DIRECTIONS.ArrowLeft,
  right: DIRECTIONS.ArrowRight,
};

export default function SnakeGame({ arena, level, levelKey, profile }) {
  const canvasRef = useRef(null);
  const directionRef = useRef({ x: 1, y: 0 });
  const nextDirectionRef = useRef({ x: 1, y: 0 });
  const gameOverRef = useRef(false);
  const touchStartRef = useRef(null);
  const [snake, setSnake] = useState(getInitialSnake);
  const [food, setFood] = useState(() => createFood(getInitialSnake(), arena));
  const [score, setScore] = useState(0);
  const [saved, setSaved] = useState(false);
  const [highScore, setHighScore] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const obstacleSet = useMemo(
    () => new Set(arena.obstacles.map(([x, y]) => `${x},${y}`)),
    [arena],
  );

  const setDirection = useCallback((direction) => {
    const current = directionRef.current;
    if (current.x + direction.x === 0 && current.y + direction.y === 0) {
      return;
    }
    nextDirectionRef.current = direction;
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      const direction = DIRECTIONS[event.code];
      if (!direction) return;
      event.preventDefault();
      setDirection(direction);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setDirection]);

  const handleTouchStart = useCallback((event) => {
    const touch = event.touches[0];
    if (!touch) return;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }, []);

  const handleTouchEnd = useCallback(
    (event) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start) return;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const swipeThreshold = 24;

      if (Math.max(absX, absY) >= swipeThreshold) {
        setDirection(
          absX > absY
            ? deltaX > 0
              ? touchDirections.right
              : touchDirections.left
            : deltaY > 0
              ? touchDirections.down
              : touchDirections.up,
        );
        return;
      }

      const board = event.currentTarget.getBoundingClientRect();
      const tapX = touch.clientX - board.left;
      const tapY = touch.clientY - board.top;
      const fromCenterX = tapX - board.width / 2;
      const fromCenterY = tapY - board.height / 2;

      setDirection(
        Math.abs(fromCenterX) > Math.abs(fromCenterY)
          ? fromCenterX > 0
            ? touchDirections.right
            : touchDirections.left
          : fromCenterY > 0
            ? touchDirections.down
            : touchDirections.up,
      );
    },
    [setDirection],
  );

  useEffect(() => {
    drawBoard(canvasRef.current, arena, snake, food, profile, obstacleSet);
  }, [arena, food, obstacleSet, profile, snake]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (gameOverRef.current) return;

      setSnake((currentSnake) => {
        directionRef.current = nextDirectionRef.current;
        const head = currentSnake[0];
        const nextHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= BOARD_SIZE ||
          nextHead.y >= BOARD_SIZE;
        const hitSelf = currentSnake.some(
          (part) => part.x === nextHead.x && part.y === nextHead.y,
        );
        const hitObstacle = obstacleSet.has(`${nextHead.x},${nextHead.y}`);

        if (hitWall || hitSelf || hitObstacle) {
          gameOverRef.current = true;
          setGameOver(true);
          return currentSnake;
        }

        const ateFood = nextHead.x === food.x && nextHead.y === food.y;
        const nextSnake = [nextHead, ...currentSnake];

        if (ateFood) {
          setScore((currentScore) => currentScore + 10);
          setFood(createFood(nextSnake, arena));
          return nextSnake;
        }

        nextSnake.pop();
        return nextSnake;
      });
    }, level.speed);

    return () => window.clearInterval(timer);
  }, [arena, food, level.speed, obstacleSet]);

  useEffect(() => {
    if (!gameOver || saved) return;

    const result = saveScore({
      id: crypto.randomUUID(),
      name: profile.name,
      username: profile.username,
      score,
      length: snake.length,
      level: levelKey,
      speed: level.speed,
      arena: arena.name,
      createdAt: new Date().toISOString(),
    });
    setHighScore(result.isHighScore);
    setSaved(true);
  }, [
    arena.name,
    gameOver,
    level.speed,
    levelKey,
    profile,
    saved,
    score,
    snake.length,
  ]);

  return (
    <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-soft">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black uppercase text-slate-500">
              Score
            </span>
            <strong className="block text-2xl font-black text-slate-950">
              {score}
            </strong>
          </div>
          <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-black capitalize text-slate-700">
            {levelKey} level · {level.speed} ms
          </div>
        </div>

        <div
          className="relative mx-auto aspect-square w-full max-w-[min(62vh,500px)] touch-none overflow-hidden rounded-lg border-8 bg-slate-900"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={BOARD_SIZE * CELL_SIZE}
            height={BOARD_SIZE * CELL_SIZE}
            className="h-full w-full"
            aria-label="Snake game board"
          />
          {gameOver ? (
            <div className="absolute inset-0 grid place-items-center bg-slate-950/78 p-5 text-center text-white">
              <div>
                <Trophy className="mx-auto h-10 w-10 text-amber-300" />
                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  {highScore ? "Congratulations!" : "Game over"}
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {highScore
                    ? "Congratulations, you secured the high score."
                    : "Score saved to the leaderboard."}
                </p>
                <Link
                  href="/leaderboard"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-amber-300 px-4 text-sm font-black text-slate-950 transition hover:bg-amber-200"
                >
                  View leaderboard
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <h2 className="text-xl font-black text-slate-950">Controls</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Use arrow keys, WASD, board swipes, board taps, or the buttons below.
        </p>

        <div className="mx-auto mt-3 grid max-w-64 grid-cols-3 gap-2 sm:max-w-none">
          <span />
          <ControlButton label="Up" onClick={() => setDirection(touchDirections.up)}>
            <ArrowUp className="h-5 w-5" />
          </ControlButton>
          <span />
          <ControlButton
            label="Left"
            onClick={() => setDirection(touchDirections.left)}
          >
            <ArrowLeft className="h-5 w-5" />
          </ControlButton>
          <ControlButton
            label="Down"
            onClick={() => setDirection(touchDirections.down)}
          >
            <ArrowDown className="h-5 w-5" />
          </ControlButton>
          <ControlButton
            label="Right"
            onClick={() => setDirection(touchDirections.right)}
          >
            <ArrowRight className="h-5 w-5" />
          </ControlButton>
        </div>

        <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-3 text-sm">
          <Stat label="Snake length" value={snake.length} />
          <Stat label="Arena" value={arena.name} />
          <Stat label="Speed" value={`${level.speed} ms`} />
        </div>
      </aside>
    </section>
  );
}

function ControlButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid aspect-square min-h-16 touch-manipulation place-items-center rounded-md border border-slate-300 bg-white text-slate-900 transition hover:border-emerald-400 hover:bg-emerald-50 active:border-emerald-600 active:bg-emerald-100 sm:min-h-14"
    >
      {children}
    </button>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-bold text-slate-500">{label}</span>
      <strong className="text-right text-slate-950">{value}</strong>
    </div>
  );
}

function getInitialSnake() {
  return [
    { x: 8, y: 12 },
    { x: 7, y: 12 },
    { x: 6, y: 12 },
  ];
}

function createFood(snake, arena) {
  const blockedCells = new Set([
    ...snake.map((part) => `${part.x},${part.y}`),
    ...arena.obstacles.map(([x, y]) => `${x},${y}`),
  ]);

  const openCells = [];
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (!blockedCells.has(`${x},${y}`)) openCells.push({ x, y });
    }
  }

  return openCells[Math.floor(Math.random() * openCells.length)];
}

function drawBoard(canvas, arena, snake, food, profile, obstacleSet) {
  if (!canvas) return;
  const context = canvas.getContext("2d");

  context.fillStyle = arena.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      context.fillStyle = (x + y) % 2 === 0 ? arena.grid : arena.background;
      context.globalAlpha = 0.32;
      context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      context.globalAlpha = 1;

      if (obstacleSet.has(`${x},${y}`)) {
        drawRoundedCell(context, x, y, arena.wall, 4);
      }
    }
  }

  drawRoundedCell(context, food.x, food.y, profile.foodColor, 9);

  snake.forEach((part, index) => {
    drawRoundedCell(
      context,
      part.x,
      part.y,
      index === 0 ? brighten(profile.snakeColor, 34) : profile.snakeColor,
      index === 0 ? 7 : 5,
    );
  });
}

function drawRoundedCell(context, x, y, color, radius) {
  const inset = 2;
  const left = x * CELL_SIZE + inset;
  const top = y * CELL_SIZE + inset;
  const size = CELL_SIZE - inset * 2;

  context.fillStyle = color;
  context.beginPath();
  context.roundRect(left, top, size, size, radius);
  context.fill();
}

function brighten(hex, amount) {
  const value = hex.replace("#", "");
  const number = parseInt(value, 16);
  const red = Math.min(255, (number >> 16) + amount);
  const green = Math.min(255, ((number >> 8) & 255) + amount);
  const blue = Math.min(255, (number & 255) + amount);
  return `rgb(${red}, ${green}, ${blue})`;
}
