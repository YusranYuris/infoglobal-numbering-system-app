import { pgTable, varchar, integer, boolean, timestamp, char } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const drawingNumbers = pgTable("drawing_numbers", {
    idDn: char("id_dn", { length: 18 }).primaryKey(),
    drawingKind: varchar("drawing_kind", { length: 10 }).notNull(),
    kindCode: integer("kind_code").notNull(),
    categoryCode: varchar("category_code", { length: 3 }).notNull(),
    functionCode: integer("function_code").notNull(),
    designationCode: char("designation_code", { length: 1 }).notNull(),
    sequence: integer("sequence").notNull(),
    description: varchar("description", { length: 100 }).notNull(),
    isSequenced: boolean("is_sequenced").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: integer("created_by").notNull().references(() => users.idUser)
});