"use client";

import { Button } from "./Button";

type KeypadProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "-"];

export function Keypad({ value, onChange, onSubmit }: KeypadProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(value + key)}
            className="rounded-lg border border-black/20 py-3 text-lg font-semibold"
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(value.slice(0, -1))}
          className="rounded-lg border border-black/20 py-3 text-sm font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-lg border border-black/20 py-3 text-sm font-semibold"
        >
          Clear
        </button>
      </div>
      <Button
        type="button"
        onClick={onSubmit}
        className="w-full bg-accent-green text-black"
      >
        Submit
      </Button>
    </div>
  );
}
