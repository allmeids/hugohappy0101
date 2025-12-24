import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { FlappyGame } from './components/FlappyGame';
import { Modal } from './components/Modal';
import { ScratchGameModal } from './components/ScratchGameModal';
import { VictoryModal } from './components/VictoryModal';
import { GameState } from './types';
import { Gift, Gamepad2, PlayCircle, Trophy, Terminal, Heart, Network, Sparkles, Lock } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    playedSnake: false,
    playedFlappy: false,
  });

  const [activeModal, setActiveModal] = useState<'snake' | 'flappy' | 'scratch' | 'victory' | null>(null);

  const allGamesPlayed = gameState.playedSnake && gameState.playedFlappy;

  const handleScratchWin = () => {
    setActiveModal(null);
    setTimeout(() => {
        setActiveModal('victory');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden selection:bg-pink-500 selection:text-white pb-12 font-sans">
      
      {/* HERO / HEADER */}
      <div className="relative pt-16 pb-24 px-4 overflow-hidden">
        {/* Background Gradients & Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-[#0f172a] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-bold tracking-widest mb-10 border border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles size={16} /> NÍVEL 24 DE DEZEMBRO DESBLOQUEADO
          </span>
          
          <h1 className="text-7xl md:text-9xl font-black mb-10 leading-[0.9] tracking-tighter animate-in zoom-in duration-700">
            PARABÉNS <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              HUGO!
            </span>
          </h1>
          
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-10 md:p-14 rounded-[3rem] max-w-4xl shadow-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-500 mt-8">
             <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-indigo-500 opacity-70" />
             
             <p className="text-xl md:text-3xl text-slate-300 leading-relaxed font-light">
                Nascer no dia 24 é dividir os holofotes com o Natal, mas hoje o palco é <strong className="text-white font-semibold">100% seu</strong>.
                <br/><br/>
                Mais que um amigo engraçado que levanta o astral de qualquer lugar, você é um companheiro leal e um <strong className="text-indigo-400">professor nato</strong>.
                Seja resolvendo problemas complexos ou me ensinando sobre <span className="inline-flex items-center gap-1 text-emerald-400 font-mono bg-emerald-900/30 px-3 py-1 rounded-lg text-lg"><Network size={18}/> Redes</span> e tecnologia, aprendo muito com você todos os dias.
                <br/><br/>
                Obrigado pela parceria de sempre, Mestre Hugo!
             </p>
             <div className="flex justify-center gap-8 mt-12 text-slate-500">
                <Heart className="w-8 h-8 text-pink-500 animate-pulse" fill="currentColor" />
                <Terminal className="w-8 h-8 text-emerald-500" />
                <Network className="w-8 h-8 text-indigo-500" />
             </div>
          </div>
        </div>
      </div>

      {/* GAMES SECTION */}
      <div className="py-24 px-4 bg-slate-900/50 relative border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-4 mb-4 text-white">
              <Gamepad2 className="text-pink-500 w-10 h-10" />
              O Desafio do Aniversariante
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl">
              Para provar que merece o presente duplo (Aniversário + Natal), você precisa vencer estes desafios clássicos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* GAME CARD 1 */}
            <div className={`group relative bg-slate-800 rounded-[2.5rem] p-10 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${gameState.playedSnake ? 'border-emerald-500/50 shadow-emerald-900/20' : 'border-slate-700 hover:border-emerald-500/50'}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="p-5 bg-slate-900 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <span className="retro-font text-3xl">SNAKE</span>
                </div>
                {gameState.playedSnake ? (
                    <span className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"><Trophy size={16}/> CONCLUÍDO</span>
                ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">A clássica cobrinha. Coma os pontos para crescer, mas cuidado para não bater na parede!</p>
              <button 
                onClick={() => setActiveModal('snake')}
                className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-wide ${gameState.playedSnake ? 'bg-slate-700 text-slate-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 hover:shadow-emerald-500/30'}`}
              >
                <PlayCircle size={24} /> {gameState.playedSnake ? 'Jogar Novamente' : 'Iniciar Desafio'}
              </button>
            </div>

            {/* GAME CARD 2 */}
            <div className={`group relative bg-slate-800 rounded-[2.5rem] p-10 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${gameState.playedFlappy ? 'border-pink-500/50 shadow-pink-900/20' : 'border-slate-700 hover:border-pink-500/50'}`}>
               <div className="flex justify-between items-start mb-8">
                <div className="p-5 bg-slate-900 rounded-2xl text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                  <span className="retro-font text-3xl">FLAPPY</span>
                </div>
                {gameState.playedFlappy ? (
                    <span className="bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"><Trophy size={16}/> CONCLUÍDO</span>
                ) : (
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">Controle o voo e desvie dos obstáculos. Requer precisão cirúrgica e muita paciência.</p>
              <button 
                onClick={() => setActiveModal('flappy')}
                className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-wide ${gameState.playedFlappy ? 'bg-slate-700 text-slate-300' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-900/50 hover:shadow-pink-500/30'}`}
              >
                <PlayCircle size={24} /> {gameState.playedFlappy ? 'Jogar Novamente' : 'Iniciar Desafio'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PRIZE SECTION */}
      <div className="py-24 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-indigo-950 via-[#0b0f19] to-[#0b0f19]" />
         
         <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="inline-block p-6 rounded-full bg-slate-800/50 backdrop-blur border border-slate-700 mb-8">
                <Gift className={`w-16 h-16 ${allGamesPlayed ? 'text-yellow-400 animate-bounce' : 'text-slate-600'}`} />
            </div>

            <h2 className={`text-5xl md:text-6xl font-black mb-8 ${allGamesPlayed ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600' : 'text-slate-500'}`}>
              GRANDE FINAL
            </h2>
            
            <p className="text-slate-400 text-2xl mb-12 max-w-2xl mx-auto">
              {allGamesPlayed 
                ? "Os jogos acabaram. Agora é hora de testar sua sorte na raspadinha suprema para revelar seu presente." 
                : "Complete os dois jogos acima para desbloquear o acesso à Raspadinha da Sorte."}
            </p>

            <button
                disabled={!allGamesPlayed}
                onClick={() => setActiveModal('scratch')}
                className={`
                    relative overflow-hidden group px-12 py-8 rounded-3xl font-black text-2xl tracking-wider transition-all duration-500
                    ${allGamesPlayed 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] hover:scale-105 hover:shadow-[0_0_80px_rgba(79,70,229,0.6)] cursor-pointer' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}
                `}
            >
                <span className="relative z-10 flex items-center justify-center gap-4">
                    {allGamesPlayed ? <Sparkles className="animate-pulse w-8 h-8" /> : <Lock size={24} />}
                    {allGamesPlayed ? "ABRIR RASPADINHA FINAL" : "BLOQUEADO"}
                </span>
                
                {allGamesPlayed && (
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                )}
            </button>
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

      <ScratchGameModal 
        isOpen={activeModal === 'scratch'} 
        onClose={() => setActiveModal(null)} 
        onWin={handleScratchWin}
      />

      <VictoryModal 
        isOpen={activeModal === 'victory'} 
        onClose={() => setActiveModal(null)} 
      />

    </div>
  );
}