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
	"id_dn" char(18) PRIMARY KEY NOT NULL,
	"drawing_kind" varchar(10) NOT NULL,
	"kind_code" integer NOT NULL,
	"category_code" varchar(3) NOT NULL,
	"function_code" integer NOT NULL,
	"designation_code" char(1) NOT NULL,
	"sequence" integer NOT NULL,
	"description" varchar(100) NOT NULL,
	"is_sequenced" boolean DEFAULT false NOT NULL,
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
	"description" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pn_structure" (
	"id_structure" serial PRIMARY KEY NOT NULL,
	"parent_id" varchar(30),
	"child_id" varchar(30) NOT NULL,
	"hierarchy" integer NOT NULL,
	"sequence" integer NOT NULL,
	"is_sequenced" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drawing_numbers" ADD CONSTRAINT "drawing_numbers_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "part_numbers" ADD CONSTRAINT "part_numbers_created_by_users_id_user_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pn_structure" ADD CONSTRAINT "pn_structure_parent_id_part_numbers_id_pn_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."part_numbers"("id_pn") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pn_structure" ADD CONSTRAINT "pn_structure_child_id_part_numbers_id_pn_fk" FOREIGN KEY ("child_id") REFERENCES "public"."part_numbers"("id_pn") ON DELETE cascade ON UPDATE no action;