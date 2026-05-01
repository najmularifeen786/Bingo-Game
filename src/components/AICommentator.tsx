import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchAICommentary } from '../utils/commentator';
import { TypewriterText } from './TypewriterText';

type Props = {
  gameData: any;
};

export function AICommentator({ gameData }: Props) {
  const [commentary, setCommentary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchIt = async () => {
      setLoading(true);
      const result = await fetchAICommentary(gameData);
      if (isMounted) {
        setCommentary(result || "Whoops, lost connection to the neural net. Moving on!");
        setLoading(false);
      }
    };
    
    fetchIt();
    return () => { isMounted = false; };
  }, [gameData]);

  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 blur-[50px] rounded-full"></div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-white/10 p-3 rounded-2xl">
          <Bot className="text-neon-pink" size={32} />
        </div>
        
        <div className="flex-1">
          <h4 className="font-display font-bold text-neon-pink mb-2">Matrix Commentator</h4>
          
          {loading ? (
            <div className="flex gap-2 items-center h-8">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-white"></motion.div>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-white"></motion.div>
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white"></motion.div>
            </div>
          ) : (
            <p className="text-gray-300 leading-relaxed font-sans min-h-[3rem]">
              {commentary && <TypewriterText text={commentary} />}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

