import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../utils/cn';

export function WelcomeScreen({ onStart }: { onStart: (names: string[], rounds: number, key: string) => void, key?: React.Key }) {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(['', '']);
  const [rounds, setRounds] = useState<number | ''>(3);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [names, rounds]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const newNames = [...names];
    if (newNames.length < count) {
      while (newNames.length < count) newNames.push('');
    } else {
      newNames.splice(count);
    }
    setNames(newNames);
    setError('');
  };

  const handleNameChange = (index: number, val: string) => {
    const newNames = [...names];
    newNames[index] = val;
    setNames(newNames);
    setError('');
  };

  const handleStart = () => {
    if (names.some(n => n.trim() === '')) {
      setError('All player names must be filled');
      return;
    }
    const uniqueNames = new Set(names.map(n => n.trim().toLowerCase()));
    if (uniqueNames.size !== names.length) {
      setError('No duplicate player names allowed');
      return;
    }
    if (rounds === '' || rounds < 1 || rounds > 10) {
      setError('Rounds must be between 1 and 10');
      return;
    }
    onStart(names.map(n => n.trim()), rounds, '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto mt-20 relative glass-card p-10 rounded-3xl"
    >
      <div className="text-center mb-10">
        <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-pink to-neon-orange tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          🎰 BINGO
        </h1>
        <p className="mt-4 text-gray-400">Cyberpunk Matrix Edition</p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-center text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2">Players</label>
          <div className="flex gap-4">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => handlePlayerCountChange(num)}
                className={cn(
                  "flex-1 py-3 rounded-xl border border-white/10 font-bold transition-all duration-300",
                  playerCount === num
                    ? "bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "bg-black/20 text-gray-400 hover:bg-white/10"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {names.map((name, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <input
                  type="text"
                  placeholder={`Player ${idx + 1} Name`}
                  value={name}
                  onChange={(e) => handleNameChange(idx, e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,245,255,0.3)] transition-all placeholder:text-gray-600"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2">Total Rounds</label>
          <input
            type="number"
            min={1}
            max={10}
            value={rounds}
            onChange={(e) => {
              if (e.target.value === '') {
                setRounds('');
                setError('');
                return;
              }
              let val = parseInt(e.target.value, 10);
              if (val > 10) val = 10;
              setRounds(val);
              setError('');
            }}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,0,255,0.3)] transition-all text-center text-xl font-bold font-display"
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full mt-6 py-5 rounded-2xl bg-white text-black font-display font-black text-xl tracking-wider hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
        >
          START GAME
        </button>
      </div>
    </motion.div>
  );
}
