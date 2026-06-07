import { pgTable, varchar, integer, boolean, timestamp, primaryKey, serial, char } from 'drizzle-orm/pg-core';

import { users } from './users.js';

export const partNumbers = pgTable('part_numbers', {
  idPn: varchar('id_pn', { length: 30 }).primaryKey(),
  kindCode: integer("kind_code").notNull(),
  categoryCode: varchar("category_code", { length: 3 }).notNull(),
  functionCode: integer("function_code").notNull(),
  designationCode: char("designation_code", { length: 1 }).notNull(),
  isSequenced: boolean("is_sequenced").default(false).notNull(),
  sequence: integer("sequence").notNull(),
  description: varchar('description', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.idUser).notNull(),
});