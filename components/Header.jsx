"use client";

import Link from "next/link";
import { Trophy, UserRound, Gamepad2, Map } from "lucide-react";

const navItems = [
  { href: "/", label: "Player", icon: UserRound },
  { href: "/arena", label: "Arena", icon: Map },
  { href: "/game", label: "Game", icon: Gamepad2 },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Header({ compact = false }) {
  return (
    <header
      className={`mx-auto flex w-full max-w-6xl flex-col gap-5 px-3 sm:px-6 lg:px-8 ${
        compact ? "py-1 sm:py-2" : "py-6"
      }`}
    >
      <div
        className={`flex flex-col justify-between rounded-lg border border-slate-200/80 bg-white/80 shadow-soft backdrop-blur md:flex-row md:items-center ${
          compact ? "gap-2 px-2 py-2 sm:gap-4 sm:px-4" : "gap-4 px-5 py-4"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2 sm:gap-3">
          <span
            className={`grid place-items-center rounded-lg bg-emerald-900 font-black text-lime-300 ${
              compact ? "h-8 w-8 text-sm sm:h-9 sm:w-9 sm:text-base" : "h-11 w-11 text-lg"
            }`}
          >
            S
          </span>
          <span>
            <span
              className={`block font-black tracking-normal text-slate-950 ${
                compact ? "text-base sm:text-lg" : "text-xl"
              }`}
            >
              Snake Arena
            </span>
            <span
              className={`text-xs font-medium text-slate-500 sm:text-sm ${
                compact ? "hidden sm:block" : "block"
              }`}
            >
              Custom browser snake battles
            </span>
          </span>
        </Link>

        <nav className={compact ? "grid grid-cols-4 gap-1 sm:flex sm:gap-2" : "grid grid-cols-2 gap-2 sm:flex"}>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 ${
                compact ? "h-8 px-2 sm:h-9 sm:px-3" : "h-10"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className={compact ? "sr-only sm:not-sr-only" : ""}>
                {label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
