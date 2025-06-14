import React, { useEffect, useState } from "react";
import "./FruitMatch4x4.css";

// No usage of PUBLIC_URL in this file


// PUBLIC_INTERFACE
/**
 * FruitMatch4x4
 * The main container/component for a modern, minimalistic, responsive 4x4 memory fruit matching game.
 */
const FRUITS = [
  "🍎", "🍌", "🍇", "🍉", "🍍", "🍊", "🥝", "🍒"
];
// We'll use these for 8 pairs, a 4x4 grid.

function shuffle(array) {
  // Fisher-Yates shuffle
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck() {
  // Returns a shuffled array of 16 cards (8 pairs of fruit)
  const cards = [];
  FRUITS.forEach((fruit, idx) => {
    cards.push({ id: idx * 2, fruit, matched: false });     // First
    cards.push({ id: idx * 2 + 1, fruit, matched: false }); // Pair
  });
  const shuffled = shuffle(cards);
  // Give each shuffled card its unique board-position id
  return shuffled.map((c, idx) => ({ ...c, boardId: idx }));
}

const FLIP_DELAY = 1000; // ms to keep flipped cards visible if not matching

// PUBLIC_INTERFACE
function FruitMatch4x4() {
  /**
   * GAME STATE:
   * - deck: array of cards ({id, fruit, matched, boardId})
   * - flipped: array of boardIds (max length: 2, current flipped/selected cards)
   * - locked: bool (prevent clicks when animating flipping back)
   * - moves: number of moves (for optional UI statistics)
   * - solved: bool (game complete if all matched)
   */
  const [deck, setDeck] = useState(createDeck());
  const [flipped, setFlipped] = useState([]); // array of boardIds
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  // Effect: check for win
  useEffect(() => {
    if (deck.every(card => card.matched)) {
      setSolved(true);
    }
  }, [deck]);

  // Handler for card click
  // PUBLIC_INTERFACE
  function handleCardClick(boardId) {
    if (locked) return;
    if (flipped.includes(boardId)) return; // Already flipped
    const card = deck[boardId];
    if (card.matched) return; // Matched cards cannot flip

    if (flipped.length === 0) {
      setFlipped([boardId]);
    } else if (flipped.length === 1) {
      setFlipped([flipped[0], boardId]);
      setLocked(true); // prevent more clicks until resolved
      setMoves(m => m + 1);

      const first = deck[flipped[0]];
      const second = deck[boardId];

      if (first.fruit === second.fruit) {
        // It's a match!
        setTimeout(() => {
          setDeck(prevDeck =>
            prevDeck.map(card =>
              (card.boardId === first.boardId || card.boardId === second.boardId)
                ? { ...card, matched: true }
                : card
            )
          );
          setFlipped([]);
          setLocked(false);
        }, 500); // minimal delay to show flip before marking as matched
      } else {
        // Not a match - flip back after short delay
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, FLIP_DELAY);
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setDeck(createDeck());
    setFlipped([]);
    setLocked(false);
    setSolved(false);
    setMoves(0);
  }

  // PUBLIC_INTERFACE
  function isFaceUp(card) {
    return card.matched || flipped.includes(card.boardId);
  }

  return (
    <div className="fruitmatch-root">
      <div className="fruitmatch-header">
        <div className="fruitmatch-title">
          <span role="img" aria-label="Fruit">🍉</span> FruitMatch 4x4
        </div>
        <button className="fruitmatch-btn fruitmatch-btn-accent" onClick={handleRestart} tabIndex={0}>
          Restart
        </button>
      </div>
      <div className="fruitmatch-stats">
        <span>Moves: <b>{moves}</b></span>
        <span className={solved ? "fruitmatch-win" : ""}>
          {solved ? "🎉 All Matched! You Win! 🎉" : ""}
        </span>
      </div>
      <div className="fruitmatch-board">
        {deck.map((card, idx) => (
          <FruitCard
            key={card.boardId}
            fruit={card.fruit}
            faceUp={isFaceUp(card)}
            matched={card.matched}
            onClick={() => handleCardClick(card.boardId)}
            disabled={locked || card.matched || flipped.length === 2}
            boardId={card.boardId}
          />
        ))}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function FruitCard({ fruit, faceUp, matched, onClick, disabled }) {
  /* Minimal, modern, color-accented card with a flip animation. */
  return (
    <button
      className={`fruitmatch-card${faceUp ? " flipped" : ""}${matched ? " matched" : ""}`}
      onClick={onClick}
      disabled={disabled}
      tabIndex={faceUp ? -1 : 0}
      aria-label={faceUp ? fruit : "Hidden card"}
      type="button"
    >
      <div className="fruitmatch-card-inner">
        <div className="fruitmatch-card-front" />
        <div className="fruitmatch-card-back">{fruit}</div>
      </div>
    </button>
  );
}

export default FruitMatch4x4;
