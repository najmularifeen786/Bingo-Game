export const WINNING_LINES = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

export const SCORING_MATRIX: Record<number, number[]> = {
  2: [10, 0],          // 1st, 2nd
  3: [10, 5, 0],       // 1st, 2nd, 3rd
  4: [10, 7, 3, 0],    // 1st, 2nd, 3rd, 4th
};

export const COLOR_THEMES = [
  { name: 'blue', hex: '#00f5ff', shadow: 'rgba(0, 245, 255, 0.5)' },
  { name: 'pink', hex: '#ff00ff', shadow: 'rgba(255, 0, 255, 0.5)' },
  { name: 'green', hex: '#00ff88', shadow: 'rgba(0, 255, 136, 0.5)' },
  { name: 'orange', hex: '#ff8800', shadow: 'rgba(255, 136, 0, 0.5)' },
];

export function checkCompletedLines(grid: number[], calledNumbers: number[]): number {
  const calledSet = new Set(calledNumbers);
  let completed = 0;
  for (const line of WINNING_LINES) {
    if (line.every((index) => calledSet.has(grid[index]))) {
      completed++;
    }
  }
  return completed;
}

export function areGridsDuplicate(grid1: (number|null)[], grid2: (number|null)[]): boolean {
  if (grid1.length !== grid2.length) return false;
  for (let i = 0; i < grid1.length; i++) {
    if (grid1[i] !== grid2[i]) return false;
  }
  return true;
}

export function generateAvailableNumber(calledNumbers: number[], maxNumber: number = 25): number | null {
  const available = [];
  const calledSet = new Set(calledNumbers);
  for (let i = 1; i <= maxNumber; i++) {
    if (!calledSet.has(i)) {
      available.push(i);
    }
  }
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Calculates scores for a round considering ties
// positions is an array of arrays representing players who finished at each placement step.
// For example, if two players finish first, they are in positions[0]. Unfinished players are placed last.
export function calculateScores(playersCount: number, finishersInOrder: {playerId: string}[][]): Record<string, {position: number, points: number}> {
  const scores = SCORING_MATRIX[playersCount];
  const results: Record<string, {position: number, points: number}> = {};
  
  let currentRank = 1;

  for (const group of finishersInOrder) {
    if (group.length === 0) continue;
    
    // Players in this group all get `currentRank` position and points
    const pointsIndex = currentRank - 1; 
    const pointsEarnd = pointsIndex < scores.length ? scores[pointsIndex] : 0;
    
    for (const p of group) {
      results[p.playerId] = { position: currentRank, points: pointsEarnd };
    }
    
    // Next rank jumps by the number of players in the tie
    currentRank += group.length;
  }

  return results;
}
