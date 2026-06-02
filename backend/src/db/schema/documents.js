import { pgTable, varchar, integer, boolean, timestamp} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const documents = pgTable("documents", {
    idDoc: varchar("id_doc", { length: 30 }).primaryKey(),
    productAbbr: varchar("product_abbr", { length: 30 }).notNull(),
    docKind: integer("doc_kind").notNull(),
    sequence: integer("sequence").notNull(),
    department: integer("department").notNull(),
    companyAbbr: varchar("company_abbr", { length: 30 }).notNull(),
    year: integer("year").notNull(),
    description: varchar("description", { length: 100 }).notNull(),
    isSequenced: boolean("is_sequenced").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    createdBy: integer("created_by").notNull().references(() => users.idUser)
});