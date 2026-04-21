import { z } from "zod";

const ServerEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .refine(
      (val) => val.startsWith("postgres://") || val.startsWith("postgresql://"),
      "DATABASE_URL debe empezar con postgres:// o postgresql://"
    ),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

export function loadServerEnv(): ServerEnv {
  return ServerEnvSchema.parse(process.env);
}

const PublicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_ENV: z.enum(["prod", "qa", "dev", "local"]).default("local"),
});

export const publicEnv = PublicEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
});
