"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";

type Invite = {
  code: string;
  created_at: string;
  expires_at: string | null;
};

export function InviteManager() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadInvites() {
    const res = await fetch("/api/invite/create");
    const data = await res.json();
    if (res.ok) setInvites(data.invites ?? []);
  }

  async function createInvite() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/invite/create", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to create invite.");
    }
    await loadInvites();
    setLoading(false);
  }

  useEffect(() => {
    loadInvites();
  }, []);

  return (
    <div className="space-y-3">
      <Button onClick={createInvite} disabled={loading} className="bg-accent-yellow text-black">
        {loading ? "Creating..." : "Create invite code"}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="space-y-2">
        {invites.map((invite) => (
          <div key={invite.code} className="rounded-md border border-black/10 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{invite.code}</span>
              <span className="text-xs text-black/60">
                {new Date(invite.created_at).toLocaleDateString()}
              </span>
            </div>
            {invite.expires_at && (
              <p className="text-xs text-black/60">
                Expires: {new Date(invite.expires_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}
        {!invites.length && <p className="text-xs text-black/60">No invite codes yet.</p>}
      </div>
    </div>
  );
}
