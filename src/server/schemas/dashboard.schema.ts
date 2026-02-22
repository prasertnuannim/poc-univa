import { z } from "zod";

export const tabKeySchema = z.enum([
  "devices",
  "probes",
  "units",
  "examTypes",
  "operators",
  "physicians",
]);

const dateLikeSchema = z.union([z.date(), z.string(), z.number()]);

export const dashboardFilterInputSchema = z
  .object({
    mode: z
      .enum(["day", "week", "range", "custom", "month", "year", "all"])
      .optional(),
    date: dateLikeSchema.optional(),
    from: dateLikeSchema.optional(),
    to: dateLikeSchema.optional(),
    start: dateLikeSchema.optional(),
    end: dateLikeSchema.optional(),
    monthISO: z.string().trim().optional(),
    month: z.string().trim().optional(),
    year: z.union([z.string().trim(), z.number()]).optional(),
  })
  .strict();

export const selectedBarSchema = z
  .object({
    label: z.string().trim().min(1),
    value: z.number().finite(),
  })
  .strict();

export type DashboardFilterInput = z.input<typeof dashboardFilterInputSchema>;
export type DashboardFilter = z.output<typeof dashboardFilterInputSchema>;
