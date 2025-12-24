import React, { useRef, useEffect, useState } from 'react';
import { SOUNDS } from '../constants';
import { Play, RotateCcw } from 'lucide-react';

interface FlappyGameProps {
  onComplete: () => void;
}

export const FlappyGame: React.FC<FlappyGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Game Constants - Tuned for 60fps
  const GRAVITY = 0.5; // Slightly stronger gravity for snap
  const JUMP = -8; // Stronger jump
  const PIPE_SPEED = 3; // Faster scroll
  const PIPE_SPAWN_RATE = 100; // More frequent pipes
  
  const birdRef = useRef({ x: 50, y: 150, velocity: 0, rotation: 0 });
  const pipesRef = useRef<{x: number, topHeight: number, passed: boolean}[]>([]);
  const frameRef = useRef(0);
  const animRef = useRef(0);

  const resetGame = () => {
    birdRef.current = { x: 50, y: 150, velocity: 0, rotation: 0 };
    pipesRef.current = [];
    frameRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const jump = () => {
    if (!isPlaying) return;
    birdRef.current.velocity = JUMP;
    new Audio(SOUNDS.JUMP).play().catch(()=>{});
  };

  const update = () => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Bird Physics
    birdRef.current.velocity += GRAVITY;
    birdRef.current.y += birdRef.current.velocity;
    // Smoother rotation
    birdRef.current.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (birdRef.current.velocity * 0.12)));

    // Pipe Spawning
    if (frameRef.current % PIPE_SPAWN_RATE === 0) {
        const gap = 160; // Slightly larger gap for playability at speed
        const minPipe = 50;
        const maxPipe = canvas.height - gap - minPipe;
        const topHeight = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
        pipesRef.current.push({ x: canvas.width, topHeight, passed: false });
    }

    // Move Pipes
    pipesRef.current.forEach(p => p.x -= PIPE_SPEED);
    if (pipesRef.current.length > 0 && pipesRef.current[0].x < -60) pipesRef.current.shift();

    // Collision Logic
    const birdRadius = 15;
    const hitBottom = birdRef.current.y + birdRadius >= canvas.height;
    const hitTop = birdRef.current.y - birdRadius <= 0;
    
    let hitPipe = false;
    pipesRef.current.forEach(pipe => {
        const pipeRight = pipe.x + 52; // Width of pipe
        const gap = 160;
        
        // Simple AABB collision with margin
        if (birdRef.current.x + birdRadius > pipe.x + 4 && birdRef.current.x - birdRadius < pipeRight - 4) {
            if (birdRef.current.y - birdRadius < pipe.topHeight || birdRef.current.y + birdRadius > pipe.topHeight + gap) {
                hitPipe = true;
            }
        }
        if (!pipe.passed && birdRef.current.x > pipeRight) {
            pipe.passed = true;
            setScore(s => s + 1);
        }
    });

    if (hitBottom || hitTop || hitPipe) {
        handleGameOver();
        return;
    }

    frameRef.current++;
    draw();
    animRef.current = requestAnimationFrame(update);
  };

  const handleGameOver = () => {
      setIsPlaying(false);
      setGameOver(true);
      new Audio(SOUNDS.GAME_OVER).play().catch(()=>{});
      onComplete();
  };

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Sky Background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#f9a8d4'); // Pink 300
      gradient.addColorStop(1, '#6366f1'); // Indigo 500
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pipes
      const gap = 160;
      pipesRef.current.forEach(pipe => {
          // Pipe Style
          ctx.fillStyle = '#1e293b'; // Slate 800
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 3;

          // Top Pipe
          ctx.fillRect(pipe.x, 0, 52, pipe.topHeight);
          ctx.strokeRect(pipe.x, 0, 52, pipe.topHeight);
          
          // Bottom Pipe
          const bottomY = pipe.topHeight + gap;
          ctx.fillRect(pipe.x, bottomY, 52, canvas.height - bottomY);
          ctx.strokeRect(pipe.x, bottomY, 52, canvas.height - bottomY);

          // Pipe Cap detail
          ctx.fillStyle = '#334155';
          ctx.fillRect(pipe.x - 2, pipe.topHeight - 20, 56, 20);
          ctx.fillRect(pipe.x - 2, bottomY, 56, 20);
      });

      // Bird
      ctx.save();
      ctx.translate(birdRef.current.x, birdRef.current.y);
      ctx.rotate(birdRef.current.rotation);
      
      // Body
      ctx.fillStyle = '#fbbf24'; // Amber 400
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(6, -6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(8, -6, 2, 0, Math.PI * 2);
      ctx.fill();

      // Wing
      ctx.fillStyle = '#f59e0b'; // Amber 500
      ctx.beginPath();
      ctx.ellipse(-5, 5, 8, 5, 0, 0, Math.PI*2);
      ctx.fill();
      
      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(20, 6);
      ctx.lineTo(10, 10);
      ctx.fill();

      ctx.restore();
  };

  useEffect(() => {
    if (isPlaying) {
        animRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying]);

  // Handle Resize
  useEffect(() => {
      const resize = () => {
          if(canvasRef.current && containerRef.current) {
              const width = Math.min(containerRef.current.clientWidth, 360);
              const height = Math.min(window.innerHeight * 0.5, 500);
              canvasRef.current.width = width;
              canvasRef.current.height = height;
              // Initial paint
              const ctx = canvasRef.current.getContext('2d');
              if(ctx) {
                   const g = ctx.createLinearGradient(0,0,0,height);
                   g.addColorStop(0, '#f9a8d4'); g.addColorStop(1, '#6366f1');
                   ctx.fillStyle = g;
                   ctx.fillRect(0,0,width,height);
                   ctx.fillStyle = 'white';
                   ctx.font = '20px Fredoka';
                   ctx.textAlign = 'center';
                   ctx.fillText("Flappy Hugo", width/2, height/3);
              }
          }
      };
      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-slate-800" ref={containerRef}>
        <div className="flex justify-between w-full px-6 py-2 bg-slate-900/50">
             <span className="text-slate-400 text-xs uppercase tracking-wider">Toque para voar</span>
             <span className="retro-font text-pink-400 text-lg">SCORE: {score}</span>
        </div>

        <div className="relative w-full flex justify-center p-4">
            <canvas 
                ref={canvasRef} 
                className="bg-slate-900 rounded-lg shadow-inner border border-slate-700 cursor-pointer touch-manipulation"
                onClick={jump}
            />
            
            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button onClick={resetGame} className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg pointer-events-auto transition-transform hover:scale-105 active:scale-95 animate-pulse">
                        <Play fill="currentColor" size={20} /> INICIAR
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg pointer-events-none">
                    <h2 className="text-2xl font-black text-white mb-2 retro-font">SPLASH!</h2>
                    <p className="text-slate-300 mb-6 font-mono text-lg">PONTOS: {score}</p>
                    <button onClick={resetGame} className="flex items-center gap-2 bg-white text-pink-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 pointer-events-auto transition-colors">
                        <RotateCcw size={18} /> REINICIAR
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};