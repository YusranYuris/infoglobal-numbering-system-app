ALTER TABLE "part_numbers" ALTER COLUMN "is_sequenced" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "part_numbers" ALTER COLUMN "sequence" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(10);