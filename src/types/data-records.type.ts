export type DataRecord = {
  id: number;
  time: string;
  device: string;
  probe: string;
  unit: string;
  examType: string;
  operator: string;
  physician: string;
};

export type Filters = {
  device?: string;
  unit?: string;
  examType?: string;
};
