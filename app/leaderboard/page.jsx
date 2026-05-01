"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw, Trophy } from "lucide-react";
import PageShell from "@/components/PageShell";
import { clearLeaderboard, getLeaderboard } from "@/lib/storage";

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const bestScore = useMemo(() => scores[0], [scores]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, []);

  function resetScores() {
    clearLeaderboard();
    setScores([]);
  }

  return (
    <PageShell>
      <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-sm font-black text-amber-900">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            Leaderboard
          </div>
          <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">
            Saved scores
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Scores are saved in this browser after each game over.
          </p>
        </div>

        <button
          type="button"
          onClick={resetScores}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-black text-slate-800 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Clear scores
        </button>
      </section>

      {bestScore ? (
        <section className="mb-5 rounded-lg bg-slate-950 p-6 text-white shadow-soft">
          <span className="text-xs font-black uppercase text-amber-300">
            Current best
          </span>
          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black">{bestScore.username}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-300">
                {bestScore.arena} · {bestScore.level}
              </p>
            </div>
            <strong className="text-5xl font-black text-amber-300">
              {bestScore.score}
            </strong>
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        {scores.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-slate-100 text-xs font-black uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Rank</th>
                  <th className="px-5 py-4">Player</th>
                  <th className="px-5 py-4">Score</th>
                  <th className="px-5 py-4">Length</th>
                  <th className="px-5 py-4">Level</th>
                  <th className="px-5 py-4">Arena</th>
                  <th className="px-5 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={score.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 text-sm font-black text-slate-950">
                      #{index + 1}
                    </td>
                    <td className="px-5 py-4">
                      <strong className="block text-slate-950">
                        {score.username}
                      </strong>
                      <span className="text-sm text-slate-500">
                        {score.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-lg font-black text-emerald-700">
                      {score.score}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">
                      {score.length}
                    </td>
                    <td className="px-5 py-4 font-bold capitalize text-slate-700">
                      {score.level}
                      {score.speed ? (
                        <span className="block text-xs font-semibold normal-case text-slate-400">
                          {score.speed} ms
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-700">
                      {score.arena}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-500">
                      {new Date(score.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid min-h-72 place-items-center p-8 text-center">
            <div>
              <Trophy className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-2xl font-black text-slate-950">
                No scores yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Play one round and your score will appear here.
              </p>
              <Link
                href="/game"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-black text-white transition hover:bg-emerald-800"
              >
                Play now
              </Link>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
