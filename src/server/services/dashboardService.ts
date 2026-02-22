// server/services/dashboard.service.ts
import {
  DateFilterDTO,
  DrawerChartDTO,
  DrawerTabDTO,
  MainChartDTO,
  SelectedBarDTO,
  TabKey,
} from "@/server/dto/dashboard.dto";
import { toChartDTO } from "@/server/mappers/dashboard.mapper";
import {
  queryDrawerBreakdownBy,
  queryTopVolumeBy,
  queryTopOperatingMinutesBy,
} from "@/server/query/dashboard.query";

const TAB_LABEL_MAP: Record<TabKey, string> = {
  devices: "Devices",
  probes: "Probes",
  units: "Units",
  examTypes: "Exam types",
  operators: "Operators",
  physicians: "Physicians",
};

const ENTITY_TITLE_MAP: Record<TabKey, string> = {
  devices: "Device",
  probes: "Probe",
  units: "Unit",
  examTypes: "Exam type",
  operators: "Operator",
  physicians: "Physician",
};

function titleByActive(active: TabKey) {
  return ENTITY_TITLE_MAP[active];
}

export async function getMainCharts(active: TabKey, filter: DateFilterDTO): Promise<MainChartDTO[]> {
  const entity = titleByActive(active);

  // ✅ ทุกแท็บมี Volume chart
  const volumeRows = await queryTopVolumeBy(active, filter);

  const charts: MainChartDTO[] = [
    toChartDTO({
      id: `${active}-volume`,
      title: `Exams volume per ${entity}`,
      rows: volumeRows,
      yLabel: "Times",
    }),
  ];

  // ✅ เฉพาะ Devices เพิ่ม Operating time chart
  if (active === "devices") {
    const opRows = await queryTopOperatingMinutesBy(active, filter);

    charts.push(
      toChartDTO({
        id: `${active}-operating`,
        title: `Operating time per ${entity}`,
        rows: opRows,
        yLabel: "min",
      })
    );
  }

  return charts;
}

export function getDrawerTabs(active: TabKey): DrawerTabDTO[] {
  return (Object.entries(TAB_LABEL_MAP) as [TabKey, string][])
    .filter(([key]) => key !== active)
    .map(([key, label]) => ({ key, label }));
}

export async function getDrawerChart(
  active: TabKey,
  drawerTab: TabKey,
  selected: SelectedBarDTO,
  filter: DateFilterDTO
): Promise<DrawerChartDTO> {
  const rows = await queryDrawerBreakdownBy(active, drawerTab, selected, filter);
  return {
    title: `Breakdown by ${titleByActive(drawerTab)}`,
    data: rows,
  };
}
