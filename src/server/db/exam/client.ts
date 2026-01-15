import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./prisma/generated/client";

const examPrismaClientSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL_EXAM,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

// 🔥 สำคัญ: global key ต้องไม่ชื่อ prisma
const globalForExamPrisma = global as unknown as {
  examPrisma?: ReturnType<typeof examPrismaClientSingleton>;
};

export const examPrisma =
  globalForExamPrisma.examPrisma || examPrismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForExamPrisma.examPrisma = examPrisma;
}
