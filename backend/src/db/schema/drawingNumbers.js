import { pgTable, varchar, integer, boolean, timestamp, char } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const drawingNumbers = pgTable("drawing_numbers", {
    idDn: varchar("id_dn", { length: 30 }).primaryKey(),
    drawingKind: varchar("drawing_kind", { length: 10 }).notNull(),
    kindCode: integer("kind_code").notNull(),
    categoryCode: varchar("category_code", { length: 3 }).notNull(),
    functionCode: integer("function_code").notNull(),
    designationCode: char("designation_code", { length: 1 }).notNull(),
    isSequenced: boolean("is_sequenced").default(false).notNull(),
    sequence: integer("sequence").notNull(),
    description: varchar("description", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    // Sementara karena user belum bisa request maka admin manual input
    createdBy: varchar("created_by", { length: 50 }).notNull(), 
    // Nanti kalau user sudah bisa request number, maka ini akan kepakai (JWT)
    // createdBy: integer("created_by").notNull().references(() => users.idUser),
});