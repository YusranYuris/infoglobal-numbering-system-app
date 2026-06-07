import { integer, pgTable, primaryKey, serial, varchar,  } from "drizzle-orm/pg-core";

import { partNumbers } from "./partNumbers.js";

export const pnRelations = pgTable('pn_relations', {
    idRelations: serial('id_relation').primaryKey(),
    rootId: varchar('root_id', { length: 30 }).references(() => partNumbers.idPn, { onDelete: 'cascade'}).notNull(),
    parentId: varchar('parent_id', { length: 30 }).references(() => partNumbers.idPn, { onDelete: 'cascade'}).notNull(),
    pnCode: varchar('pn_code', { length: 30 }).references(() => partNumbers.idPn, { onDelete: 'cascade'}).notNull(),
    hierarchy: integer('hierarchy').notNull(),
});