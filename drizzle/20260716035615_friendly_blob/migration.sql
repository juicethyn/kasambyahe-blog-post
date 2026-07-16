DROP TABLE "saved_posts";--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "approved" boolean DEFAULT true NOT NULL;