// src/mocks/dashboardMock.ts

/* =========================
 * Types
 * ========================= */
export type TabKey =
  | "devices"
  | "probes"
  | "units"
  | "examTypes"
  | "operators"
  | "physicians";

export type TabItem = { key: TabKey; label: string };

export type MainChartDef = {
  id: "volume" | "operatingTime";
  title: string;
  labels: string[];
  values: number[];
  yLabel?: string;
};

export type MainData = {
  title: string;
  labels: string[];
  values: number[];
};

export type SelectedBar = { label: string; value: number };

export type ChartData = { labels: string[]; values: number[] };

export type DrawerChart = {
  title: string;
  data: ChartData;
};

/* =========================
 * Tabs
 * ========================= */
export const TABS: TabItem[] = [
  { key: "devices", label: "Devices" },
  { key: "probes", label: "Probes" },
  { key: "units", label: "Units" },
  { key: "examTypes", label: "Exam types" },
  { key: "operators", label: "Operators" },
  { key: "physicians", label: "Physicians" },
];

/* =========================
 * Deterministic helpers
 * ========================= */
function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function splitTotal(total: number, parts: number, seed: number) {
  const rng = makeRng(seed);
  const weights = Array.from({ length: parts }, () => rng() + 0.2);
  const sumW = weights.reduce((a, b) => a + b, 0);

  const base = weights.map((w) => Math.floor((w / sumW) * total));
  let remain = total - base.reduce((a, b) => a + b, 0);

  while (remain-- > 0) {
    base[Math.floor(rng() * parts)] += 1;
  }
  return base;
}

/* =========================
 * Mock main chart (stable)
 * ========================= */
/* =========================
 * Drawer dimension labels
 * (อันนี้คือ Tab ของ Horizontal Bar)
 * ========================= */
const DIM_LABELS: Record<TabKey, string[]> = {
  devices: Array.from({ length: 8 }, (_, i) => `Device ${i + 1}`),
  probes: ["Linear", "Convex", "Phased", "Endocavity", "MicroConvex"],
  units: ["Room A", "Room B", "Room C", "Room D"],
  examTypes: ["Abdomen", "Cardiac", "OB/GYN", "Thyroid", "Vascular"],
  operators: ["Operator A", "Operator B", "Operator C", "Operator D"],
  physicians: ["Physician A", "Physician B", "Physician C"],
};

const MAIN_TITLE: Record<TabKey, string> = {
  devices: "Exams volume per Device",
  probes: "Exams volume per Probe",
  units: "Exams volume per Unit",
  examTypes: "Exams volume per Exam type",
  operators: "Exams volume per Operator",
  physicians: "Exams volume per Physician",
};

function getMockMainData(active: TabKey): MainData {
  const labels = DIM_LABELS[active];
  const seed = hashString(`main:${active}`);
  const baseTotal = labels.length * 12 + (seed % 60);
  const values = splitTotal(baseTotal, labels.length, seed ^ 0x9e3779b9);

  return {
    title: MAIN_TITLE[active],
    labels,
    values,
  };
}

export function getMockMainCharts(active: TabKey): MainChartDef[] {
  switch (active) {
    case "devices": {
      const a = getMockMainData(active); // หรือคุณจะเขียนแยกก็ได้
      return [
        {
          id: "volume",
          title: "Exams volume per Device",
          labels: a.labels,
          values: a.values,
          yLabel: "Times",
        },
        {
          id: "operatingTime",
          title: "Operating time per Device",
          labels: a.labels,
          values: a.values.map((v) => v * 6), // mock ให้ต่างกัน (ตัวอย่าง)
          yLabel: "min",
        },
      ];
    }

    default: {
      const a = getMockMainData(active);
      return [
        {
          id: "volume",
          title: a.title,
          labels: a.labels,
          values: a.values,
          yLabel: "Times",
        },
      ];
    }
  }
}


/* =========================
 * Drawer tabs: ไม่ซ้ำกับ main
 * ========================= */
export function getDrawerTabs(active: TabKey): TabItem[] {
  return TABS.filter((t) => t.key !== active);
}

/* =========================
 * Mock drawer Horizontal chart
 * ผูกกับ (mainTab + selectedBar + drawerTab) เพื่อให้แต่ละแท่งแตกย่อยไม่เหมือนกัน
 * ========================= */
export function getMockDrawerHorizontalChart(
  mainTab: TabKey,
  drawerTab: TabKey,
  selected: SelectedBar,
): DrawerChart {
  const labels = DIM_LABELS[drawerTab];
  const seed = hashString(`${mainTab}:${selected.label}:${selected.value}:${drawerTab}`);
  const values = splitTotal(selected.value, labels.length, seed);

  return {
    title: `Breakdown by ${drawerTab}`,
    data: { labels, values },
  };
}
