-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 14, 2019 at 03:50 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alp_progress`
--
CREATE DATABASE IF NOT EXISTS `alp_progress` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `alp_progress`;

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
CREATE TABLE IF NOT EXISTS `course` (
  `course_code` varchar(10) NOT NULL,
  `course_name` text NOT NULL,
  `course_desc` text NOT NULL,
  `number_units` int(11) NOT NULL,
  `number_credits` int(11) NOT NULL,
  `comment` text,
  PRIMARY KEY (`course_code`),
  KEY `course_code` (`course_code`),
  KEY `number_units` (`number_units`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_code`, `course_name`, `course_desc`, `number_units`, `number_credits`, `comment`) VALUES
('ICOM3010', 'Self-directed Study', 'Self-directed Study', 6, 2, NULL),
('INFT4000', 'Special Topics', 'HTML5 game development with CreateJS', 4, 2, NULL),
('WEBD3000', 'Web Application Programming II', 'Introduction to PHP', 5, 1, NULL),
('WEBD3027', 'Developing for Content Management Systems', 'Introduction to WordPress development', 2, 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `administrators`
--

DROP TABLE IF EXISTS `administrators`;
CREATE TABLE IF NOT EXISTS `administrators` (
  `nscc_id` varchar(8) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `password` text,
  `salt` text,
  `password_reset_req` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`nscc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `administrators`
--

INSERT INTO `administrators` (`nscc_id`, `first_name`, `last_name`, `password`, `salt`, `password_reset_req`) VALUES
('W0000001', 'admin', 'admin', 'a23d85014f9fc9fa6cda13b0357cbd057456fe5950dec81fb16e0c1b11ca86703691f619a98688bd95c8fafa867c63a13b535d1c5a630c8e4afddef3149d5383', 'be6a51466e7d078f948c57a5adf31d6a79e60be977917a2ec4477b2d55f7ba46', 0);

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE IF NOT EXISTS `faculty` (
  `nscc_id` varchar(8) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `password` text,
  `salt` text,
  `comment` text,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `password_reset_req` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`nscc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`nscc_id`, `first_name`, `last_name`, `password`, `salt`, `comment`, `active`, `password_reset_req`) VALUES
('W0000001', 'admin', 'admin', 'a23d85014f9fc9fa6cda13b0357cbd057456fe5950dec81fb16e0c1b11ca86703691f619a98688bd95c8fafa867c63a13b535d1c5a630c8e4afddef3149d5383', 'be6a51466e7d078f948c57a5adf31d6a79e60be977917a2ec4477b2d55f7ba46', NULL, 1, 0),
('W1468495', 'Kirestin', 'Mcmahon', NULL, NULL, 'lacus@mollis.edu', 1, 1),
('W5508469', 'Julian', 'Ayers', NULL, NULL, NULL, 0, 1),
('W8992702', 'Jarrod', 'Huber', NULL, NULL, 'testing faculty', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
CREATE TABLE IF NOT EXISTS `progress` (
  `prog_id` int(11) NOT NULL AUTO_INCREMENT,
  `nscc_id` varchar(8) NOT NULL,
  `course_code` varchar(8) NOT NULL,
  `unit` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `final` int(11) DEFAULT NULL,
  PRIMARY KEY (`prog_id`),
  KEY `nscc_id` (`nscc_id`),
  KEY `course_code` (`course_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `progress`
--

INSERT INTO `progress` (`prog_id`, `nscc_id`, `course_code`, `unit`, `date`, `final`, `comments`) VALUES
(11, 'W1234567', 'WEBD3027', 1, '2019-03-01', NULL, NULL),
(12, 'W1234567', 'WEBD3027', 2, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
CREATE TABLE IF NOT EXISTS `student` (
  `nscc_id` varchar(8) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `password` text,
  `salt` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `advisor` varchar(50) NOT NULL,
  `comment` text,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `password_reset_req` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`nscc_id`),
  KEY `nscc_id` (`nscc_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`nscc_id`, `first_name`, `last_name`, `password`, `salt`, `start_date`, `end_date`, `advisor`, `comment`, `active`, `password_reset_req`) VALUES
('W1234567', 'John', 'Doe', NULL, NULL, '1999-09-09', '2001-05-01', 'Jane Doe', NULL, 1, 1),
('W3429361', 'Marcia', 'Pierce', NULL, NULL, '1963-11-22', '1965-11-22', 'Ferris Gonzalez', NULL, 1, 1),
('W7770595', 'Shepherd', 'Fitzgerald', NULL, NULL, '1961-03-21', '1963-03-21', 'Pascale Flowers', NULL, 1, 1),
('W8671282', 'Ivy', 'Kramer', NULL, NULL, '1968-04-12', '1970-04-12', 'Sophia Nixon', NULL, 1, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `progress`
--
ALTER TABLE `progress`
  ADD CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`nscc_id`) REFERENCES `student` (`nscc_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`course_code`) REFERENCES `course` (`course_code`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
