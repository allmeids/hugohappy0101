import React, { useRef, useEffect, useState } from 'react';
import { Lock } from 'lucide-react';

interface ScratchCardProps {
    id: number | string;
    isLocked: boolean;
    prize: React.ReactNode; 
    onScratchComplete: () => void;
    className?: string;
    forceReveal?: boolean;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ id, isLocked, prize, onScratchComplete, className = "", forceReveal = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Watch for forceReveal prop
    useEffect(() => {
        if (forceReveal && !isRevealed) {
            setIsRevealed(true);
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.style.transition = 'opacity 0.5s ease-out';
                canvas.style.opacity = '0';
                canvas.style.pointerEvents = 'none';
            }
        }
    }, [forceReveal, isRevealed]);

    // Inicialização da pintura da raspadinha
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        let attempt = 0;
        const maxAttempts = 20; // Try for ~2 seconds max

        const initCanvas = () => {
            if (isRevealed) return;

            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            // Critical Fix: Wait for layout to be stable and non-zero (modal animation support)
            if (width === 0 || height === 0) {
                if (attempt < maxAttempts) {
                    attempt++;
                    setTimeout(initCanvas, 100);
                }
                return;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.globalCompositeOperation = 'source-over';

            // Gradiente Prateado Luxuoso
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#94a3b8'); 
            gradient.addColorStop(0.2, '#f8fafc'); 
            gradient.addColorStop(0.4, '#cbd5e1'); 
            gradient.addColorStop(0.6, '#e2e8f0'); 
            gradient.addColorStop(0.8, '#f1f5f9'); 
            gradient.addColorStop(1, '#64748b'); 

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Padrão de logos (Ruído)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            for(let i=0; i<width; i+=20) {
                for(let j=0; j<height; j+=20) {
                    if ((i+j)%40 === 0) ctx.fillRect(i, j, 10, 10);
                }
            }

            // Textos
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 1;
            
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 16px Fredoka'; 
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("RASPE", width/2, height/2);
            
            ctx.shadowBlur = 0;
            
            // Only reveal prize AFTER the cover is painted
            requestAnimationFrame(() => {
                setIsReady(true);
            });
        };

        // Initialize with a small delay to allow DOM render
        const timeout = setTimeout(initCanvas, 50);
        
        const handleResize = () => {
            setIsReady(false); // Hide prize while resizing
            initCanvas();
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', handleResize);
        };

    }, [isLocked, isRevealed, id]); // Added ID to force repaint on new card

    const handleStart = () => setIsScratching(true);
    const handleEnd = () => setIsScratching(false);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isScratching || isRevealed || isLocked) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2); // Increased brush size slightly
        ctx.fill();
        
        checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Optimization: check a smaller sample of pixels
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        const step = 64; // Check fewer pixels for performance
        const totalPixelsToCheck = pixels.length / step;

        for (let i = 0; i < pixels.length; i += step) {
            if (pixels[i + 3] < 128) {
                transparentPixels++;
            }
        }

        if ((transparentPixels / totalPixelsToCheck) * 100 > 35) { // Lower threshold slightly
            reveal();
        }
    };

    const reveal = () => {
        if (isRevealed) return;
        setIsRevealed(true);
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.style.transition = 'opacity 0.3s ease-out';
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
        }
        onScratchComplete();
    };

    return (
        <div ref={containerRef} className={`relative bg-white overflow-hidden shadow-inner transform transition-transform select-none ${className} ${isRevealed ? 'bg-indigo-50' : 'bg-slate-200'}`}>
            {/* O Prêmio - Only visible when canvas is ready (painted) */}
            <div className={`absolute inset-0 flex items-center justify-center p-2 text-center transition-opacity duration-300 z-10 ${isReady ? 'opacity-100' : 'opacity-0'} ${isRevealed ? 'animate-in zoom-in duration-300' : ''}`}>
                {prize}
            </div>

            {/* O Bloqueio */}
            {isLocked && (
                <div className="absolute inset-0 bg-slate-900/95 z-30 flex items-center justify-center backdrop-blur-sm">
                    <Lock size={20} className="text-slate-500" />
                </div>
            )}

            {/* A Tinta */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-20 touch-none cursor-crosshair ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
                style={{ transition: 'opacity 0.5s' }}
                onMouseDown={handleStart}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onMouseMove={handleMove}
                onTouchStart={handleStart}
                onTouchEnd={handleEnd}
                onTouchMove={handleMove}
            />
        </div>
    );
};