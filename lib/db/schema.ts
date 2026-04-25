import { sql } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  text,
  timestamp,
  uuid,
  numeric,
  integer,
  varchar,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─────────────────────────── Enums ────────────────────────────

export const categoryEnum = pgEnum("category", [
  "baches",
  "luminaria",
  "semaforos",
  "senalizacion",
  "ramas",
  "veredas",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "enviado",
  "recibido",
  "en_obra",
  "resuelto",
  "cerrado",
]);

export const deptoEnum = pgEnum("depto", [
  "Ciudad",
  "Godoy Cruz",
  "Guaymallén",
  "Las Heras",
  "Maipú",
  "Luján de Cuyo",
]);

export const userRoleEnum = pgEnum("user_role", [
  "citizen",
  "moderator",
  "admin",
]);

export const voteKindEnum = pgEnum("vote_kind", ["also_saw", "not_real"]);

// ─────────────────────────── Tablas ───────────────────────────

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    role: userRoleEnum("role").notNull().default("citizen"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("users_email_uniq").on(t.email)],
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 16 }).notNull(),
    category: categoryEnum("category").notNull(),
    status: reportStatusEnum("status").notNull().default("enviado"),
    lat: numeric("lat", { precision: 9, scale: 6 }).notNull(),
    lng: numeric("lng", { precision: 9, scale: 6 }).notNull(),
    depto: deptoEnum("depto").notNull(),
    addressText: text("address_text"),
    description: text("description").notNull(),
    ownerId: uuid("owner_id").references(() => users.id, {
      onDelete: "set null",
    }),
    anonymousToken: text("anonymous_token"),
    alsoSawCount: integer("also_saw_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("reports_code_uniq").on(t.code),
    index("reports_depto_created_idx").on(t.depto, t.createdAt),
    index("reports_category_created_idx").on(t.category, t.createdAt),
    index("reports_status_idx").on(t.status),
    index("reports_lat_lng_idx").on(t.lat, t.lng),
  ],
);

export const reportPhotos = pgTable("report_photos", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  blobUrl: text("blob_url").notNull(),
  blobPathname: text("blob_pathname").notNull(),
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    anonymousToken: text("anonymous_token"),
    kind: voteKindEnum("kind").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    // Cada vecino (auth o anon) puede votar 1 sola vez por reporte y kind.
    uniqueIndex("votes_user_report_kind_uniq")
      .on(t.userId, t.reportId, t.kind)
      .where(sql`${t.userId} is not null`),
    uniqueIndex("votes_anon_report_kind_uniq")
      .on(t.anonymousToken, t.reportId, t.kind)
      .where(sql`${t.anonymousToken} is not null`),
  ],
);

export const statusEvents = pgTable("status_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: uuid("report_id")
    .notNull()
    .references(() => reports.id, { onDelete: "cascade" }),
  fromStatus: reportStatusEnum("from_status"),
  toStatus: reportStatusEnum("to_status").notNull(),
  actorId: uuid("actor_id").references(() => users.id, {
    onDelete: "set null",
  }),
  actorRole: text("actor_role"),
  detail: text("detail"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const magicLinkTokens = pgTable(
  "magic_link_tokens",
  {
    token: text("token").primaryKey(),
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("magic_link_email_idx").on(t.email)],
);

// Mantenemos el health-check para smoke tests.
export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  note: text("note"),
});
