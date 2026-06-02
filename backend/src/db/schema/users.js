import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    idUser: serial("id_user").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    department: varchar("department", { length: 50 }).notNull(),
    email: varchar("email", { length: 50 }).notNull(),
    password: varchar("password", { length: 50 }).notNull()
});