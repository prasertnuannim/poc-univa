import { DataRecord, Filters } from "@/types/data-records.type";


export function filterRecords(
  rows: DataRecord[],
  filters: Filters,
  start?: string,
  end?: string
) {
  return rows.filter((r) => {
    if (filters.device && r.device !== filters.device) return false;
    if (filters.unit && r.unit !== filters.unit) return false;
    if (filters.examType && r.examType !== filters.examType) return false;

    if (start && r.time.slice(0, 10) < start) return false;
    if (end && r.time.slice(0, 10) > end) return false;

    return true;
  });
}

export function exportCSV(rows: DataRecord[]) {
  const header = [
    "Time",
    "Device",
    "Probe",
    "Unit",
    "Exam type",
    "Operator",
    "Physician",
  ];

  const body = rows.map((r) =>
    [
      r.time,
      r.device,
      r.probe,
      r.unit,
      r.examType,
      r.operator,
      r.physician,
    ].join(",")
  );

  return [header.join(","), ...body].join("\n");
}
