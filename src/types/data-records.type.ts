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

export type DataRecordRow = {
  id: string;
  date: string;
  device: string;
  unit: string;
  examType: string;
  operator: string;
  physician: string;
  status: string;
  duration: number;
};

export type Filters = {
  device?: string;
  unit?: string;
  examType?: string;
};
