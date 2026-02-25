import type { Deck, OpType, Question } from "./types";

const deckATarget = 4500;
const deckBTarget = 3500;

export function getTargetMs(deck: Deck) {
  return deck === "A" ? deckATarget : deckBTarget;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(deck: Deck): Question {
  if (deck === "A") {
    const a = randInt(100, 999);
    const b = randInt(100, 999);
    const op: OpType = Math.random() > 0.5 ? "add" : "sub";
    const prompt = op === "add" ? `${a} + ${b}` : `${a} - ${b}`;
    const correct = op === "add" ? a + b : a - b;
    return {
      deck,
      op_type: op,
      prompt,
      correct_answer: String(correct),
      source: "new",
      srs_item_id: null,
    };
  }

  const a = randInt(10, 99);
  const b = randInt(2, 9);
  const op: OpType = Math.random() > 0.5 ? "mul" : "div";

  if (op === "mul") {
    return {
      deck,
      op_type: "mul",
      prompt: `${a} × ${b}`,
      correct_answer: String(a * b),
      source: "new",
      srs_item_id: null,
    };
  }

  const dividend = a * b;
  return {
    deck,
    op_type: "div",
    prompt: `${dividend} ÷ ${b}`,
    correct_answer: String(dividend / b),
    source: "new",
    srs_item_id: null,
  };
}
