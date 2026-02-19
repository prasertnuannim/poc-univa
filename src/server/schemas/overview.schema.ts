import { z } from "zod";

export const overviewSchema = z
  .object({
    mode: z
      .enum(["today", "previous-day", "day", "week", "month", "year", "all", "custom"])
      .default("today"),
    date: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    granularity: z.enum(["hour", "day", "week", "month"]).default("day"),
  })
  .superRefine((v, ctx) => {
    if (v.mode === "custom") {
      if (!v.start) ctx.addIssue({ code: "custom", path: ["start"], message: "Start is required." });
      if (!v.end) ctx.addIssue({ code: "custom", path: ["end"], message: "End is required." });
    } else if (v.mode !== "all" && !v.date) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "Date is required." });
    }
  });

export type OverviewInput = z.infer<typeof overviewSchema>;
