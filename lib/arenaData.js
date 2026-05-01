export const arenas = [
  {
    id: "garden",
    name: "Garden Grid",
    description: "Open grass with short border hedges for a calm first run.",
    background: "#163b25",
    grid: "#2d6540",
    wall: "#77b255",
    accent: "from-emerald-500 to-lime-400",
    obstacles: [
      [6, 6],
      [7, 6],
      [16, 17],
      [17, 17],
    ],
  },
  {
    id: "neon",
    name: "Neon Circuit",
    description: "Tight electric lanes that reward clean turning.",
    background: "#101827",
    grid: "#263850",
    wall: "#38bdf8",
    accent: "from-cyan-500 to-fuchsia-500",
    obstacles: [
      [5, 5],
      [5, 6],
      [5, 7],
      [18, 16],
      [18, 17],
      [18, 18],
      [11, 11],
      [12, 11],
    ],
  },
  {
    id: "frost",
    name: "Frost Maze",
    description: "Cool blocks split the arena into fast crossing routes.",
    background: "#dff6ff",
    grid: "#b7e0ed",
    wall: "#26758c",
    accent: "from-sky-300 to-teal-500",
    obstacles: [
      [8, 4],
      [8, 5],
      [8, 6],
      [8, 7],
      [15, 16],
      [15, 17],
      [15, 18],
      [15, 19],
      [10, 12],
      [11, 12],
      [12, 12],
      [13, 12],
    ],
  },
  {
    id: "ember",
    name: "Ember Walls",
    description: "Warm stone corners leave less room for late turns.",
    background: "#241714",
    grid: "#4d2f25",
    wall: "#f97316",
    accent: "from-orange-500 to-rose-500",
    obstacles: [
      [4, 4],
      [5, 4],
      [4, 5],
      [19, 4],
      [18, 4],
      [19, 5],
      [4, 19],
      [5, 19],
      [4, 18],
      [19, 19],
      [18, 19],
      [19, 18],
    ],
  },
];

export const levels = {
  easy: {
    label: "Easy",
    speed: 170,
    description: "Slow movement for careful planning.",
  },
  medium: {
    label: "Medium",
    speed: 115,
    description: "A balanced pace with sharper timing.",
  },
  hard: {
    label: "Hard",
    speed: 70,
    description: "Fast turns and very little recovery time.",
  },
  custom: {
    label: "Custom",
    speed: 110,
    description: "Set your own snake speed in milliseconds.",
  },
};

export function getArena(id) {
  return arenas.find((arena) => arena.id === id) || arenas[0];
}
