import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useBingo } from './hooks/useBingo';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GridFillingScreen } from './components/GridFillingScreen';
import { GameScreen } from './components/GameScreen';
import { RoundResultsScreen } from './components/RoundResultsScreen';
import { FinalResultsScreen } from './components/FinalResultsScreen';

export default function App() {
  const {
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
  } = useBingo();

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <AnimatePresence mode="wait">
        {gamePhase === 'setup' && (
          <WelcomeScreen key="welcome" onStart={startGame} />
        )}
        
        {gamePhase === 'filling' && (
          <GridFillingScreen 
            key="filling"
            players={players} 
            turnOrder={turnOrder}
            onUpdateGrid={updatePlayerGrid}
            onConfirmGrid={confirmPlayerGrid}
          />
        )}
        
        {gamePhase === 'playing' && (
          <GameScreen 
            key="playing"
            players={players}
            currentRound={currentRound}
            totalRounds={totalRounds}
            calledNumbers={calledNumbers}
            onCallNumber={callNumber}
          />
        )}
        
        {gamePhase === 'roundEnd' && (
          <RoundResultsScreen 
            key="roundEnd"
            players={players}
            currentRound={currentRound}
            totalRounds={totalRounds}
            calledNumbersCount={calledNumbers.length}
            onNext={nextRound}
          />
        )}

        {gamePhase === 'final' && (
          <FinalResultsScreen 
            key="final"
            players={players}
            onRestart={resetGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

