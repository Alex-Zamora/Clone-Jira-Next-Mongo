interface seedData {
  entries: SeedEntry[];
}

interface SeedEntry {
  description: string;
  status: string;
  createdAt: number;
}

export const seedData: seedData = {
  entries: [
    {
      description:
        "Pendiente Reprehenderit eiusmod esse exercitation ullamco dolore laborum cupidatat in est non veniam duis cillum.",
      status: "pending",
      createdAt: Date.now(),
    },
    {
      description:
        "En progresoEt aliqua cupidatat amet Lorem ipsum exercitation laborum est aliqua.",
      status: "in-progress",
      createdAt: Date.now() - 1000000,
    },
    {
      description:
        "Terminadas Aute aute aliqua ea et consequat fugiat dolor exercitation velit ea dolore eu nulla.",
      status: "finished",
      createdAt: Date.now() - -10000,
    },
  ],
};

