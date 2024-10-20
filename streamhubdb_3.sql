-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2024 at 03:21 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `streamhubdb`
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
(2, 1, 3, 'wow this is epic', NULL, '2024-10-12 09:25:22'),
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
(72, 36, 8, 'does it work', NULL, '2024-10-20 12:54:36');

-- --------------------------------------------------------

--
-- Table structure for table `forums`
--

CREATE TABLE `forums` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forums`
--

INSERT INTO `forums` (`id`, `title`, `content`, `user_id`, `created_at`) VALUES
(1, 'scifi', 'helllo i love movie', 1, '2024-10-11 12:38:41'),
(6, 'interstller', 'i love this movie', 8, '2024-10-12 10:22:05'),
(9, 'martian', 'goated movie', 6, '2024-10-12 20:09:53'),
(11, 'ASDS', 'SDSA', 3, '2024-10-16 10:11:50'),
(30, 'test forum', 'hello this work', 6, '2024-10-19 18:00:05'),
(36, 'fast and furious', 'i dont like them ', 8, '2024-10-20 12:37:43');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `mid` int(10) NOT NULL,
  `title` varchar(30) NOT NULL,
  `genre` varchar(20) NOT NULL,
  `rdate` varchar(5) NOT NULL,
  `runtime` varchar(4) NOT NULL,
  `description` varchar(100) NOT NULL,
  `viewers` int(10) DEFAULT 1,
  `imgpath` text NOT NULL,
  `filepath` text NOT NULL,
  `trailer_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`mid`, `title`, `genre`, `rdate`, `runtime`, `description`, `viewers`, `imgpath`, `filepath`, `trailer_url`) VALUES
(1, 'Oz the Great and Powerful', 'Adventure', '2013-', '130', 'A small-time magician is swept away to an enchanted land and is forced into a power struggle between', 1, 'uploads\\posters\\1726081513616.jpg', 'uploads\\movies\\1726081504391.mp4', 'https://www.youtube.com/results?search_query=oz+the+great+and+powerful+trailer'),
(3, 'My Man Godfrey', 'Comedy', '1936-', '94', 'A scatterbrained socialite hires a vagrant as a family butler - but there\'s more to Godfrey than mee', 1, 'uploads\\posters\\1726082269866.jpg', 'uploads\\movies\\1726082265639.mp4', 'https://www.imdb.com/video/vi3249931545/?ref_=ext_shr_lnk'),
(5, 'His Girl Friday', 'Romance', '1940-', '93', 'A newspaper editor uses every trick in the book to keep his ace reporter ex-wife from quitting and r', 1, 'uploads\\posters\\1726137862535.jpg', 'uploads\\movies\\1726137861727.mp4', 'https://www.imdb.com/video/vi4108846105/?playlistId=tt0032599&ref_=ext_shr_lnk'),
(7, 'Disorder in the Court', 'Comedy', '1936-', '16', 'The stooges are witnesses at a trial where their friend, a dancer at a nightclub where they are musi', 1, 'uploads\\posters\\1726139019012.jpg', 'uploads\\movies\\1726139004943.mp4', 'https://www.youtube.com/watch?v=E33qzW4Qvr8'),
(53, 'Big Duck update test', 'Adventure', '2020-', '15', 'Lmaoooo!', 1, 'uploads\\posters\\1726396270555.jpeg', 'uploads\\movies\\1726396268948.mp4', 'https://www.imdb.com/video/vi3249931545/?ref_=ext_shr_lnk');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(255) NOT NULL,
  `fName` varchar(255) NOT NULL,
  `lName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fName`, `lName`, `Email`, `Password`) VALUES
(1, 'The', 'Admin', 'admin@boss.com', '123'),
(3, 'TheTop', 'G', 'TheTopG@nice.com', '555'),
(6, 'Supa', 'HotFire', 'BoomPow@gmail.com', '987'),
(8, 'jack', 'sam', 'hossam@powpow.com', '573985738'),
(11, 'TheMan', 'TheMyth', 'TheLegend@me.com', '9001');

-- --------------------------------------------------------

--
-- Table structure for table `user_movie_interaction`
--

CREATE TABLE `user_movie_interaction` (
  `interaction_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `viewed` tinyint(1) DEFAULT 0,
  `liked` tinyint(1) DEFAULT 0,
  `rated` tinyint(1) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT NULL CHECK (`rating` between 0 and 5),
  `added_to_watchlist` tinyint(1) DEFAULT 0,
  `picked_during_signup` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `forums`
--
ALTER TABLE `forums`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users` (`user_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`mid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_movie_interaction`
--
ALTER TABLE `user_movie_interaction`
  ADD PRIMARY KEY (`interaction_id`),
  ADD KEY `midf` (`movie_id`),
  ADD KEY `uidf` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `forums`
--
ALTER TABLE `forums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `mid` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user_movie_interaction`
--
ALTER TABLE `user_movie_interaction`
  MODIFY `interaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `forum` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `forums`
--
ALTER TABLE `forums`
  ADD CONSTRAINT `users` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user_movie_interaction`
--
ALTER TABLE `user_movie_interaction`
  ADD CONSTRAINT `midf` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`mid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uidf` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
