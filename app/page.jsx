"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Palette, UserRound } from "lucide-react";
import PageShell from "@/components/PageShell";
import { getProfile, saveProfile } from "@/lib/storage";

const initialForm = {
  name: "",
  username: "",
  snakeColor: "#22c55e",
  foodColor: "#ef4444",
};

export default function PlayerSetupPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const storedProfile = getProfile();
    if (storedProfile) setForm(storedProfile);
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submitForm(event) {
    event.preventDefault();
    saveProfile({
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
    });
    router.push("/arena");
  }

  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
        <div className="flex min-h-[520px] flex-col justify-between rounded-lg bg-slate-950 p-7 text-white shadow-soft sm:p-10">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-lime-200">
              <GameBadge />
              Player setup
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-normal sm:text-5xl">
              Build your snake before entering the arena.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Choose the player identity, snake color, and food color. Your
              scores are stored locally in this browser.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <PreviewTile label="Snake" color={form.snakeColor} />
            <PreviewTile label="Food" color={form.foodColor} />
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <span className="text-xs font-bold uppercase text-slate-400">
                Player
              </span>
              <strong className="mt-2 block truncate text-lg">
                {form.username || "username"}
              </strong>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitForm}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-emerald-100 text-emerald-800">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Player details
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Required before choosing the playing ground.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Name</span>
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your full name"
                className="h-12 rounded-md border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700">Username</span>
              <input
                required
                name="username"
                value={form.username}
                onChange={updateField}
                placeholder="snake_master"
                className="h-12 rounded-md border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField
                label="Snake color"
                name="snakeColor"
                value={form.snakeColor}
                onChange={updateField}
              />
              <ColorField
                label="Food color"
                name="foodColor"
                value={form.foodColor}
                onChange={updateField}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 text-sm font-black text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            Choose arena
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </section>
    </PageShell>
  );
}

function ColorField({ label, name, value, onChange }) {
  return (
    <label className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <Palette className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <div className="flex h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3">
        <input
          type="color"
          name={name}
          value={value}
          onChange={onChange}
          className="h-8 w-10 cursor-pointer border-0 bg-transparent p-0"
          aria-label={label}
        />
        <span className="font-mono text-sm font-bold uppercase text-slate-600">
          {value}
        </span>
      </div>
    </label>
  );
}

function PreviewTile({ label, color }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <span className="text-xs font-bold uppercase text-slate-400">
        {label}
      </span>
      <span
        className="mt-3 block h-9 rounded-md border border-white/20"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function GameBadge() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded bg-lime-300 text-[10px] font-black text-slate-950">
      S
    </span>
  );
}
