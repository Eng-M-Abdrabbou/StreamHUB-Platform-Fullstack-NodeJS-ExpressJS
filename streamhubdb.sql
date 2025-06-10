-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 09, 2024 at 07:49 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
-- Table structure for table `forums`
--

CREATE TABLE `forums` (
  `forum_id` int(11) NOT NULL,
  `forum_name` varchar(255) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forums`
--

INSERT INTO `forums` (`forum_id`, `forum_name`, `creator_id`, `created_at`) VALUES
(1, 'Godfather fandom', 3, '2024-10-06 14:51:23'),
(2, 'Vito is best(The God Father)', 3, '2024-10-06 17:08:55'),
(3, 'Darth Vader is cute', 10, '2024-10-06 17:11:23'),
(4, 'Somalian Pirates of the Carribean', 10, '2024-10-06 17:56:58');

-- --------------------------------------------------------

--
-- Table structure for table `forum_posts`
--

CREATE TABLE `forum_posts` (
  `post_id` int(11) NOT NULL,
  `forum_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forum_posts`
--

INSERT INTO `forum_posts` (`post_id`, `forum_id`, `user_id`, `content`, `image_path`, `created_at`) VALUES
(1, 1, 3, 'im supa hot booooyyy!', NULL, '2024-10-06 17:24:19'),
(5, 1, 3, 'that\'sss the movie baby!\r\n\r\nPost image', '/uploads/forum-images/1728236994654.jpg', '2024-10-06 17:49:54'),
(6, 2, 3, 'smaller vito is called michael', '/uploads/forum-images/1728237029213.jpg', '2024-10-06 17:50:29'),
(7, 3, 3, 'Darth Vader is cute, \r\n\r\ndarth loves you by walyou  <a href=\"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwalyou.com%2Fcute-darth-vader%2Fdarth-vader-loves%2F&psig=AOvVaw3PZN4l1YF5YxdQHXHqeUB2&ust=1728323489277000&source=images&cd=vfe&opi=89978449&ved=0CBcQjhxqFwoTCLi2ufio-ogDFQAAAAAdAAAAABAE\">check it here</a>', '/uploads/forum-images/1728237284416.jpg', '2024-10-06 17:54:44'),
(8, 1, 10, 'seems like a nice movie', NULL, '2024-10-06 17:56:16'),
(9, 4, 10, 'yeah, thats what i\'m talking about', '/uploads/forum-images/1728237488088.png', '2024-10-06 17:58:08'),
(11, 4, 3, 'Gandu movie', NULL, '2024-10-17 10:10:43'),
(12, 3, 3, 'he\'s lowkey shawty\r\n', NULL, '2024-10-17 10:40:43');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `timestamp`) VALUES
(1, 3, 10, 'hey', '2024-10-06 14:20:13'),
(2, 3, 10, 'hello', '2024-10-06 14:21:39'),
(3, 10, 3, 'hey', '2024-10-06 14:23:09'),
(4, 10, 3, 'how is it going', '2024-10-06 14:23:25'),
(5, 3, 10, 'can you hear me', '2024-10-06 14:23:33'),
(6, 10, 3, 'wow, its working', '2024-10-06 14:24:04'),
(7, 3, 10, 'yeah', '2024-10-06 14:24:12'),
(8, 3, 10, 'how are you feeling about this', '2024-10-06 14:28:05'),
(9, 10, 3, 'im liking it', '2024-10-06 14:28:12'),
(10, 3, 5, 'hey', '2024-10-06 14:34:55'),
(11, 10, 3, 'bye', '2024-10-06 14:35:01'),
(12, 5, 3, 'hey', '2024-10-06 14:35:36'),
(13, 3, 5, 'wassap', '2024-10-06 14:36:34'),
(14, 5, 3, 'good', '2024-10-06 14:36:39'),
(15, 3, 5, 'hey', '2024-10-06 14:40:02'),
(16, 5, 3, 'hey', '2024-10-06 14:40:07'),
(17, 3, 5, 'good', '2024-10-06 14:40:13'),
(18, 5, 3, 'how are you', '2024-10-06 14:40:22'),
(19, 3, 5, '1', '2024-10-06 14:42:27'),
(20, 5, 3, '2', '2024-10-06 14:42:31'),
(21, 3, 5, '3', '2024-10-06 14:42:35'),
(22, 10, 3, 'hey', '2024-10-06 14:43:48'),
(23, 3, 10, 'hey', '2024-10-06 14:43:58'),
(24, 3, 10, 'how is it going', '2024-10-06 14:44:06'),
(25, 10, 3, 'good', '2024-10-06 14:44:15'),
(26, NULL, 3, 'hey', '2024-10-06 14:45:49'),
(27, 3, 10, 'hello', '2024-10-06 14:46:28'),
(28, 10, 3, 'hey', '2024-10-06 14:46:54'),
(29, 3, 10, '1', '2024-10-06 14:47:06'),
(30, 10, 3, '2', '2024-10-06 14:47:09'),
(31, 3, 10, 'hey', '2024-10-06 14:59:37'),
(32, 10, 3, 'hello', '2024-10-06 14:59:45'),
(33, 3, 10, 'hello', '2024-10-06 15:02:02'),
(34, 10, 3, 'hey', '2024-10-06 15:02:42'),
(35, 10, 10, 'hello', '2024-10-06 21:59:03'),
(36, 10, 10, 'hey', '2024-10-06 21:59:17'),
(37, 10, 3, 'yaaay', '2024-10-06 21:59:48'),
(38, 3, 10, 'hey', '2024-10-06 22:05:59'),
(39, 3, 10, 'that was nice', '2024-10-06 22:06:11'),
(40, 3, 10, 'blah blah blah', '2024-10-06 22:06:27'),
(41, 3, 10, 'Hey, I missed you man, Have you seen that crazy movie', '2024-10-16 16:46:46'),
(42, 3, 10, 'hey, how is it going', '2024-10-19 10:00:28'),
(43, 3, 10, '1', '2024-10-19 10:00:35'),
(44, 13, 10, 'hey', '2024-10-21 09:22:58');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `movie_id` int(10) NOT NULL,
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

INSERT INTO `movies` (`movie_id`, `title`, `genre`, `rdate`, `runtime`, `description`, `viewers`, `imgpath`, `filepath`, `trailer_url`) VALUES
(1, 'Oz the Great and Powerful', 'Adventure', '2013-', '130', 'A small-time magician is swept away to an enchanted land and is forced into a power struggle between', 1, 'uploads\\posters\\1726081513616.jpg', 'uploads\\movies\\1726081504391.mp4', 'https://www.youtube.com/results?search_query=oz+the+great+and+powerful+trailer'),
(2, 'My Man Godfrey', 'Comedy', '1936-', '94', 'A scatterbrained socialite hires a vagrant as a family butler - but there\'s more to Godfrey than mee', 1, 'uploads\\posters\\1726082269866.jpg', 'uploads\\movies\\1726082265639.mp4', 'https://www.imdb.com/video/vi3249931545/?ref_=ext_shr_lnk'),
(3, 'His Girl Friday', 'Romance', '1940-', '93', 'A newspaper editor uses every trick in the book to keep his ace reporter ex-wife from quitting and r', 1, 'uploads\\posters\\1726137862535.jpg', 'uploads\\movies\\1726137861727.mp4', 'https://www.imdb.com/video/vi4108846105/?playlistId=tt0032599&ref_=ext_shr_lnk'),
(4, 'Disorder in the Court', 'Comedy', '1936-', '16', 'The stooges are witnesses at a trial where their friend, a dancer at a nightclub where they are musi', 1, 'uploads\\posters\\1726139019012.jpg', 'uploads\\movies\\1726139004943.mp4', 'https://www.youtube.com/watch?v=E33qzW4Qvr8'),
(5, 'Big Duck update test', 'Adventure', '2020-', '15', 'Lmaoooo!', 1, 'uploads\\posters\\1726396270555.jpeg', 'uploads\\movies\\1726396268948.mp4', 'https://www.imdb.com/video/vi3249931545/?ref_=ext_shr_lnk'),
(6, 'The Shawshank Redemption', 'Drama', '1994-', '142', ' A prisoner, wrongly convicted of murder, attempts to escape from a corrupt prison.', 1, 'uploads\\posters\\1727279650493.jpg', 'uploads\\movies\\1727279650042.mp4', 'https://www.youtube.com/watch?v=PLl99DlL6b4'),
(7, 'The Godfather', 'Crime', '1972-', '175', 'A crime family\'s patriarch transfers the leadership of his organization to his reluctant son.', 1, 'uploads\\posters\\1727279804918.jpg', 'uploads\\movies\\1727279804747.mp4', 'https://www.youtube.com/watch?v=UaVTIH8mujA'),
(8, 'The Dark Knight', 'Action', '2006-', '152', 'Batman battles the Joker, a criminal mastermind who plans to plunge Gotham City into chaos.', 1, 'uploads\\posters\\1727279902347.jpg', 'uploads\\movies\\1727279902242.mp4', 'https://www.youtube.com/watch?v=EXeTwQWrcwY'),
(9, '12 Angry Men', 'Crime', '1957-', '96', 'A jury deliberates over the guilt or innocence of a young man accused of murder.', 1, 'uploads\\posters\\1727280355579.jpg', 'uploads\\movies\\1727280355480.mp4', 'https://www.youtube.com/watch?v=TEN-2uTi2c0'),
(10, 'Schindler\'s List', 'Biography', '1993-', '195', 'A German businessman saves the lives of hundreds of Jews during the Holocaust.', 1, 'uploads\\posters\\1727280458811.jpg', 'uploads\\movies\\1727280458735.mp4', 'https://www.youtube.com/watch?v=mxphAlJID9U'),
(11, 'The Red Dead Redemption ', 'Drama', '2010-', '150', 'A former outlaw seeks redemption in the Wild West.', 1, 'uploads\\posters\\1727280550337.jpg', 'uploads\\movies\\1727280550256.mp4', 'https://www.youtube.com/watch?v=-o7rES_3ymA'),
(12, 'The Godfather: Part II', 'Crime', '1974-', '200', 'The Corleone family\'s saga continues as Michael attempts to expand his empire and deal with the cons', 1, 'uploads\\posters\\1727280666137.jpg', 'uploads\\movies\\1727280666031.mp4', 'https://www.youtube.com/watch?v=9O1Iy9od7-A'),
(13, 'The Knight', 'Action', '2023-', '107', 'A knight must protect his kingdom from a powerful sorcerer.', 1, 'uploads\\posters\\1727280761008.jpg', 'uploads\\movies\\1727280760933.mp4', 'https://www.youtube.com/watch?v=EXeTwQWrcwY'),
(14, '12 Happy Men', 'Crime', '1963-', '96', 'A jury deliberates over the guilt or innocence of a young man accused of murder.', 1, 'uploads\\posters\\1727280826942.jpg', 'uploads\\movies\\1727280826855.mp4', 'https://www.youtube.com/watch?v=TEN-2uTi2c0'),
(15, 'Bruh List', 'Biography', '2023-', '105', 'A group of friends navigate the challenges of life in the 1990s.', 1, 'uploads\\posters\\1727280900700.jpg', 'uploads\\movies\\1727280900618.mp4', 'https://www.youtube.com/watch?v=NX14QV2gSnY'),
(16, 'Pulp Fiction', 'Crime', '1994-', '154', 'A series of interconnected stories involving a boxer, a hitman, and a gangster\'s wife.', 1, 'uploads\\posters\\1727280964670.jpg', 'uploads\\movies\\1727280964607.mp4', 'https://www.youtube.com/watch?v=tGpTpVyI_OQ'),
(17, 'The Lord of the Rings: The Ret', 'Action', '2003-', '221', 'The Fellowship of the Ring must destroy the One Ring and defeat the Dark Lord Sauron.', 1, 'uploads\\posters\\1727281028777.jpg', 'uploads\\movies\\1727281028751.mp4', 'https://www.youtube.com/watch?v=r5X-hFf6Bwo'),
(18, 'Fight Club', 'Drama', '1999-', '139', 'An insomniac office worker forms an underground fight club with a charismatic soap salesman.', 1, 'uploads\\posters\\1727281084505.jpg', 'uploads\\movies\\1727281084454.mp4', 'https://www.youtube.com/watch?v=BdJKm16Co6M'),
(19, 'Forrest Gump', 'Drama', '1994-', '182', 'The life of a kind-hearted man with low IQ, who unwittingly influences several historical events.', 1, 'uploads\\posters\\1727281171502.jpg', 'uploads\\movies\\1727281171439.mp4', 'https://www.youtube.com/watch?v=bLvqoHBptjg'),
(20, 'Inception ', 'Action', '2010-', '148', 'A professional thief is offered a chance to implant an idea into someone\'s subconscious.', 1, 'uploads\\posters\\1727281241623.jpg', 'uploads\\movies\\1727281241565.mp4', 'https://www.youtube.com/watch?v=YoHD9XEInc0'),
(22, 'The Matrix', 'Action', '1999-', '135', 'A computer hacker discovers the world is a simulated reality controlled by intelligent machines.', 1, 'uploads\\posters\\1727281293456.jpg', 'uploads\\movies\\1727281293399.mp4', 'https://www.youtube.com/watch?v=vKQi3bBA1y8'),
(71, 'The Iron Mask', 'Adventure', '1929-', '100', 'The Iron Mask is a 1929 American part-talkie adventure film directed by Allan Dwan. It is an adaptat', 1, 'uploads\\posters\\1727527025102.jpg', 'uploads\\movies\\1727526936940.mp4', 'https://www.youtube.com/watch?v=qYsrzq83VwA&pp=ygUadGhlIGlyb24gbWFzayAxOTI5IHRyYWlsZXI%3D');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `interaction_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `movie_id` int(11) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL CHECK (`rating` between 0 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratings`
--

INSERT INTO `ratings` (`interaction_id`, `user_id`, `movie_id`, `rating`) VALUES
(226, 1, 1, 4.5),
(227, 1, 2, 5.0),
(228, 1, 3, 4.0),
(229, 1, 4, 3.5),
(230, 1, 5, 4.5),
(231, 1, 6, 4.0),
(232, 2, 1, 5.0),
(233, 2, 3, 4.0),
(234, 2, 4, 4.5),
(235, 2, 7, 5.0),
(236, 2, 8, 3.5),
(237, 3, 2, 4.5),
(238, 3, 3, 5.0),
(239, 3, 5, 4.5),
(240, 3, 9, 4.0),
(241, 3, 10, 5.0),
(242, 4, 6, 3.0),
(243, 4, 11, 4.0),
(244, 4, 12, 4.5),
(245, 4, 13, 4.0),
(246, 4, 14, 4.0),
(247, 5, 7, 4.5),
(248, 5, 15, 5.0),
(249, 5, 16, 4.0),
(250, 5, 17, 3.5),
(251, 6, 3, 4.0),
(252, 6, 4, 4.5),
(253, 6, 18, 4.0),
(254, 6, 19, 4.5),
(255, 6, 20, 5.0),
(256, 7, 1, 3.5),
(257, 7, 8, 4.0),
(258, 7, 9, 4.5),
(259, 7, 10, 3.0),
(260, 8, 2, 4.0),
(261, 8, 13, 4.5),
(262, 8, 14, 4.0),
(263, 8, 15, 4.0),
(264, 9, 16, 4.5),
(265, 9, 17, 5.0),
(266, 9, 18, 4.0),
(267, 10, 5, 4.5),
(268, 10, 12, 4.0),
(269, 10, 19, 4.5),
(270, 10, 20, 5.0),
(271, 3, 7, 5.0),
(272, 3, 12, 5.0),
(273, 3, 20, 5.0),
(274, 3, 18, 4.9),
(275, 3, 8, 3.0),
(276, 3, 16, 3.0);

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
(2, 'TheTop', 'G', 'TheTopG@nice.com', '555'),
(3, 'Supa', 'HotFire', 'BoomPow@gmail.com', '987'),
(4, 'jack', 'sam', 'hossam@powpow.com', '573985738'),
(5, 'TheMan', 'TheMyth', 'TheLegend@me.com', '9001'),
(6, 'vroom', 'VROOM', 'BAOPOO@gmail.com', '222'),
(7, 'Rab', 'Bam', 'RAMBAM@gmail.com', '111'),
(8, 'AHMED', 'ALI', 'AHMEDALI2001@GMAIL.COM', '2001@AA@18@5'),
(9, 'AC', 'DC', 'BACKINBLACK@OHYEAAH.COM', 'AYYAYYA'),
(10, 'Inigo', 'Montoya', 'prepareto@die.com', 'no'),
(13, 'Ahmed', 'Moahmmed', 'AM@gmail.com', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `forums`
--
ALTER TABLE `forums`
  ADD PRIMARY KEY (`forum_id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Indexes for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `forum_id` (`forum_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`movie_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`interaction_id`),
  ADD KEY `midf` (`movie_id`),
  ADD KEY `uidf` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `forums`
--
ALTER TABLE `forums`
  MODIFY `forum_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `forum_posts`
--
ALTER TABLE `forum_posts`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `movie_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `interaction_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=277;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `forums`
--
ALTER TABLE `forums`
  ADD CONSTRAINT `forums_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `forum_posts`
--
ALTER TABLE `forum_posts`
  ADD CONSTRAINT `forum_posts_ibfk_1` FOREIGN KEY (`forum_id`) REFERENCES `forums` (`forum_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `forum_posts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `midf` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `uidf` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
