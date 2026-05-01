import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Player } from '../hooks/useBingo';
import { BingoGrid } from './BingoGrid';
import { generateAvailableNumber } from '../utils/gameLogic';
import { Dices } from 'lucide-react';

type Props = {
  key?: React.Key;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  calledNumbers: number[];
  onCallNumber: (num: number) => void;
};

export function GameScreen({ players, currentRound, totalRounds, calledNumbers, onCallNumber }: Props) {
  const [announcingNum, setAnnouncingNum] = useState<number | null>(null);

  const currentTieGroup = useMemo(() => {
    const finishedPlayers = players.filter(p => p.roundPosition !== null);
    if (finishedPlayers.length < 2) return null;
    
    // Get the maximum roundPosition assigned so far
    const maxPos = Math.max(...finishedPlayers.map(p => p.roundPosition as number));
    
    // Find all players who received this exact roundPosition
    const tiedPlayers = finishedPlayers.filter(p => p.roundPosition === maxPos);
    
    return tiedPlayers.length > 1 ? tiedPlayers : null;
  }, [players]);

  const handleGenerate = () => {
    if (announcingNum !== null) return;
    
    const num = generateAvailableNumber(calledNumbers);
    if (num !== null) {
      setAnnouncingNum(num);
      setTimeout(() => {
        setAnnouncingNum(null);
        onCallNumber(num);
      }, 500); // 0.5 second popup
    }
  };

  const getGridCols = () => {
    if (players.length === 2) return "grid-cols-1 md:grid-cols-2";
    if (players.length === 3) return "grid-cols-1 md:grid-cols-3";
    return "grid-cols-1 md:grid-cols-2"; // 4 players
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen py-8 px-4 max-w-[1400px] mx-auto flex flex-col relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[-1]">
        <div className="font-display text-[15vw] md:text-[120px] font-black text-white/5 select-none tracking-widest">BINGO</div>
      </div>
      
      {/* Top Bar */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="font-display text-3xl font-bold tracking-tighter" style={{ textShadow: '0 0 10px var(--color-neon-blue)' }}>🎰 BINGO</span>
          <span className="px-3 py-1 glass-card text-xs uppercase tracking-widest text-gray-400">
            Round {currentRound} / {totalRounds}
          </span>
        </div>
        
        <div className="flex gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {players.map(p => (
            <div key={p.id} className="flex flex-col items-end min-w-[80px]">
              <span className="text-[10px] uppercase text-gray-500">
                {p.name}
              </span>
              <span className="font-display text-xl" style={{ color: p.colorTheme.hex }}>
                {p.score} pts
              </span>
            </div>
          ))}
          <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[10px] uppercase text-gray-500">Last Number</span>
            <span className="font-display text-xl text-white">
              {calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : '-'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 gap-6 mb-6 overflow-hidden flex-col lg:flex-row relative">
        
        {/* Tie Banner */}
        <AnimatePresence>
          {currentTieGroup && announcingNum === null && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-zinc-900 border-4 border-amber-400 text-white px-8 py-4 rounded-3xl shadow-[0_0_40px_rgba(251,191,36,0.5)] flex flex-col items-center gap-2"
            >
              <span className="font-display font-black text-3xl text-amber-400 tracking-widest">🚨 TIE DETECTED 🚨</span>
              <span className="font-sans font-bold text-lg">{currentTieGroup.map(p => p.name).join(' & ')} reached BINGO simultaneously!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grids */}
        <div className={`flex-1 grid ${getGridCols()} gap-4 content-start`}>
          {players.map(p => (
            <BingoGrid key={p.id} player={p} calledNumbers={calledNumbers} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-48 glass-card flex flex-col p-4 max-h-[600px]">
          <span className="font-display text-[10px] uppercase text-gray-500 mb-4 tracking-widest">Numbers Called</span>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap gap-2 content-start">
              {[...calledNumbers].reverse().map((num, i) => (
                <span 
                  key={num} 
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    borderColor: i === 0 ? 'var(--color-neon-blue)' : 'rgba(255,255,255,0.2)',
                    color: i === 0 ? 'var(--color-neon-blue)' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {num}
                </span>
              ))}
              {calledNumbers.length === 0 && (
                <div className="text-center w-full opacity-40 font-sans text-sm mt-10">No numbers called yet.</div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleGenerate}
              disabled={announcingNum !== null || calledNumbers.length === 25}
              className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-pink rounded-xl text-black font-display font-extrabold uppercase tracking-widest shadow-[0_0_30px_rgba(255,0,255,0.4)] hover:scale-105 transition-transform disabled:opacity-50"
            >
              GENERATE
            </button>
            <div className="text-center mt-3 text-xs opacity-50 font-sans uppercase">
              Remaining: {25 - calledNumbers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Announcing Popup */}
      <AnimatePresence>
        {announcingNum !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm"
          >
            <div className="glass-card px-12 py-10 border-2 flex flex-col items-center" style={{ borderColor: 'var(--color-neon-blue)', boxShadow: '0 0 50px rgba(0, 245, 255, 0.5)' }}>
              <span className="font-display text-7xl font-bold" style={{ textShadow: '0 0 10px var(--color-neon-blue)', color: 'var(--color-neon-blue)' }}>{announcingNum}</span>
              <span className="text-xs uppercase tracking-[0.4em] mt-2 text-white">New Number</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </motion.div>
  );
}
