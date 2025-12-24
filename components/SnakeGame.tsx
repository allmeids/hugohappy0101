import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SOUNDS, COLORS } from '../constants';
import { Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface SnakeGameProps {
  onComplete: () => void;
}

const TILE_COUNT = 20;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const snakeRef = useRef<{x: number, y: number}[]>([{x: 10, y: 10}]);
  const foodRef = useRef<{x: number, y: number}>({x: 15, y: 15});
  const dirRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const nextDirRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const animationFrameRef = useRef<number>(0);
  const lastRenderTimeRef = useRef(0);

  const resetGame = () => {
    snakeRef.current = [{x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}]; // Start with a small tail
    foodRef.current = {x: 15, y: 15};
    dirRef.current = {x: 0, y: -1}; // Start moving up
    nextDirRef.current = {x: 0, y: -1};
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const update = useCallback((time: number) => {
    if (gameOver || !isPlaying) return;

    const speed = 130; // ms per frame
    const secondsSinceLastRender = (time - lastRenderTimeRef.current) / 1000;
    
    if (secondsSinceLastRender < speed / 1000) {
      animationFrameRef.current = requestAnimationFrame(update);
      return;
    }
    
    lastRenderTimeRef.current = time;

    // Movement Logic
    dirRef.current = nextDirRef.current;
    
    const head = { ...snakeRef.current[0] };
    head.x += dirRef.current.x;
    head.y += dirRef.current.y;

    // Colisão (Paredes ou Corpo)
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT || 
        snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
      handleGameOver();
      return;
    }

    snakeRef.current.unshift(head);

    // Comer
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 1);
      new Audio(SOUNDS.JUMP).play().catch(()=>{});
      
      let newFood;
      do {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
      } while (snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y));
      
      foodRef.current = newFood;
    } else {
      snakeRef.current.pop();
    }

    draw();
    animationFrameRef.current = requestAnimationFrame(update);
  }, [isPlaying, gameOver]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    new Audio(SOUNDS.GAME_OVER).play().catch(()=>{});
    onComplete();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = canvas.width / TILE_COUNT;

    // Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid (subtle)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for(let i=0; i<=TILE_COUNT; i++) {
        ctx.moveTo(i*gridSize, 0);
        ctx.lineTo(i*gridSize, canvas.height);
        ctx.moveTo(0, i*gridSize);
        ctx.lineTo(canvas.width, i*gridSize);
    }
    ctx.stroke();

    // Food (Pulse Effect)
    const centerX = foodRef.current.x * gridSize + gridSize/2;
    const centerY = foodRef.current.y * gridSize + gridSize/2;
    
    ctx.fillStyle = '#f43f5e'; // Rose 500
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snakeRef.current.forEach((part, index) => {
        const x = part.x * gridSize;
        const y = part.y * gridSize;
        const radius = gridSize / 2;
        const cx = x + radius;
        const cy = y + radius;

        if (index === 0) {
            // Head
            ctx.fillStyle = '#10b981'; // Emerald 500
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();

            // Eyes (based on direction)
            ctx.fillStyle = 'white';
            const eyeOffset = radius * 0.4;
            const eyeSize = radius * 0.25;
            
            let lx = cx, ly = cy, rx = cx, ry = cy;
            
            if (dirRef.current.x === 1) { // Right
                lx += eyeOffset; ly -= eyeOffset;
                rx += eyeOffset; ry += eyeOffset;
            } else if (dirRef.current.x === -1) { // Left
                lx -= eyeOffset; ly -= eyeOffset;
                rx -= eyeOffset; ry += eyeOffset;
            } else if (dirRef.current.y === 1) { // Down
                lx -= eyeOffset; ly += eyeOffset;
                rx += eyeOffset; ry += eyeOffset;
            } else { // Up
                lx -= eyeOffset; ly -= eyeOffset;
                rx += eyeOffset; ry -= eyeOffset;
            }

            ctx.beginPath(); ctx.arc(lx, ly, eyeSize, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(rx, ry, eyeSize, 0, Math.PI*2); ctx.fill();

            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath(); ctx.arc(lx, ly, eyeSize/2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(rx, ry, eyeSize/2, 0, Math.PI*2); ctx.fill();

        } else {
            // Body - Gradient Effect
            const isTail = index === snakeRef.current.length - 1;
            const opacity = isTail ? 0.6 : 1;
            ctx.fillStyle = `rgba(52, 211, 153, ${opacity})`; // Emerald 400
            
            // Make body parts slightly smaller to look like segments
            ctx.beginPath();
            ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
            ctx.fill();
        }
    });
  };

  useEffect(() => {
    if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isPlaying, update]);

  // Handle Resize
  useEffect(() => {
      const resize = () => {
          if(canvasRef.current && containerRef.current) {
              const width = Math.min(containerRef.current.clientWidth, 400);
              canvasRef.current.width = width;
              canvasRef.current.height = width;
              draw();
          }
      };
      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
  }, []);

  // Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (!isPlaying) return;
        const key = e.key;
        
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            e.preventDefault();
        }

        if (key === 'ArrowUp' && dirRef.current.y !== 1) nextDirRef.current = {x: 0, y: -1};
        if (key === 'ArrowDown' && dirRef.current.y !== -1) nextDirRef.current = {x: 0, y: 1};
        if (key === 'ArrowLeft' && dirRef.current.x !== 1) nextDirRef.current = {x: -1, y: 0};
        if (key === 'ArrowRight' && dirRef.current.x !== -1) nextDirRef.current = {x: 1, y: 0};
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  const handleMobileControl = (x: number, y: number) => {
    if (!isPlaying) return;
    if (x === 0 && y === -1 && dirRef.current.y !== 1) nextDirRef.current = {x, y};
    if (x === 0 && y === 1 && dirRef.current.y !== -1) nextDirRef.current = {x, y};
    if (x === -1 && y === 0 && dirRef.current.x !== 1) nextDirRef.current = {x, y};
    if (x === 1 && y === 0 && dirRef.current.x !== -1) nextDirRef.current = {x, y};
  };

  return (
    <div className="flex flex-col items-center w-full bg-slate-800" ref={containerRef}>
        <div className="flex justify-between w-full px-6 py-2 bg-slate-900/50">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Use as setas</span>
            <span className="retro-font text-emerald-400 text-lg">SCORE: {score}</span>
        </div>
        
        <div className="relative w-full flex justify-center p-4">
            <canvas ref={canvasRef} className="bg-slate-900 rounded-lg shadow-inner border border-slate-700" />
            
            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg">
                    <button onClick={resetGame} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 animate-pulse">
                        <Play fill="currentColor" size={20} /> START
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg">
                    <h2 className="text-2xl font-black text-white mb-2 retro-font">GAME OVER</h2>
                    <p className="text-slate-300 mb-6 font-mono text-lg">PONTOS: {score}</p>
                    <button onClick={resetGame} className="flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
                        <RotateCcw size={18} /> REINICIAR
                    </button>
                </div>
            )}
        </div>

        {/* Mobile D-Pad */}
        <div className="grid grid-cols-3 gap-2 pb-6 md:hidden">
            <div />
            <button className="bg-slate-700 p-4 rounded-xl active:bg-emerald-600 shadow-lg text-white" onClick={() => handleMobileControl(0, -1)}><ArrowUp /></button>
            <div />
            <button className="bg-slate-700 p-4 rounded-xl active:bg-emerald-600 shadow-lg text-white" onClick={() => handleMobileControl(-1, 0)}><ArrowLeft /></button>
            <button className="bg-slate-700 p-4 rounded-xl active:bg-emerald-600 shadow-lg text-white" onClick={() => handleMobileControl(0, 1)}><ArrowDown /></button>
            <button className="bg-slate-700 p-4 rounded-xl active:bg-emerald-600 shadow-lg text-white" onClick={() => handleMobileControl(1, 0)}><ArrowRight /></button>
        </div>
    </div>
  );
};