export type Deck = "A" | "B";
export type OpType = "add" | "sub" | "mul" | "div";
export type Role = "student" | "teacher";

export type SrsItemStatus = "active" | "graduated";

export type Question = {
  deck: Deck;
  op_type: OpType;
  prompt: string;
  correct_answer: string;
  source: "srs" | "new";
  srs_item_id?: string | null;
};
