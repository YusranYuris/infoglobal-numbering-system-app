import { pgTable, varchar, integer, boolean, timestamp, primaryKey, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { users } from './users';

export const partNumbers = pgTable('part_numbers', {
  idPn: varchar('id_pn', { length: 30 }).primaryKey(),
  description: varchar('description', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.idUser).notNull(),
});

export const pnStructure = pgTable('pn_structure', {
  idStructure: serial('id_structure').primaryKey(), 
  parentId: varchar('parent_id', { length: 30 }).references(() => partNumbers.idPn, { onDelete: 'cascade' }),
  childId: varchar('child_id', { length: 30 }).notNull().references(() => partNumbers.idPn, { onDelete: 'cascade' }),
  hierarchy: integer('hierarchy').notNull(),
  sequence: integer('sequence').notNull(),
  isSequenced: boolean('is_sequenced').default(false).notNull(),
});

// Relasi untuk tabel master
export const partNumberRelations = relations(partNumbers, ({ many }) => ({
  // Sebuah part bisa bertindak sebagai parent di banyak baris struktur
  asParent: many(pnStructure, { relationName: 'parentRelation' }),
  // Sebuah part bisa bertindak sebagai child di banyak baris struktur
  asChild: many(pnStructure, { relationName: 'childRelation' }),
}));

// Relasi untuk tabel perantara
export const pnStructureRelations = relations(pnStructure, ({ one }) => ({
  parentPart: one(partNumbers, {
    fields: [pnStructure.parentId],
    references: [partNumbers.idPn],
    relationName: 'parentRelation',
  }),
  childPart: one(partNumbers, {
    fields: [pnStructure.childId],
    references: [partNumbers.idPn],
    relationName: 'childRelation',
  }),
}));