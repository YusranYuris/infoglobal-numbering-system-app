ALTER TABLE "drawing_numbers" DROP CONSTRAINT "drawing_numbers_created_by_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "dn_branches" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "drawing_numbers" ALTER COLUMN "created_by" SET DATA TYPE varchar(50);