import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Player } from '../hooks/useBingo';
import { AICommentator } from './AICommentator';
import { Trophy } from 'lucide-react';

type Props = {
  key?: React.Key;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  calledNumbersCount: number;
  onNext: () => void;
};

export function RoundResultsScreen({ players, currentRound, totalRounds, calledNumbersCount, onNext }: Props) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext]);

  // Sort players by round position. 0 means they didn't finish or draw.
  const sortedPlayers = [...players].sort((a, b) => {
     if (a.roundPosition === null) return 1;
     if (b.roundPosition === null) return -1;
     return a.roundPosition - b.roundPosition;
  });

  const leaderboardPlayers = [...players].sort((a, b) => b.score - a.score);

  const gameData = useMemo(() => {
    // Determine ties
    const posCounts = new Map<number, number>();
    players.forEach(p => {
      if (p.roundPosition) {
        posCounts.set(p.roundPosition, (posCounts.get(p.roundPosition) || 0) + 1);
      }
    });
    const tiesOccurred = Array.from(posCounts.values()).some(count => count > 1);

    // Consecutive winner check
    let consecutiveWinner = null;
    const firstPlacePlayers = players.filter(p => p.roundPosition === 1);
    if (firstPlacePlayers.length === 1 && currentRound > 1) {
      const p = firstPlacePlayers[0];
      // Check last round
      const prevPoints = p.historyScores[p.historyScores.length - 2];
      const maxPointsPossible = 10; // 1st is always 10
      if (prevPoints === maxPointsPossible) {
        consecutiveWinner = p.name;
      }
    }

    return {
      round: `${currentRound}/${totalRounds}`,
      positions: sortedPlayers.map(p => ({
        name: p.name,
        position: p.roundPosition || players.length, // fallback
        pointsEarned: p.roundPoints
      })),
      numbersCalledCount: calledNumbersCount,
      totalScores: players.map(p => ({ name: p.name, totalScore: p.score })),
      tiesOccurred,
      consecutiveWinner
    };
  }, [players, currentRound, totalRounds, calledNumbersCount, sortedPlayers]);

  const isFinal = currentRound >= totalRounds;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-3xl mx-auto mt-12 p-8 flex flex-col gap-8"
    >
      <div className="text-center mb-6">
        <h2 className="text-5xl font-display font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          ROUND {currentRound} COMPLETE
        </h2>
        <p className="mt-2 font-mono opacity-60">Numbers called: {calledNumbersCount} / 25</p>
      </div>

      <div className="w-full flex flex-col gap-8">
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="flex justify-between p-4 border-b border-white/10 font-mono text-xs uppercase tracking-widest opacity-60">
            <div>Position / Player</div>
            <div>Earned</div>
          </div>
          
          {sortedPlayers.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex justify-between items-center p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="font-display font-bold text-2xl opacity-80 backdrop-blur-sm">
                  #{p.roundPosition || '-'}
                </div>
                <div className="font-display font-bold text-xl" style={{ color: p.colorTheme.hex }}>
                  {p.name}
                </div>
              </div>
              <div className="text-right font-mono font-bold inline-flex items-center gap-1 text-green-400">
                +{p.roundPoints} <span className="text-sm">pts</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div>
          <AICommentator gameData={gameData} />

          <button
            onClick={onNext}
            className="w-full mt-10 py-5 rounded-2xl bg-white text-black font-display font-black text-xl tracking-wider hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
          >
            {isFinal ? "FINAL CHAMPIONSHIP RESULTS (ENTER)" : "START NEXT ROUND (ENTER)"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
