"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Map } from "lucide-react";
import PageShell from "@/components/PageShell";
import { arenas } from "@/lib/arenaData";
import { getProfile, saveSelectedArena } from "@/lib/storage";

export default function ArenaPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getProfile()) router.replace("/");
  }, [router]);

  function chooseArena(arenaId) {
    saveSelectedArena(arenaId);
    router.push("/game");
  }

  return (
    <PageShell>
      <section className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm font-black text-emerald-900">
            <Map className="h-4 w-4" aria-hidden="true" />
            Playing ground
          </div>
          <h1 className="text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
            Choose your arena.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Each ground has its own colors, border feel, and obstacle layout.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {arenas.map((arena) => (
          <article
            key={arena.id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft"
          >
            <div
              className="checker-board grid h-52 place-items-center border-b border-slate-200 p-5"
              style={{ backgroundColor: arena.background }}
            >
              <MiniArena arena={arena} />
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-slate-950">
                  {arena.name}
                </h2>
                <span
                  className={`h-8 w-16 rounded-md bg-gradient-to-r ${arena.accent}`}
                  aria-hidden="true"
                />
              </div>
              <p className="min-h-12 text-sm leading-6 text-slate-600">
                {arena.description}
              </p>

              <button
                type="button"
                onClick={() => chooseArena(arena.id)}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-emerald-800"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                Select and pick level
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}

function MiniArena({ arena }) {
  const cells = Array.from({ length: 64 }, (_, index) => index);
  const obstacleSet = new Set(
    arena.obstacles.map(([x, y]) => `${Math.floor(x / 3)},${Math.floor(y / 3)}`),
  );

  return (
    <div
      className="grid h-36 w-36 grid-cols-8 gap-1 rounded-lg border-4 p-2"
      style={{ borderColor: arena.wall, backgroundColor: arena.background }}
    >
      {cells.map((cell) => {
        const x = cell % 8;
        const y = Math.floor(cell / 8);
        const filled = obstacleSet.has(`${x},${y}`);

        return (
          <span
            key={cell}
            className="rounded-sm"
            style={{
              backgroundColor: filled ? arena.wall : arena.grid,
              opacity: filled ? 1 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
}
