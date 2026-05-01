import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Player } from '../hooks/useBingo';
import { areGridsDuplicate } from '../utils/gameLogic';

type Props = {
  key?: React.Key;
  players: Player[];
  turnOrder: string[];
  onUpdateGrid: (playerId: string, cellIndex: number, value: number | null) => void;
  onConfirmGrid: (playerId: string) => void;
};

export function GridFillingScreen({ players, turnOrder, onUpdateGrid, onConfirmGrid }: Props) {
  const currentTurnPlayerId = turnOrder.find(id => {
    const p = players.find(p => p.id === id);
    return p && !p.hasConfirmedGrid;
  });

  const currentPlayer = players.find(p => p.id === currentTurnPlayerId) || players[0];
  const [errorString, setErrorString] = useState('');

  const duplicates = useMemo(() => {
    const counts = new Map<number, number>();
    currentPlayer.grid.forEach(v => {
      if (v !== null) counts.set(v, (counts.get(v) || 0) + 1);
    });
    return Array.from(counts.entries()).filter(([_, c]) => c > 1).map(([v]) => v);
  }, [currentPlayer.grid]);

  const filledCount = currentPlayer.grid.filter(v => v !== null).length;
  const isComplete = filledCount === 25 && duplicates.length === 0;

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isComplete) {
        if (document.activeElement?.tagName !== 'BUTTON') {
          e.preventDefault();
          handleConfirm();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isComplete, currentPlayer.id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const ROW_SIZE = 5;
    let nextIndex = index;

    switch (e.key) {
      case 'Enter':
        if (isComplete) {
          e.preventDefault();
          handleConfirm();
        }
        return;
      case 'ArrowUp':
        nextIndex = index - ROW_SIZE;
        break;
      case 'ArrowDown':
        nextIndex = index + ROW_SIZE;
        break;
      case 'ArrowLeft':
        if (index % ROW_SIZE !== 0) nextIndex = index - 1;
        break;
      case 'ArrowRight':
        if ((index + 1) % ROW_SIZE !== 0) nextIndex = index + 1;
        break;
      default:
        return; // Don't prevent default for other keys
    }

    if (nextIndex >= 0 && nextIndex < 25) {
      e.preventDefault();
      const nextInput = document.getElementById(`cell-${currentPlayer.id}-${nextIndex}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleCellChange = (index: number, val: string) => {
    setErrorString('');
    if (val === '') {
      onUpdateGrid(currentPlayer.id, index, null);
      return;
    }
    
    // Validate integer
    if (!/^\d+$/.test(val)) return; // block silently
    
    const num = parseInt(val, 10);
    
    // Range validate
    if (num < 1 || num > 25) {
      setErrorString(`Numbers must be between 1 and 25.`);
      return;
    }

    onUpdateGrid(currentPlayer.id, index, num);
  };

  const handleConfirm = () => {
    if (duplicates.length > 0) {
      setErrorString('Please resolve duplicate numbers before confirming.');
      return;
    }
    if (!isComplete) {
      setErrorString('Fill all 25 cells first.');
      return;
    }
    
    // Check against previously confirmed grids
    const confirmedPlayers = players.filter(p => p.hasConfirmedGrid);
    const isDuplicate = confirmedPlayers.some(p => areGridsDuplicate(p.grid, currentPlayer.grid));
    
    if (isDuplicate) {
      setErrorString('This exact grid already exists! Change at least one cell.');
      return;
    }

    onConfirmGrid(currentPlayer.id);
  };

  // Turn order text
  const turnOrderText = turnOrder.map(id => players.find(p => p.id === id)?.name).join(' → ');

  return (
    <motion.div
      key={currentPlayer.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl mx-auto mt-12 p-8 glass-card text-center rounded-3xl"
    >
      <div className="mb-6 opacity-60 text-sm tracking-widest uppercase font-mono">
        Turn Order: {turnOrderText}
      </div>

      <div className="mb-8">
        <h2 className="text-4xl font-display font-black" style={{ color: currentPlayer.colorTheme.hex }}>
          {currentPlayer.name}'s Turn
        </h2>
        <p className="opacity-70 mt-2">Fill your grid with numbers 1 to 25.</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-sm opacity-60">
          Filled: <span style={{ color: currentPlayer.colorTheme.hex }}>{filledCount}</span> / 25
        </div>
        <AnimatePresence mode="popLayout">
          {(errorString || duplicates.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-sm font-semibold rounded bg-red-500/10 px-3 py-1"
            >
              {errorString || `Duplicates found: ${duplicates.join(', ')}`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-5 gap-2 md:gap-3 mb-10 w-full max-w-md mx-auto">
        {currentPlayer.grid.map((val, idx) => {
          const isDuplicate = val !== null && duplicates.includes(val);
          return (
            <input
              id={`cell-${currentPlayer.id}-${idx}`}
              key={`${currentPlayer.id}-cell-${idx}`}
              type="text"
              inputMode="numeric"
              value={val === null ? '' : val}
              onChange={(e) => handleCellChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="aspect-square bg-black/40 border-2 rounded-xl text-center text-xl md:text-2xl font-bold font-display focus:outline-none focus:scale-105 transition-all text-white"
              style={{
                borderColor: isDuplicate ? '#ef4444' : (val !== null ? currentPlayer.colorTheme.hex : 'rgba(255,255,255,0.1)'),
                boxShadow: isDuplicate ? '0 0 10px rgba(239, 68, 68, 0.5)' : (val !== null ? `0 0 10px ${currentPlayer.colorTheme.shadow}` : 'none'),
                color: isDuplicate ? '#ef4444' : 'white'
              }}
            />
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!isComplete}
        className="w-full max-w-sm mx-auto block py-4 rounded-xl font-display font-black text-lg tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{
          border: `2px solid ${currentPlayer.colorTheme.hex}`,
          backgroundColor: isComplete ? currentPlayer.colorTheme.hex : 'transparent',
          color: isComplete ? '#000' : currentPlayer.colorTheme.hex,
          boxShadow: isComplete ? `0 0 20px ${currentPlayer.colorTheme.shadow}` : 'none'
        }}
      >
        CONFIRM GRID
      </button>

    </motion.div>
  );
}
