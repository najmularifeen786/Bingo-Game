export async function fetchAICommentary(gameData: any): Promise<string | null> {
  const { tiesOccurred, positions, round } = gameData;
  
  if (tiesOccurred) {
    return "A stalemate?! What an intense round. The players are so perfectly matched that even the math gave up. You're like a pair of tangled headphones: confusing, inseparable, and honestly, a little bit impressive.";
  }
  
  const firstPlace = positions.find((p: any) => p.position === 1);
  const secondPlace = positions.find((p: any) => p.position === 2);
  
  if (firstPlace) {
    const winnerName = firstPlace.name;
    const runnerUpName = secondPlace ? secondPlace.name : "the competition";
    return `Incredible performance, ${winnerName}! You tracked those numbers like a pro. ${runnerUpName}, don't sweat it—try focusing on the center squares early next time, or maybe just wear ${winnerName}'s lucky socks.`;
  }
  
  return "What a round! Everyone showed an incredible performance.";
}

export async function fetchFinalAnalysis(gameData: any): Promise<string | null> {
  return "What a whirlwind! From the first call to the final daub, the tension was palpable. We saw strategic marking and near-misses at every turn. Thanks for playing, and remember: in Bingo, you’re only one number away from glory or total silence.";
}
