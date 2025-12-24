import React, { useState } from 'react';
import { Copy, Check, Trophy, PartyPopper, Sparkles } from 'lucide-react';
import { IMAGES, VOUCHER_CODE } from '../constants';
import { Modal } from './Modal';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(VOUCHER_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="PARABÉNS!!!" maxWidth="max-w-2xl">
      <div className="flex flex-col items-center p-10 text-center bg-gradient-to-br from-green-900 via-slate-900 to-black relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/20 to-transparent pointer-events-none" />
        <div className="absolute top-10 right-10 text-yellow-500/20 animate-spin-slow">
            <Sparkles size={100} />
        </div>

        <div className="relative mb-8 z-10">
          <div className="absolute inset-0 bg-green-500 blur-[60px] opacity-40 animate-pulse" />
          <img 
            src={IMAGES.VOUCHER} 
            alt="Xbox Logo" 
            className="relative w-48 h-48 object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.6)] animate-bounce-slow"
          />
        </div>

        <h2 className="relative z-10 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 mb-6 retro-font tracking-tighter">
          VOCÊ GANHOU!
        </h2>
        
        <div className="relative z-10 bg-slate-800/80 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 mb-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-bold text-green-400 mb-2 uppercase tracking-widest">Gift Card Digital Xbox</h3>
            <p className="text-3xl font-black text-white mb-6">R$ 60,00</p>
            
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Você provou ser digno! Enfrentou a cobra, voou com estilo e teve a sorte grande.
              Esse é o seu presente duplo (Natal + Aniversário) para gastar como quiser na loja!
            </p>

            <div className="bg-black/60 border-2 border-dashed border-green-500/50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-col items-start">
                    <span className="text-xs text-slate-500 uppercase font-bold">Código de Resgate</span>
                    <code className="text-2xl font-mono font-bold text-yellow-400 tracking-wider">
                        {VOUCHER_CODE}
                    </code>
                </div>
                <button 
                    onClick={handleCopy}
                    className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-900/50"
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                    {copied ? "COPIADO!" : "COPIAR"}
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Tire um print para não perder!</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-400 z-10">
          <PartyPopper size={18} className="text-pink-500" />
          <span>Feliz Aniversário, Hugo!</span>
          <Trophy size={18} className="text-yellow-500" />
        </div>
      </div>
    </Modal>
  );
};