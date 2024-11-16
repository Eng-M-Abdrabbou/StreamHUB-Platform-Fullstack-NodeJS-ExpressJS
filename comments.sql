-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 16, 2024 at 12:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `streamhubdb3`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `forum_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `forum_id`, `user_id`, `content`, `image_url`, `created_at`) VALUES
(2, 1, 3, 'wow this is epic', '\\uploads\\forum-images\\1728236994654.jpg', '2024-10-12 09:25:22'),
(12, 1, 8, 'i agree with 3 it was epic', NULL, '2024-10-12 10:54:39'),
(13, 1, 1, 'no stfu', NULL, '2024-10-12 12:34:06'),
(14, 9, 1, 'agree', NULL, '2024-10-12 20:10:08'),
(18, 1, 8, 'u speak no', NULL, '2024-10-15 18:03:14'),
(19, 1, 1, 'i speakl yes', NULL, '2024-10-15 18:08:23'),
(21, 1, 3, 'yoyo', NULL, '2024-10-15 18:38:33'),
(23, 1, 8, 'sup', NULL, '2024-10-15 19:01:30'),
(54, 11, 1, 'gg', NULL, '2024-10-18 14:54:14'),
(57, 6, 6, 'woowoowow', NULL, '2024-10-19 17:21:36'),
(60, 1, 6, 'idk', NULL, '2024-10-19 17:31:11'),
(62, 30, 6, 'do the comments work', NULL, '2024-10-19 18:00:18'),
(72, 36, 8, 'does it work', NULL, '2024-10-20 12:54:36'),
(77, 36, 8, 'yes', NULL, '2024-10-21 05:23:43'),
(126, 63, 3, 'comment with pic ', '/uploads/forum-images/1731752816088.png', '2024-11-16 10:26:56'),
(127, 63, 3, 'comment without pic', NULL, '2024-11-16 10:27:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `forum` (`forum_id`),
  ADD KEY `user` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
