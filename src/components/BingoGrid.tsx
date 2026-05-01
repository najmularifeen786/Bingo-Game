import React from 'react';
import { motion } from 'motion/react';
import type { Player } from '../hooks/useBingo';
import { cn } from '../utils/cn';
import { WINNING_LINES } from '../utils/gameLogic';

type Props = {
  key?: React.Key;
  player: Player;
  calledNumbers: number[];
};

export function BingoGrid({ player, calledNumbers }: Props) {
  const isFinished = player.completedLines >= 5;

  const getLineCoordinates = (lineIndex: number) => {
    if (lineIndex < 5) { // Rows
      const y = (lineIndex * 20) + 10;
      return { x1: 0, y1: y, x2: 100, y2: y };
    } else if (lineIndex < 10) { // Cols
      const x = ((lineIndex - 5) * 20) + 10;
      return { x1: x, y1: 0, x2: x, y2: 100 };
    } else if (lineIndex === 10) { // Diag 1
      return { x1: 0, y1: 0, x2: 100, y2: 100 };
    } else { // Diag 2
      return { x1: 100, y1: 0, x2: 0, y2: 100 };
    }
  };

  const completedLineIndices: number[] = [];
  if (calledNumbers.length > 0) {
    const calledSet = new Set(calledNumbers);
    WINNING_LINES.forEach((line, idx) => {
      if (line.every(i => player.grid[i] !== null && calledSet.has(player.grid[i] as number))) {
        completedLineIndices.push(idx);
      }
    });
  }

  return (
    <div className={cn("glass-card p-4 border-l-4 relative overflow-hidden transition-all duration-500", 
      isFinished ? "bg-white/10" : "opacity-80")}
      style={{ 
        borderColor: isFinished ? 'var(--color-gold)' : player.colorTheme.hex,
        boxShadow: isFinished ? `0 0 20px var(--color-gold)` : 'none'
      }}
    >
      <div className="flex justify-between items-center mb-4 relative z-40">
        <span className="font-display text-sm font-bold tracking-widest" style={{ color: player.colorTheme.hex, textShadow: `0 0 10px ${player.colorTheme.hex}` }}>
          {player.name}
        </span>
        <span className="text-xs font-bold" style={{ color: isFinished ? 'var(--color-gold)' : player.colorTheme.hex }}>
          {isFinished ? `FINISHED #${player.roundPosition || 1}!` : `${player.completedLines} LINES`}
        </span>
      </div>

      <div className={cn("grid grid-cols-5 gap-1.5 md:gap-2 relative w-full")}>
        {player.grid.map((num, idx) => {
          const isCalled = num !== null && calledNumbers.includes(num);

          return (
            <div
              key={idx}
              className={cn(
                "aspect-square flex items-center justify-center border text-sm md:text-lg font-bold font-sans transition-all duration-300"
              )}
              style={{
                borderColor: 'rgba(255,255,255,0.05)',
                backgroundColor: isCalled ? player.colorTheme.hex : 'transparent',
                color: isCalled ? '#000' : 'rgba(255,255,255,0.7)'
              }}
            >
              {num}
            </div>
          );
        })}

        {completedLineIndices.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ overflow: 'visible' }}>
            {completedLineIndices.map(lineIdx => {
              const coords = getLineCoordinates(lineIdx);
              return (
                <line
                  key={lineIdx}
                  x1={`${coords.x1}%`} y1={`${coords.y1}%`}
                  x2={`${coords.x2}%`} y2={`${coords.y2}%`}
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                />
              );
            })}
          </svg>
        )}

        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-transparent backdrop-blur-sm rounded-xl"
          >
            <div className="bg-amber-400 text-black px-6 py-2 rounded-full font-display font-black text-3xl rotate-[-10deg] shadow-[0_0_20px_rgba(251,191,36,0.8)] border-4 border-black">
              WINNER!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
