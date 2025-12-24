import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SnakeGame } from './components/SnakeGame';
import { FlappyGame } from './components/FlappyGame';
import { ScratchCard } from './components/ScratchCard';
import { Modal } from './components/Modal';
import { VictoryModal } from './components/VictoryModal';
import { GameState, ScratchState } from './types';
import { SOUNDS } from './constants';
import { Gift, Gamepad2, PlayCircle, Trophy, Terminal, Heart, Network } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    playedSnake: false,
    playedFlappy: false,
  });

  const [scratchState, setScratchState] = useState<ScratchState>({
    card1: false,
    card2: false,
    card3: false,
  });

  const [activeModal, setActiveModal] = useState<'snake' | 'flappy' | 'victory' | null>(null);

  const allGamesPlayed = gameState.playedSnake && gameState.playedFlappy;
  const canScratchFinal = allGamesPlayed && scratchState.card1 && scratchState.card2;

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleScratch3 = () => {
    setScratchState(prev => ({ ...prev, card3: true }));
    triggerConfetti();
    new Audio(SOUNDS.VICTORY_FINAL).play().catch(()=>{});
    setTimeout(() => setActiveModal('victory'), 1500); // Open modal after short delay
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden selection:bg-pink-500 selection:text-white pb-12">
      
      {/* HERO / HEADER */}
      <div className="relative pt-12 pb-16 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest mb-6 border border-indigo-500/30">
            NÍVEL 24 DE DEZEMBRO DESBLOQUEADO
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            PARABÉNS <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              HUGO!
            </span>
          </h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl max-w-2xl shadow-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-500">
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-indigo-500" />
             
             <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                Nascer no dia 24 é dividir os holofotes com o Natal, mas hoje o palco é <strong className="text-white">100% seu</strong>.
                <br/><br/>
                Mais que um amigo engraçado que levanta o astral de qualquer lugar, você é um companheiro leal e um <strong className="text-indigo-400">professor nato</strong>.
                Seja resolvendo problemas complexos ou me ensinando sobre <span className="inline-flex items-center gap-1 text-emerald-400 font-mono bg-emerald-900/30 px-1 rounded"><Network size={14}/> Redes</span> e tecnologia, aprendo muito com você todos os dias.
                <br/><br/>
                Obrigado pela parceria de sempre, Mestre Hugo!
             </p>
             <div className="flex justify-center gap-4 mt-6 text-slate-500">
                <Heart className="w-6 h-6 text-pink-500 animate-pulse" fill="currentColor" />
                <Terminal className="w-6 h-6 text-emerald-500" />
                <Network className="w-6 h-6 text-indigo-500" />
             </div>
          </div>
        </div>
      </div>

      {/* GAMES SECTION */}
      <div className="py-16 px-4 bg-slate-900/50 relative border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2">
              <Gamepad2 className="text-pink-500" />
              O Desafio do Aniversariante
            </h2>
            <p className="text-slate-400">
              Prove suas habilidades para liberar seu presente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* GAME CARD 1 */}
            <div className={`group relative bg-slate-800 rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl ${gameState.playedSnake ? 'border-emerald-500/50 shadow-emerald-900/20' : 'border-slate-700 hover:border-emerald-500'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 group-hover:text-white transition-colors">
                  <span className="retro-font text-xl">SNAKE</span>
                </div>
                {gameState.playedSnake && <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Trophy size={12}/> FEITO</span>}
              </div>
              <p className="text-slate-400 text-sm mb-6">A clássica cobrinha. Coma os pontos para crescer, mas não bata na parede!</p>
              <button 
                onClick={() => setActiveModal('snake')}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${gameState.playedSnake ? 'bg-slate-700 text-slate-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50'}`}
              >
                <PlayCircle size={18} /> {gameState.playedSnake ? 'JOGAR NOVAMENTE' : 'JOGAR AGORA'}
              </button>
            </div>

            {/* GAME CARD 2 */}
            <div className={`group relative bg-slate-800 rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-xl ${gameState.playedFlappy ? 'border-pink-500/50 shadow-pink-900/20' : 'border-slate-700 hover:border-pink-500'}`}>
               <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-900 rounded-xl text-pink-400 group-hover:text-white transition-colors">
                  <span className="retro-font text-xl">FLAPPY</span>
                </div>
                {gameState.playedFlappy && <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Trophy size={12}/> FEITO</span>}
              </div>
              <p className="text-slate-400 text-sm mb-6">Controle o voo e desvie dos obstáculos. Requer precisão cirúrgica.</p>
              <button 
                onClick={() => setActiveModal('flappy')}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${gameState.playedFlappy ? 'bg-slate-700 text-slate-300' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/50'}`}
              >
                <PlayCircle size={18} /> {gameState.playedFlappy ? 'JOGAR NOVAMENTE' : 'JOGAR AGORA'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRIZE SECTION */}
      <div className="py-20 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#0b0f19]" />
         <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold flex items-center justify-center gap-3 mb-2 text-yellow-500">
                <Gift className="animate-bounce" />
                Área de Recompensas
              </h2>
              <p className="text-slate-400">
                {allGamesPlayed 
                  ? "Jogos completados! Raspe os cartões para descobrir seu destino." 
                  : "Complete os jogos acima para desbloquear a raspadinha final!"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <ScratchCard 
                  id={1} 
                  isLocked={false} 
                  prize="Um abraço de urso!" 
                  onScratchComplete={() => {
                      setScratchState(prev => ({...prev, card1: true}));
                      new Audio(SOUNDS.WIN_SHORT).play().catch(()=>{});
                  }} 
              />
              <ScratchCard 
                  id={2} 
                  isLocked={false} 
                  prize="Aquele Parabéns!" 
                  onScratchComplete={() => {
                      setScratchState(prev => ({...prev, card2: true}));
                      new Audio(SOUNDS.WIN_SHORT).play().catch(()=>{});
                  }} 
              />
              <div className="relative">
                 <ScratchCard 
                    id={3} 
                    isLocked={!canScratchFinal} 
                    prize="GIFT CARD XBOX" 
                    onScratchComplete={handleScratch3} 
                 />
                 {!canScratchFinal && (
                    <div className="absolute top-2 right-2 z-30">
                       <span className="flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                         BLOQUEADO
                       </span>
                    </div>
                 )}
              </div>
            </div>
         </div>
      </div>

      {/* MODALS */}
      <Modal 
        isOpen={activeModal === 'snake'} 
        onClose={() => setActiveModal(null)} 
        title="SNAKE"
      >
        <SnakeGame onComplete={() => setGameState(prev => ({...prev, playedSnake: true}))} />
      </Modal>

      <Modal 
        isOpen={activeModal === 'flappy'} 
        onClose={() => setActiveModal(null)} 
        title="FLAPPY"
      >
        <FlappyGame onComplete={() => setGameState(prev => ({...prev, playedFlappy: true}))} />
      </Modal>

      <VictoryModal 
        isOpen={activeModal === 'victory'} 
        onClose={() => setActiveModal(null)} 
      />

    </div>
  );
}