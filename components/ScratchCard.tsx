import React, { useRef, useEffect, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface ScratchCardProps {
    id: number;
    isLocked: boolean;
    prize: string;
    onScratchComplete: () => void;
    image?: string; 
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ id, isLocked, prize, onScratchComplete, image }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    // Inicialização da pintura da raspadinha
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const initCanvas = () => {
            if (isRevealed) return; // Se já revelou, não desenha mais a tinta

            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            // Ajusta o tamanho do canvas para casar com o container
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Garante que estamos desenhando POR CIMA (reset)
            ctx.globalCompositeOperation = 'source-over';

            // Gradiente Prateado Holográfico
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#94a3b8'); // Slate 400
            gradient.addColorStop(0.2, '#e2e8f0'); // Slate 200 (Brilho)
            gradient.addColorStop(0.4, '#94a3b8'); // Slate 400
            gradient.addColorStop(0.6, '#cbd5e1'); // Slate 300
            gradient.addColorStop(0.8, '#f1f5f9'); // Slate 100 (Brilho)
            gradient.addColorStop(1, '#64748b'); // Slate 500

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Efeito de "Glitter" / Ruído
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            for(let i=0; i<150; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 2;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI*2);
                ctx.fill();
            }

            // Textos da camada cinza
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 2;
            
            ctx.fillStyle = '#475569';
            ctx.font = 'bold 22px Fredoka';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("RASPE AQUI", width/2, height/2);
            
            ctx.font = '12px Fredoka';
            ctx.fillStyle = '#64748b';
            ctx.fillText("✨ Prêmios Ocultos ✨", width/2, height/2 + 25);
            
            ctx.shadowBlur = 0; // Reset shadow
        };

        // Chama a inicialização
        initCanvas();

        // Adiciona um pequeno delay e um listener de resize para garantir 
        // que o canvas pegue o tamanho correto após o layout renderizar
        const timeout = setTimeout(initCanvas, 100);
        window.addEventListener('resize', initCanvas);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', initCanvas);
        };

    }, [isLocked, isRevealed]); 

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

        // Ativa o modo "borracha"
        ctx.globalCompositeOperation = 'destination-out';
        
        // Pincel de raspar
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Verifica se já raspou o suficiente
        // (Debounce leve para performance poderia ser adicionado aqui, mas para este caso simples direto funciona bem)
        checkScratchPercentage();
    };

    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Amostragem de pixels para ver quanto foi apagado
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        
        // Verifica a cada 64 pixels para performance
        const step = 64; 
        const totalPixelsToCheck = pixels.length / step;

        for (let i = 0; i < pixels.length; i += step) {
            // Se o canal alpha (i+3) for baixo, está transparente
            if (pixels[i + 3] < 128) {
                transparentPixels++;
            }
        }

        const percentage = (transparentPixels / totalPixelsToCheck) * 100;
        
        // Se raspou mais de 45%, libera tudo
        if (percentage > 45) { 
            setIsRevealed(true);
            canvas.style.transition = 'opacity 0.5s ease-out';
            canvas.style.opacity = '0';
            canvas.style.pointerEvents = 'none';
            onScratchComplete();
        }
    };

    return (
        <div ref={containerRef} className="relative w-full h-48 bg-white rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] border-4 border-slate-200 select-none">
            {/* O Prêmio (Fica por baixo) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50 ${isRevealed ? 'animate-pulse-slow' : ''}`}>
                {image ? (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                         <div className="text-yellow-500 mb-2 drop-shadow-sm"><Sparkles size={32} /></div>
                         <h3 className="text-2xl font-black text-slate-800 tracking-tight drop-shadow-sm">{prize}</h3>
                    </div>
                ) : (
                    <>
                        <div className="text-yellow-500 mb-1 drop-shadow-sm"><Sparkles size={24} /></div>
                        <h3 className="text-xl font-bold text-slate-800">{prize}</h3>
                    </>
                )}
            </div>

            {/* O Bloqueio (Fica por cima de tudo se estiver bloqueado) */}
            {isLocked && (
                <div className="absolute inset-0 bg-slate-900/95 z-30 flex flex-col items-center justify-center text-slate-400 p-4 backdrop-blur-sm">
                    <div className="bg-slate-800 p-4 rounded-full mb-3 shadow-lg border border-slate-700">
                        <Lock size={28} className="text-red-400" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-500">Bloqueado</p>
                    <p className="text-sm text-center text-slate-300">Jogue e raspe os anteriores</p>
                </div>
            )}

            {/* O Canvas (Tinta raspável) - Fica por cima do prêmio, mas abaixo do bloqueio */}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-20 touch-none cursor-crosshair ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
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