CREATE TABLE `imports` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`batch` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `imports_owner_batch` ON `imports` (`owner`,`batch`);--> statement-breakpoint
CREATE TABLE `property` (
	`owner` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `receipt_matches` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`hash` text NOT NULL,
	`expense_id` text,
	`notes` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `receipt_matches_owner_hash` ON `receipt_matches` (`owner`,`hash`);--> statement-breakpoint
ALTER TABLE `expenses` ADD `excluded` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `expenses` ADD `review` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `installments` ADD `settled_unknown` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `installments` ADD `projected` integer DEFAULT 0 NOT NULL;