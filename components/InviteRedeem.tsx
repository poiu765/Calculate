"use client";

import { useState } from "react";
import { Button } from "./Button";

export function InviteRedeem() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRedeem() {
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/invite/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Unable to redeem code.");
    } else {
      setStatus("Linked to teacher.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide">
          Link to teacher
        </label>
        <input
          className="w-full rounded-md border border-black/20 px-3 py-2 text-sm"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Invite code"
        />
      </div>
      <Button onClick={handleRedeem} disabled={loading} className="bg-accent-yellow text-black">
        {loading ? "Linking..." : "Redeem code"}
      </Button>
      {status && <p className="text-xs text-black/70">{status}</p>}
    </div>
  );
}
