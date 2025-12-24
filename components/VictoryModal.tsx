import React, { useState } from 'react';
import { Copy, Check, Trophy, PartyPopper } from 'lucide-react';
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
    <Modal isOpen={isOpen} onClose={onClose} title="PARABÉNS!" maxWidth="max-w-xl">
      <div className="flex flex-col items-center p-8 text-center bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900">
        
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-30 animate-pulse" />
          <img 
            src={IMAGES.VOUCHER} 
            alt="Voucher Xbox" 
            className="relative w-48 h-auto object-contain drop-shadow-2xl animate-bounce-slow"
          />
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-500 mb-4 retro-font">
          PRESENTAÇO DESBLOQUEADO!
        </h2>
        
        <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
          Você provou ser digno! Enfrentou a cobra, voou com estilo e teve a sorte grande.
          <br/>
          Aqui está o seu passaporte para a diversão:
        </p>

        <div className="w-full max-w-sm bg-black/40 border-2 border-yellow-500/50 rounded-xl p-4 flex items-center justify-between mb-8 backdrop-blur-md">
          <code className="text-xl font-mono font-bold text-yellow-400 tracking-wider">
            {VOUCHER_CODE}
          </code>
          <button 
            onClick={handleCopy}
            className="ml-4 p-2 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 rounded-lg transition-all active:scale-95 flex items-center gap-2 font-bold"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? "COPIADO!" : "COPIAR"}
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <PartyPopper size={16} className="text-pink-500" />
          <Trophy size={16} className="text-yellow-500" />
        </div>
      </div>
    </Modal>
  );
};