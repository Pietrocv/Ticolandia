CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`scope` text NOT NULL,
	`category` text NOT NULL,
	`supplier` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `expenses_owner` ON `expenses` (`owner`);--> statement-breakpoint
CREATE TABLE `installments` (
	`id` text PRIMARY KEY NOT NULL,
	`expense_id` text NOT NULL,
	`number` integer NOT NULL,
	`due` text NOT NULL,
	`expected` integer NOT NULL,
	`paid` integer DEFAULT 0 NOT NULL,
	`paid_date` text,
	`revision` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `installments_expense` ON `installments` (`expense_id`);--> statement-breakpoint
CREATE TABLE `receipts` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`mime` text NOT NULL,
	`hash` text NOT NULL,
	`expense_id` text,
	`notes` text DEFAULT '' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `receipts_owner` ON `receipts` (`owner`);--> statement-breakpoint
CREATE UNIQUE INDEX `receipts_owner_hash` ON `receipts` (`owner`,`hash`);