ALTER TABLE "dn_branches" DROP CONSTRAINT "dn_branches_created_by_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_created_by_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "part_numbers" DROP CONSTRAINT "part_numbers_created_by_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "dn_branches" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "part_numbers" ALTER COLUMN "created_by" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "dn_branches" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "pdf_url" text;--> statement-breakpoint
ALTER TABLE "part_numbers" ADD COLUMN "pdf_url" text;