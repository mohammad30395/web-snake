"use client";

const PROFILE_KEY = "snakeArenaProfile";
const ARENA_KEY = "snakeArenaSelectedArena";
const LEADERBOARD_KEY = "snakeArenaLeaderboard";

export function getProfile() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile) {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getSelectedArena() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ARENA_KEY);
}

export function saveSelectedArena(arenaId) {
  window.localStorage.setItem(ARENA_KEY, arenaId);
}

export function getLeaderboard() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LEADERBOARD_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveScore(entry) {
  const scores = getLeaderboard();
  const previousBest = scores
    .filter((score) => score.level === entry.level)
    .sort((a, b) => b.score - a.score || b.length - a.length)[0];
  const isHighScore =
    !previousBest ||
    entry.score > previousBest.score ||
    (entry.score === previousBest.score && entry.length > previousBest.length);
  const nextScores = [entry, ...scores]
    .sort((a, b) => b.score - a.score || b.length - a.length)
    .slice(0, 30);

  window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(nextScores));
  return { scores: nextScores, isHighScore };
}

export function clearLeaderboard() {
  window.localStorage.removeItem(LEADERBOARD_KEY);
}
