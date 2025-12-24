import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ScratchCard } from './ScratchCard';
import { IMAGES, SOUNDS } from '../constants';
import { Skull, Gem, Gift, PartyPopper, Frown, Gamepad2, Ticket, Heart, Zap, Clover, Wand2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScratchGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onWin: () => void;
}

// Configuração das fases
const STAGES = [
    {
        id: 1,
        title: "Cartela 1: Aquecimento",
        instruction: "Ache 3 símbolos iguais para ganhar.",
        // 6 items total for better UX
        symbols: [
            { icon: <Skull className="text-slate-600 w-10 h-10" />, id: 's1' },
            { icon: <Frown className="text-blue-500 w-10 h-10" />, id: 's2' },
            { icon: <Zap className="text-yellow-500 w-10 h-10" />, id: 's3' },
            { icon: <Heart className="text-red-500 w-10 h-10" />, id: 's4' },
            { icon: <Clover className="text-green-500 w-10 h-10" />, id: 's5' },
            { icon: <Gamepad2 className="text-purple-500 w-10 h-10" />, id: 's6' },
        ],
        resultMessage: "Ixe... nada combinando. Tente a próxima!",
        buttonText: "Tentar Cartela 2",
        isWin: false
    },
    {
        id: 2,
        title: "Cartela 2: A Esperança",
        instruction: "Ache 3 Diamantes!",
        symbols: [
            { icon: <Gem className="text-cyan-500 w-10 h-10" />, id: 'win1' },
            { icon: <Gem className="text-cyan-500 w-10 h-10" />, id: 'win2' }, // 2nd match
            { icon: <Skull className="text-slate-600 w-10 h-10" />, id: 's3' },
            { icon: <Frown className="text-blue-500 w-10 h-10" />, id: 's4' },
            { icon: <Zap className="text-yellow-500 w-10 h-10" />, id: 's5' },
            { icon: <Heart className="text-red-500 w-10 h-10" />, id: 's6' },
        ],
        resultMessage: "TRAVE!! Quase veio... Essa última vai dar bom.",
        buttonText: "Última Tentativa (Bônus)",
        isWin: false
    },
    {
        id: 3,
        title: "Cartela Final: O VOUCHER",
        instruction: "Ache 3 Logos do XBOX (R$ 60)",
        // 3 Xbox logos = WIN
        symbols: [
            { icon: <img src={IMAGES.VOUCHER} className="w-10 h-10 object-contain" alt="Xbox Logo" />, id: 'win1' },
            { icon: <img src={IMAGES.VOUCHER} className="w-10 h-10 object-contain" alt="Xbox Logo" />, id: 'win2' },
            { icon: <img src={IMAGES.VOUCHER} className="w-10 h-10 object-contain" alt="Xbox Logo" />, id: 'win3' }, // 3rd match!
            { icon: <Heart className="text-red-500 w-10 h-10" />, id: 's4' },
            { icon: <Zap className="text-yellow-500 w-10 h-10" />, id: 's5' },
            { icon: <Clover className="text-green-500 w-10 h-10" />, id: 's6' },
        ],
        resultMessage: "VOCÊ GANHOU!!!",
        buttonText: "Resgatar Prêmio",
        isWin: true
    }
];

const shuffle = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
};

export const ScratchGameModal: React.FC<ScratchGameModalProps> = ({ isOpen, onClose, onWin }) => {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [scratchedCount, setScratchedCount] = useState(0);
    const [roundComplete, setRoundComplete] = useState(false);
    const [shuffledSymbols, setShuffledSymbols] = useState<any[]>([]);
    const [forceRevealAll, setForceRevealAll] = useState(false);

    const currentStage = STAGES[currentStageIndex];

    useEffect(() => {
        if (isOpen) {
            setShuffledSymbols(shuffle(currentStage.symbols));
            setScratchedCount(0);
            setRoundComplete(false);
            setForceRevealAll(false);
        }
    }, [currentStageIndex, isOpen]);

    const handleScratch = () => {
        const newCount = scratchedCount + 1;
        setScratchedCount(newCount);

        // If all squares scratched
        if (newCount >= 6) {
            handleRoundComplete();
        }
    };

    const handleScratchAll = () => {
        if (roundComplete) return;
        setForceRevealAll(true);
        // Simulate completion after delay
        setTimeout(() => {
            setRoundComplete(true);
            handleRoundCompleteLogic();
        }, 500);
    };

    const handleRoundComplete = () => {
        if (roundComplete) return;
        setRoundComplete(true);
        handleRoundCompleteLogic();
    };

    const handleRoundCompleteLogic = () => {
        if (currentStage.isWin) {
            new Audio(SOUNDS.VICTORY_FINAL).play().catch(()=>{});
            triggerConfetti();
            setTimeout(() => {
                onWin(); // Trigger parent victory modal
            }, 1500);
        } else {
            new Audio(SOUNDS.WIN_SHORT).play().catch(()=>{});
        }
    };

    const nextStage = () => {
        if (currentStageIndex < STAGES.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
        }
    };

    const triggerConfetti = () => {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="RASPADINHA DA SORTE" maxWidth="max-w-xl">
            <div className="flex flex-col items-center p-8 bg-slate-900 min-h-[500px]">
                
                {/* Header Info */}
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-yellow-400 mb-2">{currentStage.title}</h3>
                    <p className="text-slate-400 text-base">{currentStage.instruction}</p>
                </div>

                {/* Grid of Scratch Cards (3x2) */}
                <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-lg mx-auto">
                    {shuffledSymbols.map((item, index) => (
                        <div key={`${currentStage.id}-${index}`} className="aspect-square">
                            <ScratchCard 
                                id={index}
                                isLocked={false}
                                prize={<div className="scale-110 transform">{item.icon}</div>}
                                onScratchComplete={handleScratch}
                                forceReveal={forceRevealAll}
                                className="w-full h-full rounded-xl border-2 border-slate-600 shadow-lg"
                            />
                        </div>
                    ))}
                </div>

                {/* Footer / Progression */}
                <div className="mt-auto w-full text-center h-24 flex flex-col justify-center items-center">
                    {!roundComplete ? (
                        <div className="flex flex-col gap-3">
                            <p className="text-slate-500 animate-pulse text-sm">Raspe os quadrados...</p>
                            <button 
                                onClick={handleScratchAll}
                                className="flex items-center gap-2 text-indigo-400 hover:text-white transition-colors text-sm font-semibold bg-indigo-500/10 hover:bg-indigo-500 px-4 py-2 rounded-full border border-indigo-500/20"
                            >
                                <Wand2 size={14} /> RASPAR TUDO AGORA
                            </button>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-bottom duration-500 w-full">
                            <p className={`text-xl font-bold mb-6 ${currentStage.isWin ? "text-green-400" : "text-white"}`}>
                                {currentStage.resultMessage}
                            </p>
                            
                            {!currentStage.isWin && (
                                <button 
                                    onClick={nextStage}
                                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-lg shadow-indigo-900/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                                >
                                    {currentStage.buttonText} <Ticket size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};