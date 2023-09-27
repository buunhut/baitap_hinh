-- -------------------------------------------------------------
-- TablePlus 5.3.8(500)
--
-- https://tableplus.com/
--
-- Database: db_hinhanh
-- Generation Time: 2023-09-27 09:36:42.4860
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `comments` (
  `cId` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `dateComment` date NOT NULL,
  `iId` int NOT NULL,
  `uId` int NOT NULL,
  `sta` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`cId`),
  KEY `iId` (`iId`),
  KEY `uId` (`uId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`iId`) REFERENCES `images` (`iId`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`uId`) REFERENCES `users` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `images` (
  `iId` int NOT NULL AUTO_INCREMENT,
  `tenHinh` varchar(255) NOT NULL,
  `moTa` text,
  `url` text NOT NULL,
  `dateUp` date NOT NULL,
  `uId` int NOT NULL,
  `sta` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`iId`),
  KEY `uId` (`uId`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`uId`) REFERENCES `users` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `saved` (
  `sId` int NOT NULL AUTO_INCREMENT,
  `dateSave` date NOT NULL,
  `iId` int NOT NULL,
  `uId` int NOT NULL,
  `sta` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`sId`),
  KEY `iId` (`iId`),
  KEY `uId` (`uId`),
  CONSTRAINT `saved_ibfk_1` FOREIGN KEY (`iId`) REFERENCES `images` (`iId`),
  CONSTRAINT `saved_ibfk_2` FOREIGN KEY (`uId`) REFERENCES `users` (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `uId` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `pass` varchar(100) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `age` varchar(4) DEFAULT NULL,
  `avatar` text,
  `sta` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`uId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;