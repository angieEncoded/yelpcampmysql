CREATE TABLE `reviews` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`rating` INT(11) NOT NULL DEFAULT '0',
	`details` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`campground_id` INT(11) NOT NULL DEFAULT '0',
	`username` TEXT NULL DEFAULT 'Anonymous' COLLATE 'utf8mb4_unicode_ci',
	`added_on` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
	`updated_on` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_reviews_campgrounds` (`campground_id`) USING BTREE,
	CONSTRAINT `FK_reviews_campgrounds` FOREIGN KEY (`campground_id`) REFERENCES `yelpcamp`.`campgrounds` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT `CC1` CHECK (`rating` >= 1 and `rating` <= 5),
	CONSTRAINT `CC2` CHECK (`details` <> ''),
	CONSTRAINT `CC3` CHECK (`username` <> '')
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;