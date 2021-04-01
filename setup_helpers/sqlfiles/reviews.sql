CREATE TABLE `reviews` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`rating` INT(11) NOT NULL DEFAULT '0',
	`details` MEDIUMTEXT NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`campground_id` INT(11) NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `FK_reviews_campgrounds` (`campground_id`) USING BTREE,
	CONSTRAINT `FK_reviews_campgrounds` FOREIGN KEY (`campground_id`) REFERENCES `yelpcamp`.`campgrounds` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB
;