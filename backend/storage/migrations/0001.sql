--
-- Create model Image
--
CREATE TABLE `storage_image` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `title` varchar(200) NOT NULL, `image` varchar(100) NOT NULL);
--
-- Create model User
--
CREATE TABLE `storage_user` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `nickname` varchar(200) NOT NULL, `info` varchar(1000) NOT NULL);
--
-- Create model Tag
--
CREATE TABLE `storage_tag` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `tag_name` varchar(200) NOT NULL UNIQUE);
CREATE TABLE `storage_tag_images` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `tag_id` bigint NOT NULL, `image_id` bigint NOT NULL);
--
-- Create model Comment
--
CREATE TABLE `storage_comment` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `text` varchar(200) NOT NULL, `image_id` bigint NOT NULL, `user_id` bigint NOT NULL);
ALTER TABLE `storage_tag_images` ADD CONSTRAINT `storage_tag_images_tag_id_image_id_aef618ea_uniq` UNIQUE (`tag_id`, `image_id`);
ALTER TABLE `storage_tag_images` ADD CONSTRAINT `storage_tag_images_tag_id_e12507fc_fk_storage_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `storage_tag` (`id`);
ALTER TABLE `storage_tag_images` ADD CONSTRAINT `storage_tag_images_image_id_1233ffbe_fk_storage_image_id` FOREIGN KEY (`image_id`) REFERENCES `storage_image` (`id`);
ALTER TABLE `storage_comment` ADD CONSTRAINT `storage_comment_image_id_cc9015a5_fk_storage_image_id` FOREIGN KEY (`image_id`) REFERENCES `storage_image` (`id`);
ALTER TABLE `storage_comment` ADD CONSTRAINT `storage_comment_user_id_a164b45b_fk_storage_user_id` FOREIGN KEY (`user_id`) REFERENCES `storage_user` (`id`);
