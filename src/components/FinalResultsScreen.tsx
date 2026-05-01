import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RefreshCw, Bot } from 'lucide-react';
import type { Player } from '../hooks/useBingo';
import { fetchFinalAnalysis } from '../utils/commentator';
import { TypewriterText } from './TypewriterText';

type Props = {
  key?: React.Key;
  players: Player[];
  onRestart: () => void;
};

export function FinalResultsScreen({ players, onRestart }: Props) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onRestart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRestart]);

  useEffect(() => {
    let isMounted = true;
    const fetchIt = async () => {
      setLoading(true);
      const gameData = {
        totalScores: sortedPlayers.map(p => ({ name: p.name, totalScore: p.score })),
        roundWins: sortedPlayers.map(p => ({ 
          name: p.name, 
          wins: p.historyScores.filter(score => score === 10).length 
        })),
        winner: winner.name,
      };

      const result = await fetchFinalAnalysis(gameData);
      if (isMounted) {
        setAnalysis(result || "The Matrix has finished its calculations. The tournament has concluded.");
        setLoading(false);
      }
    };
    
    fetchIt();
    return () => { isMounted = false; };
  }, [sortedPlayers, winner.name]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <div className="text-center mb-16 relative">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <Trophy size={100} className="text-amber-400 relative z-10" />
            <div className="absolute inset-0 bg-amber-400/50 blur-[50px] rounded-full z-0"></div>
          </div>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-2">
          GRAND CHAMPION
        </h1>
        <h2 className="text-6xl font-display font-black drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{ color: winner.colorTheme.hex }}>
          {winner.name}
        </h2>
        <p className="font-mono text-2xl mt-4 opacity-80">{winner.score} PTS</p>
      </div>

      <div className="mb-12">
        {/* AI Analysis */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-40 h-40 bg-neon-blue/10 blur-[60px] rounded-full"></div>
          <h3 className="font-display font-bold text-2xl mb-6 flex items-center gap-3 relative z-10">
            <Bot className="text-neon-blue" />
            MATRIX ANALYSIS
          </h3>
          
          <div className="flex-1 overflow-y-auto relative z-10">
            {loading ? (
              <div className="flex gap-2 items-center h-8">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-white"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-white"></motion.div>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white"></motion.div>
              </div>
            ) : (
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-sans min-h-[5rem]">
                {analysis && <TypewriterText text={analysis} speed={15} />}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 py-5 rounded-2xl bg-white text-black font-display font-black text-xl tracking-wider hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all"
      >
        <RefreshCw size={24} />
        PLAY AGAIN
      </button>

    </motion.div>
  );
}
