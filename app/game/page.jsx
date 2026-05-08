"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge, Play, RotateCcw } from "lucide-react";
import PageShell from "@/components/PageShell";
import SnakeGame from "@/components/SnakeGame";
import { getArena, levels } from "@/lib/arenaData";
import { getProfile, getSelectedArena } from "@/lib/storage";

export default function GamePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [arena, setArena] = useState(null);
  const [levelKey, setLevelKey] = useState("easy");
  const [customSpeed, setCustomSpeed] = useState(100);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    const storedProfile = getProfile();
    const arenaId = getSelectedArena();

    if (!storedProfile) {
      router.replace("/");
      return;
    }

    if (!arenaId) {
      router.replace("/arena");
      return;
    }

    setProfile(storedProfile);
    setArena(getArena(arenaId));
  }, [router]);

  if (!profile || !arena) {
    return (
      <PageShell compact gameFit>
        <div className="rounded-lg bg-white p-8 text-center font-bold text-slate-600 shadow-soft">
          Loading game...
        </div>
      </PageShell>
    );
  }

  const selectedLevel =
    levelKey === "custom"
      ? {
          ...levels.custom,
          speed: customSpeed,
          description: `Custom speed is ${customSpeed} ms per move. Lower values are faster.`,
        }
      : levels[levelKey];

  return (
    <PageShell compact gameFit>
      <section className="mb-2 grid gap-2 sm:mb-3 sm:gap-3 lg:grid-cols-[1fr_400px]">
        <div>
          <h1 className="text-xl font-black text-slate-950 sm:text-3xl">
            {arena.name}
          </h1>
          <p className="mt-1 hidden max-w-2xl text-sm leading-5 text-slate-600 sm:block sm:leading-6">
            Player: <strong>{profile.username}</strong>. Use arrow keys or WASD
            on keyboard, or the touch controls below the board.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-soft sm:p-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 text-xs font-black text-slate-800 sm:gap-2 sm:text-sm">
              <Gauge className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
              Level speed
            </div>
            {levelKey === "custom" ? (
              <label className="flex items-center gap-2 text-xs font-black text-slate-600">
                <span>Speed</span>
                <input
                  type="number"
                  min="45"
                  max="300"
                  step="5"
                  value={customSpeed}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isNaN(value)) return;
                    setCustomSpeed(Math.min(300, Math.max(45, value)));
                    setGameKey((current) => current + 1);
                  }}
                  className="h-8 w-16 rounded-md border border-slate-300 px-2 text-xs font-black text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:h-9 sm:w-20 sm:text-sm"
                  aria-label="Custom snake speed in milliseconds"
                />
                <span>ms</span>
              </label>
            ) : null}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
            {Object.entries(levels).map(([key, level]) => {
              const isActive = levelKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setLevelKey(key);
                    setGameKey((current) => current + 1);
                  }}
                  className={`h-8 rounded-md border px-1 text-[11px] font-black transition sm:h-10 sm:px-2 sm:text-sm ${
                    isActive
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 hidden text-xs leading-5 text-slate-500 sm:block">
            {selectedLevel.description}
          </p>
        </div>
      </section>

      <SnakeGame
        key={gameKey}
        arena={arena}
        levelKey={levelKey}
        level={selectedLevel}
        profile={profile}
      />

      <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:flex sm:flex-wrap sm:gap-3">
        <button
          type="button"
          onClick={() => setGameKey((current) => current + 1)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 text-xs font-black text-slate-800 transition hover:bg-slate-50 sm:h-11 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          Reset round
        </button>
        <button
          type="button"
          onClick={() => setGameKey((current) => current + 1)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-slate-950 px-2 text-xs font-black text-white transition hover:bg-emerald-800 sm:h-11 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          Start again
        </button>
      </div>
    </PageShell>
  );
}
