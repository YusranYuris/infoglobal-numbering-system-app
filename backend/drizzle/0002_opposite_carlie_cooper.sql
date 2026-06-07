ALTER TABLE "dn_relations" RENAME TO "dn_branches";--> statement-breakpoint
ALTER TABLE "dn_branches" RENAME COLUMN "id_relation" TO "id_branch";--> statement-breakpoint
ALTER TABLE "dn_branches" DROP CONSTRAINT "dn_relations_root_id_drawing_numbers_id_dn_fk";
--> statement-breakpoint
ALTER TABLE "dn_branches" DROP CONSTRAINT "dn_relations_created_by_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "dn_branches" ADD CONSTRAINT "dn_branches_root_id_drawing_numbers_id_dn_fk" FOREIGN KEY ("root_id") REFERENCES "public"."drawing_numbers"("id_dn") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dn_branches" ADD CONSTRAINT "dn_branches_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;