import { pgTable, varchar, integer, boolean, timestamp, char, serial, text } from "drizzle-orm/pg-core";
import { drawingNumbers } from "./drawingNumbers.js";
import { users } from "./users.js";

export const dnBranches = pgTable("dn_branches", {
    idBranch: varchar("id_branch", { length: 30 }).primaryKey(),
    rootId: varchar("root_id", { length: 30 }).references(() => drawingNumbers.idDn, { onDelete: 'cascade'}).notNull(),
    group: integer("group").notNull(),
    subGroup: integer("sub_group").default(0).notNull(),
    subSg: integer("sub_sg").default(0).notNull(),
    description: varchar("description", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    // Sementara karena user belum bisa request maka admin manual input
    createdBy: varchar("created_by", { length: 50 }).notNull(), 
    // Nanti kalau user sudah bisa request number, maka ini akan kepakai (JWT)
    // createdBy: integer("created_by").notNull().references(() => users.idUser),
    pdfUrl: text("pdf_url"),
});