CREATE TABLE "dn_relations" (
	"id_relation" serial PRIMARY KEY NOT NULL,
	"root_id" varchar(30) NOT NULL,
	"group" integer NOT NULL,
	"sub_group" integer NOT NULL,
	"sub_sg" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dn_relations" ADD CONSTRAINT "dn_relations_root_id_drawing_numbers_id_dn_fk" FOREIGN KEY ("root_id") REFERENCES "public"."drawing_numbers"("id_dn") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dn_relations" ADD CONSTRAINT "dn_relations_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;