import { Card } from "./Card";

type StatProps = {
  label: string;
  value: string | number;
};

export function Stat({ label, value }: StatProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="h-1 w-12 rounded-full bg-accent-yellow" />
      <span className="text-xs uppercase tracking-wide text-black/60">{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
    </Card>
  );
}
