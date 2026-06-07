CREATE TABLE "dn_branches" (
	"id_branch" varchar(30) PRIMARY KEY NOT NULL,
	"root_id" varchar(30) NOT NULL,
	"group" integer NOT NULL,
	"sub_group" integer DEFAULT 0 NOT NULL,
	"sub_sg" integer DEFAULT 0 NOT NULL,
	"description" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id_doc" varchar(30) PRIMARY KEY NOT NULL,
	"product_abbr" varchar(30) NOT NULL,
	"doc_kind" integer NOT NULL,
	"sequence" integer NOT NULL,
	"department" integer NOT NULL,
	"company_abbr" varchar(30) NOT NULL,
	"year" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"is_sequenced" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drawing_numbers" (
	"id_dn" varchar(30) PRIMARY KEY NOT NULL,
	"drawing_kind" varchar(10) NOT NULL,
	"kind_code" integer NOT NULL,
	"category_code" varchar(3) NOT NULL,
	"function_code" integer NOT NULL,
	"designation_code" char(1) NOT NULL,
	"is_sequenced" boolean DEFAULT false NOT NULL,
	"sequence" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id_user" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"department" varchar(50) NOT NULL,
	"email" varchar(50) NOT NULL,
	"password" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "part_numbers" (
	"id_pn" varchar(30) PRIMARY KEY NOT NULL,
	"kind_code" integer NOT NULL,
	"category_code" varchar(3) NOT NULL,
	"function_code" integer NOT NULL,
	"designation_code" char(1) NOT NULL,
	"is_sequenced" boolean NOT NULL,
	"sequence" integer DEFAULT false NOT NULL,
	"description" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pn_relations" (
	"id_relation" serial PRIMARY KEY NOT NULL,
	"root_id" varchar(30) NOT NULL,
	"parent_id" varchar(30) NOT NULL,
	"pn_code" varchar(30) NOT NULL,
	"hierarchy" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dn_branches" ADD CONSTRAINT "dn_branches_root_id_drawing_numbers_id_dn_fk" FOREIGN KEY ("root_id") REFERENCES "public"."drawing_numbers"("id_dn") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dn_branches" ADD CONSTRAINT "dn_branches_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drawing_numbers" ADD CONSTRAINT "drawing_numbers_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "part_numbers" ADD CONSTRAINT "part_numbers_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pn_relations" ADD CONSTRAINT "pn_relations_root_id_part_numbers_id_pn_fk" FOREIGN KEY ("root_id") REFERENCES "public"."part_numbers"("id_pn") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pn_relations" ADD CONSTRAINT "pn_relations_parent_id_part_numbers_id_pn_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."part_numbers"("id_pn") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pn_relations" ADD CONSTRAINT "pn_relations_pn_code_part_numbers_id_pn_fk" FOREIGN KEY ("pn_code") REFERENCES "public"."part_numbers"("id_pn") ON DELETE cascade ON UPDATE no action;