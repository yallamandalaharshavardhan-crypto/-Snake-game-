import { useState, useEffect, useCallback, useRef } from "react";
import { Point, Direction, GameState } from "../types";
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Trophy } from "lucide-react";

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameState, setGameState] = useState<GameState>("IDLE");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextDirection = useRef<Direction>("RIGHT");

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection("RIGHT");
    nextDirection.current = "RIGHT";
    setScore(0);
    setGameState("PLAYING");
    setSpeed(INITIAL_SPEED);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") nextDirection.current = "UP";
          break;
        case "ArrowDown":
          if (direction !== "UP") nextDirection.current = "DOWN";
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") nextDirection.current = "LEFT";
          break;
        case "ArrowRight":
          if (direction !== "LEFT") nextDirection.current = "RIGHT";
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  const moveSnake = useCallback(() => {
    if (gameState !== "PLAYING") return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newDirection = nextDirection.current;
      setDirection(newDirection);

      const newHead = { ...head };
      switch (newDirection) {
        case "UP": newHead.y -= 1; break;
        case "DOWN": newHead.y += 1; break;
        case "LEFT": newHead.x -= 1; break;
        case "RIGHT": newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameState("GAME_OVER");
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameState, generateFood, highScore, score]);

  useEffect(() => {
    if (gameState === "PLAYING") {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = "#020617"; // slate-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = "rgba(148, 163, 184, 0.05)"; // slate-400
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? "#22d3ee" : "#0891b2"; // cyan-400 : cyan-600
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = "#22d3ee";
      
      // Rounded snake segments
      ctx.beginPath();
      ctx.roundRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = "#f472b6"; // pink-400
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#f472b6";
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * size, (food.y + 0.5) * size, size / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full relative" id="snake-container">
      <div className="flex justify-between w-full max-w-[400px] mt-4 px-4 relative z-10">
        <div className="flex flex-col" id="current-score">
          <p className="text-[10px] uppercase text-slate-500">Session Score</p>
          <p className="text-3xl font-mono text-lime-400 tabular-nums">{score.toString().padStart(6, '0')}</p>
        </div>
        <div className="flex flex-col items-end border-l border-slate-800 pl-8" id="high-score">
          <p className="text-[10px] uppercase text-slate-500">High Score</p>
          <p className="text-3xl font-mono text-fuchsia-500 tabular-nums">{highScore.toString().padStart(6, '0')}</p>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center p-4" id="canvas-wrapper">
         <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="rounded-lg bg-slate-950/40 block border border-white/5 active:border-cyan-500/50 transition-colors"
        />

        <AnimatePresence>
          {gameState !== "PLAYING" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
              id="game-overlay"
            >
              <div className="text-center p-8">
                {gameState === "GAME_OVER" && (
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="mb-8"
                    id="game-over-title"
                  >
                    <h2 className="text-4xl font-black text-rose-500 uppercase tracking-tighter italic">End of Sequence</h2>
                    <p className="text-slate-400 font-mono mt-2 uppercase text-xs tracking-widest">Connection Interrupted</p>
                  </motion.div>
                )}
                
                {gameState === "IDLE" && (
                   <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="mb-8"
                   id="ready-title"
                 >
                   <h2 className="text-4xl font-black text-lime-400 uppercase tracking-tighter italic">NEON COBRA</h2>
                   <p className="text-slate-400 font-mono mt-2 uppercase text-xs tracking-widest">Protocol Staged</p>
                 </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="group relative flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-cyan-500/50"
                  id="restart-button"
                >
                  <span className="uppercase tracking-widest text-[10px]">
                    {gameState === "GAME_OVER" ? "Initialize Re-Sync" : "Boot Sequence"}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {gameState === "PLAYING" && (
        <div className="absolute bottom-6 px-4 py-2 bg-black/80 border border-white/10 rounded-full text-[10px] text-slate-400 z-20 pointer-events-none">
          CONTROLS <span className="text-white font-bold font-mono mx-1">[ARROW KEYS]</span> TO NAVIGATE
        </div>
      )}
    </div>
  );
}

