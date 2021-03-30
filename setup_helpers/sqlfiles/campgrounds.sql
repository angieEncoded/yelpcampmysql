CREATE TABLE `campgrounds` (
	`id` INT(10) NOT NULL AUTO_INCREMENT,
	`title` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`image` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`price` DECIMAL(20,2) NOT NULL DEFAULT '0.00',
	`description` LONGTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`location` TEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
	PRIMARY KEY (`id`) USING BTREE,
	CONSTRAINT `CC1` CHECK (`title` <> ''),
	CONSTRAINT `CC2` CHECK (`image` <> ''),
	CONSTRAINT `CC4` CHECK (`description` <> ''),
	CONSTRAINT `CC5` CHECK (`location` <> '')
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
AUTO_INCREMENT=256
;