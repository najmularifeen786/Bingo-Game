import { useState, useCallback } from 'react';
import { checkCompletedLines, COLOR_THEMES, calculateScores } from '../utils/gameLogic';

export type GamePhase = 'setup' | 'filling' | 'playing' | 'roundEnd' | 'final';

export type Player = {
  id: string;
  name: string;
  colorTheme: typeof COLOR_THEMES[0];
  grid: (number | null)[];
  score: number;
  completedLines: number;
  roundPosition: number | null;
  roundPoints: number;
  historyScores: number[];
  hasConfirmedGrid: boolean;
};

export function useBingo() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  
  // Game setup
  const startGame = useCallback((playerNames: string[], rounds: number) => {
    const initialPlayers: Player[] = playerNames.map((name, idx) => ({
      id: `p${idx}`,
      name,
      colorTheme: COLOR_THEMES[idx % COLOR_THEMES.length],
      grid: Array(25).fill(null),
      score: 0,
      completedLines: 0,
      roundPosition: null,
      roundPoints: 0,
      historyScores: [],
      hasConfirmedGrid: false,
    }));
    
    setPlayers(initialPlayers);
    setTotalRounds(rounds);
    setCurrentRound(1);
    
    // Randomize turn order for filling
    setTurnOrder(initialPlayers.map(p => p.id).sort(() => Math.random() - 0.5));
    setGamePhase('filling');
  }, []);

  // Update a player's grid cell
  const updatePlayerGrid = useCallback((playerId: string, cellIndex: number, value: number | null) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        const newGrid = [...p.grid];
        newGrid[cellIndex] = value;
        return { ...p, grid: newGrid };
      }
      return p;
    }));
  }, []);

  // Confirm grid
  const confirmPlayerGrid = useCallback((playerId: string) => {
    setPlayers(prev => {
      const next = prev.map(p => p.id === playerId ? { ...p, hasConfirmedGrid: true } : p);
      if (next.every(p => p.hasConfirmedGrid)) {
        setTimeout(() => setGamePhase('playing'), 500); // slight delay for animation
      }
      return next;
    });
  }, []);

  // Call a number and update game state
  const callNumber = useCallback((num: number) => {
    setCalledNumbers(prev => {
      const nextCalled = [...prev, num];
      
      setPlayers(currentPlayers => {
        let anyChanges = false;
        let newPlayers = currentPlayers.map(p => {
          const lines = checkCompletedLines(p.grid as number[], nextCalled);
          if (lines !== p.completedLines) {
            anyChanges = true;
            return { ...p, completedLines: lines };
          }
          return p;
        });
        
        if (!anyChanges) return currentPlayers;

        // Check if anyone completed 5 lines just now
        const finishedPlayers = newPlayers.filter(p => p.completedLines >= 5 && p.roundPosition === null);
        if (finishedPlayers.length > 0) {
          const alreadyFinishedCount = currentPlayers.filter(p => p.roundPosition !== null).length;
          finishedPlayers.forEach(fp => {
             const currentRank = alreadyFinishedCount + 1; 
             newPlayers = newPlayers.map(np => np.id === fp.id ? { ...np, roundPosition: currentRank } : np);
          });
        }
        
        // Let's check round end
        const activePlayersCount = newPlayers.filter(p => p.roundPosition === null).length;
        if (activePlayersCount <= 1 || nextCalled.length === 25) {
          // END OF ROUND LOGIC
          const isDraw = nextCalled.length === 25;
          let nextPlayers = [...newPlayers];
          
          const maxFinishedRank = Math.max(0, ...nextPlayers.map(p => p.roundPosition || 0));
          let nextRankForUnfinished = maxFinishedRank + 1;
          if (maxFinishedRank === 0) nextRankForUnfinished = 1;

          const finishersInOrder: {playerId: string}[][] = [];
          
          if (!(isDraw && maxFinishedRank === 0)) {
            const ranksMap = new Map<number, string[]>();
            nextPlayers.forEach(p => {
              let rank = p.roundPosition;
              if (rank === null) rank = nextRankForUnfinished;
              
              if (!ranksMap.has(rank)) ranksMap.set(rank, []);
              ranksMap.get(rank)!.push(p.id);
            });
            
            const sortedRanks = Array.from(ranksMap.keys()).sort((a,b)=>a-b);
            sortedRanks.forEach(r => finishersInOrder.push(ranksMap.get(r)!.map(id => ({playerId: id}))));
          }

          const calculatedScores = calculateScores(nextPlayers.length, finishersInOrder);

          nextPlayers = nextPlayers.map(p => {
            const res = calculatedScores[p.id] || { position: nextRankForUnfinished, points: 0 };
            const newScore = p.score + res.points;
            return {
              ...p,
              roundPosition: res.position,
              roundPoints: res.points,
              score: newScore,
              historyScores: [...p.historyScores, res.points],
            };
          });

          setTimeout(() => setGamePhase('roundEnd'), 2000); // Let the winning animations play briefly
          return nextPlayers;
        }

        return newPlayers;
      });
      
      return nextCalled;
    });
  }, []);
  
  const nextRound = useCallback(() => {
    if (currentRound >= totalRounds) {
      setGamePhase('final');
      return;
    }
    
    setCurrentRound(c => c + 1);
    setCalledNumbers([]);
    setPlayers(prev => prev.map(p => ({
      ...p,
      grid: Array(25).fill(null),
      completedLines: 0,
      roundPosition: null,
      roundPoints: 0,
      hasConfirmedGrid: false
    })));
    
    setTurnOrder(prev => [...prev].sort(() => Math.random() - 0.5));
    setGamePhase('filling');
  }, [currentRound, totalRounds]);

  const resetGame = useCallback(() => {
    setGamePhase('setup');
    setPlayers([]);
    setCurrentRound(1);
    setTotalRounds(1);
    setCalledNumbers([]);
    setTurnOrder([]);
  }, []);

  return {
    gamePhase,
    players,
    currentRound,
    totalRounds,
    calledNumbers,
    turnOrder,
    startGame,
    updatePlayerGrid,
    confirmPlayerGrid,
    callNumber,
    nextRound,
    resetGame
  };
}
