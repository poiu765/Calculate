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
            className="rounded-xl border border-black/20 bg-white py-3 text-lg font-semibold shadow-sm active:scale-[0.98]"
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(value.slice(0, -1))}
          className="rounded-xl border border-black/20 bg-white py-3 text-sm font-semibold shadow-sm active:scale-[0.98]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded-xl border border-black/20 bg-white py-3 text-sm font-semibold shadow-sm active:scale-[0.98]"
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
