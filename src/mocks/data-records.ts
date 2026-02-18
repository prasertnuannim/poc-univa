import { DataRecord } from "@/types/data-records.type";


export const MOCK_DATA: DataRecord[] = [
  {
    id: 1,
    time: "2024-08-18 18:45",
    device: "US-1",
    probe: "Probe-1",
    unit: "Radiology",
    examType: "Abdomen",
    operator: "Liam Walker",
    physician: "Sophia Turner",
  },
  {
    id: 2,
    time: "2024-08-18 18:40",
    device: "US-2",
    probe: "Probe-2",
    unit: "Radiology",
    examType: "Abdomen",
    operator: "Isabella Collins",
    physician: "Sophia Turner",
  },
  {
    id: 3,
    time: "2024-08-18 18:35",
    device: "US-3",
    probe: "Probe-5",
    unit: "Cardiology",
    examType: "Heart",
    operator: "James Parker",
    physician: "Henry Lawson",
  },
];
