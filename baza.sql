-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: displaytv
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.37-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `displays`
--

DROP TABLE IF EXISTS `displays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `displays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `displays`
--

LOCK TABLES `displays` WRITE;
/*!40000 ALTER TABLE `displays` DISABLE KEYS */;
INSERT INTO `displays` VALUES (14,'TV 2','lokacija'),(15,'TV 3','lokacija'),(16,'TV 4','lokacija'),(17,'TV 5','lokacija'),(18,'TV 6','lokacija');
/*!40000 ALTER TABLE `displays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graphs`
--

DROP TABLE IF EXISTS `graphs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `graphs` (
  `id_graph` int(11) NOT NULL AUTO_INCREMENT,
  `data` varchar(500) DEFAULT NULL,
  `columns` varchar(500) DEFAULT NULL,
  `name_graph` varchar(45) DEFAULT NULL,
  `graph_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_graph`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graphs`
--

LOCK TABLES `graphs` WRITE;
/*!40000 ALTER TABLE `graphs` DISABLE KEYS */;
INSERT INTO `graphs` VALUES (2,'[[\"jan\",12],[\"feb\",120],[\"mar\",800],[\"apr\",2000],[\"may\",500],[\"jun\",2015],[\"jul\",300],[\"aug\",1]]','[\"jan\",\"feb\",\"mar\",\"apr\",\"may\",\"jun\",\"jul\",\"aug\"]','Graf 1',NULL),(7,'[[\"januar\",100,200],[\"februar\",200,300],[\"marec\",300,400],[\"april\",400,500],[\"maj\",500,600],[\"junij\",600,700],[\"julij\",700,800],[\"avgust\",1000,900],[\"september\",350,1000],[\"oktober\",100,1],[\"november\",2000,2],[\"december\",250,3]]','[\"mesec\",\"value\",\"value\"]','qwe','ColumnChart'),(10,'[[\"januar\",100,200],[\"februar\",200,300],[\"marec\",300,400],[\"april\",400,500],[\"maj\",500,600],[\"junij\",600,700],[\"julij\",700,800],[\"avgust\",1000,900],[\"september\",350,1000],[\"oktober\",100,100],[\"november\",2000,200],[\"december\",250,300]]','[\"mesec\",\"value\",\"value\"]','graf','ColumnChart');
/*!40000 ALTER TABLE `graphs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `type` varchar(45) NOT NULL,
  `active` int(11) NOT NULL,
  `ord` int(11) DEFAULT '0',
  `duration` varchar(45) DEFAULT '5000',
  `graph` int(11) DEFAULT NULL,
  `display` int(30) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_items_graphs1_idx` (`graph`),
  KEY `fk_items_displays1_idx` (`display`),
  CONSTRAINT `fk_items_displays1` FOREIGN KEY (`display`) REFERENCES `displays` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_items_graphs1` FOREIGN KEY (`graph`) REFERENCES `graphs` (`id_graph`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES (205,'Graf 1','graph',1,0,'5000',2,18),(207,'Graf 1','graph',1,0,'5000',2,15),(208,'Graf 1','graph',1,0,'5000',2,16),(209,'Graf 1','graph',1,0,'5000',2,17),(210,'Graf 1','graph',1,1,'5000',2,15),(211,'Graf 1','graph',1,1,'5000',2,16),(213,'Graf 1','graph',1,1,'5000',2,18),(221,'qwe','graph',1,2,'5000',7,15),(222,'qwe','graph',1,2,'5000',7,16),(223,'qwe','graph',1,1,'5000',7,17),(224,'qwe','graph',1,2,'5000',7,18),(225,'16maxresdefault.jpg','image',1,3,'5000',NULL,16),(228,'16maxresdefault.jpg','image',1,2,'5000',NULL,17),(229,'16maxresdefault.jpg','image',1,3,'5000',NULL,18),(230,'graf','graph',1,0,'5000',10,14);
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-25 15:36:59
