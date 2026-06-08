CREATE TABLE `article_views` (
	`article_id` integer NOT NULL,
	`ip_hash` text NOT NULL,
	`last_seen_at` integer NOT NULL,
	PRIMARY KEY (`article_id`, `ip_hash`),
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `article_views_last_seen_idx` ON `article_views` (`last_seen_at`);
