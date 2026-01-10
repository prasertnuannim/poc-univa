import { hash } from "bcryptjs";
import { prisma } from "@/server/db/auth/client";
import type { RegisterDto } from "@/server/dto/register.dto";
import type { RegisterEntity } from "@/server/domain/register.entity";
import { createAppError } from "@/server/security/appError";

const resolveAllowedDomains = (): string[] => {
  const env = process.env.ALLOWED_REGISTRATION_EMAIL_DOMAINS;
  if (!env) return [];

  return env
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
};

const register = async (dto: RegisterDto) => {
  const allowedDomains = resolveAllowedDomains();
  if (allowedDomains.length) {
    const domain = dto.email.split("@")[1]?.toLowerCase() ?? "";
    if (!allowedDomains.includes(domain)) {
      throw createAppError(
        "EMAIL_DOMAIN_NOT_ALLOWED",
        `Only registrations from ${allowedDomains.join(", ")} are allowed.`,
      );
    }
  }

  const entity: RegisterEntity = {
    name: dto.name,
    email: dto.email,
    passwordHash: await hash(dto.password, 10),
    roleName: "user",
  };

  const existing = await prisma.user.findUnique({
    where: { email: entity.email },
  });

  if (existing) {
    throw createAppError("EMAIL_EXISTS", "Email already registered.");
  }

  await prisma.user.create({
    data: {
      name: entity.name,
      email: entity.email,
      password: entity.passwordHash,
      role: entity.roleName ? { connect: { name: entity.roleName } } : undefined,
    },
  });

  return true;
};

export const registerService = { register };
