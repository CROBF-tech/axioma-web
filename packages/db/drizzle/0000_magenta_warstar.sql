CREATE TABLE `notebooks` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`title` text NOT NULL,
	`folder_id` text,
	`accent` text,
	`is_public` integer DEFAULT false NOT NULL,
	`public_slug` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notebooks_public_slug_unique` ON `notebooks` (`public_slug`);--> statement-breakpoint
CREATE INDEX `notebooks_owner_idx` ON `notebooks` (`owner_id`);--> statement-breakpoint
CREATE INDEX `notebooks_owner_updated_idx` ON `notebooks` (`owner_id`,`updated_at`);--> statement-breakpoint
CREATE INDEX `notebooks_slug_idx` ON `notebooks` (`public_slug`);--> statement-breakpoint
CREATE TABLE `cells` (
	`id` text PRIMARY KEY NOT NULL,
	`notebook_id` text NOT NULL,
	`order_idx` integer NOT NULL,
	`kind` text NOT NULL,
	`input` text NOT NULL,
	`output` text,
	`references` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`notebook_id`) REFERENCES `notebooks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `cells_notebook_idx` ON `cells` (`notebook_id`);--> statement-breakpoint
CREATE INDEX `cells_notebook_order_idx` ON `cells` (`notebook_id`,`order_idx`);--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`parent_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `folders_owner_idx` ON `folders` (`owner_id`);--> statement-breakpoint
CREATE INDEX `folders_parent_idx` ON `folders` (`parent_id`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`status` text NOT NULL,
	`mp_preapproval_id` text,
	`current_period_end` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_user_id_unique` ON `subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `subscriptions_status_idx` ON `subscriptions` (`status`);