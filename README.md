# 🎰 BINGO Game — Cyberpunk Edition

A sleek, browser-based Bingo game with a **Cyberpunk / Matrix visual theme**, built with React and deployed on Google Cloud Run. Originally conceived and scaffolded using **Google AI Studio**, this project reimagines the classic paper-and-pencil Bingo experience for a single screen.

---

## ✨ Features

- **Cyberpunk Visual Identity** — High-contrast, neon-lit interface with glassmorphism, glowing text effects, and smooth animations
- **2–4 Player Support** — Enter custom player names and play together on a single screen
- **Randomized Turn Order** — Fair and automatic turn ordering at the start of every round
- **Interactive 5×5 Grid System** — Each player personally fills their grid with numbers 1–25 before the match begins
- **Smart Duplicate Detection** — No two players can share the exact same grid
- **Dynamic Number Calling** — Numbers are drawn randomly with no repeats within a round
- **Color-Coded Highlighting** — Each player gets a unique color; matched cells are highlighted in real time
- **12-Line Win Condition** — Win by completing ANY 5 of 12 possible lines (5 rows, 5 columns, 2 diagonals)
- **Tie-Breaking Scoring System** — Tied players share full points; the next rank is skipped automatically
- **Real-Time Leaderboard** — Track scores across multiple rounds with a final tournament summary
- **Responsive Design** — Crafted for both desktop and mobile layouts

---

## 📊 Scoring System

| Players | 1st | 2nd | 3rd | 4th |
|---------|-----|-----|-----|-----|
| 2P | 10 | 0 | — | — |
| 3P | 10 | 5 | 0 | — |
| 4P | 10 | 7 | 3 | 0 |

**Tie Rule:** Tied players both receive the full points for that position. The next rank is skipped.
> *Example: Tie for 2nd in a 4-player game → both players get 7 pts; the next player receives 4th place (0 pts).*

---

## 🎮 How to Play

1. **Setup** — Enter player names (2–4 players). Turn order is randomized automatically.
2. **Fill Grids** — Each player takes a turn filling their 5×5 grid with any numbers from 1–25. No two grids can be identical.
3. **Number Draw** — The system draws random numbers one by one, never repeating within a round.
4. **Highlighting** — Any number on your grid that matches a drawn number gets highlighted in your player color.
5. **Win a Round** — Be the first to complete **any 5 of the 12 possible lines** (rows, columns, or diagonals).
6. **Scoring** — Points are awarded based on finishing position. Play through all rounds to crown the ultimate Bingo Champion!

---

## 🛠️ Built With

| Tool | Purpose |
|------|---------|
| [React 18](https://reactjs.org/) | UI framework |
| [Vite](https://vitejs.dev/) | Build tooling & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://motion.dev/) | Animations & transitions |
| [Lucide React](https://lucide.dev/) | Icons |
| [Google AI Studio](https://aistudio.google.com/) | AI-assisted development |
| [Google Cloud Run](https://cloud.google.com/run) | Deployment |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/najmularifeen786/Bingo-Game.git
cd Bingo-Game

# Install dependencies
npm install

# Start the development server
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

Optimized static files will be output to the `dist/` directory, ready for deployment to Vercel, Netlify, GitHub Pages, or Google Cloud Run.

---

## 🌐 Live Demo

🔗 **Play now:** [bingo-game-272313840462.asia-southeast1.run.app](https://bingo-game-272313840462.asia-southeast1.run.app/)

---

## 💡 The Story Behind It

Every idea I came up with for [#AISeekho2026](https://www.linkedin.com/search/results/all/?keywords=%23aiseekho2026) by Google Developer Pakistan had already been posted. Even asking AI for help returned the same suggestions everyone else was getting.

So I stopped. And went back to my own childhood.

**Bingo** — a game I used to play on paper with friends. Simple, fun, full of memories. The challenge of adapting it to a single screen made it genuinely interesting to solve.

> *When AI gives everyone the same ideas, go back to your own memories. That's where the unique ones live.*



---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
