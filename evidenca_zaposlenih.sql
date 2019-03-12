-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Gostitelj: 127.0.0.1
-- Čas nastanka: 09. jan 2019 ob 15.08
-- Različica strežnika: 10.1.37-MariaDB
-- Različica PHP: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Zbirka podatkov: `evidenca_zaposlenih`
--

-- --------------------------------------------------------

--
-- Struktura tabele `pogodba_zaposlitev`
--

CREATE TABLE `pogodba_zaposlitev` (
  `id` int(11) NOT NULL,
  `datum_sklenitve` int(30) NOT NULL,
  `datum_nastopa_dela` int(30) NOT NULL,
  `vrsta_pogodbe` varchar(20) NOT NULL,
  `razlog_dolocen_cas` varchar(20) NOT NULL,
  `poklic` varchar(20) NOT NULL,
  `strok_uspos` varchar(20) NOT NULL,
  `naziv_del_mesta` text NOT NULL,
  `st_ur_teden` int(5) NOT NULL,
  `razporeditev_del_casa` text NOT NULL,
  `kraj_dela` varchar(20) NOT NULL,
  `konkurencna_klavzula` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabele `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `username` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktura tabele `vzdrzevani_druz_clani`
--

CREATE TABLE `vzdrzevani_druz_clani` (
  `id` int(10) NOT NULL,
  `ime` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `priimek` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `emso` int(13) NOT NULL,
  `davcna` int(8) NOT NULL,
  `sorod_razmerje` varchar(15) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `zaposleni_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Odloži podatke za tabelo `vzdrzevani_druz_clani`
--

INSERT INTO `vzdrzevani_druz_clani` (`id`, `ime`, `priimek`, `emso`, `davcna`, `sorod_razmerje`, `zaposleni_id`) VALUES
(1, 'asd', 'asdd', 12313, 123123, '123123', 2);

--
-- Sprožilci `vzdrzevani_druz_clani`
--
DELIMITER $$
CREATE TRIGGER `beforeupdate` BEFORE UPDATE ON `vzdrzevani_druz_clani` FOR EACH ROW insert into vzdrzevani_druz_clani_history SELECT * FROM vzdrzevani_druz_clani
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabele `vzdrzevani_druz_clani_history`
--

CREATE TABLE `vzdrzevani_druz_clani_history` (
  `id` int(10) NOT NULL,
  `ime` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `priimek` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `emso` int(13) NOT NULL,
  `davcna` int(8) NOT NULL,
  `sorod_razmerje` varchar(15) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `zaposleni_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Odloži podatke za tabelo `vzdrzevani_druz_clani_history`
--

INSERT INTO `vzdrzevani_druz_clani_history` (`id`, `ime`, `priimek`, `emso`, `davcna`, `sorod_razmerje`, `zaposleni_id`) VALUES
(1, 'asd', 'asd', 12313, 123123, '123123', 0),
(1, 'asd', 'asd', 12313, 123123, '123123', 2);

-- --------------------------------------------------------

--
-- Struktura tabele `zaposleni`
--

CREATE TABLE `zaposleni` (
  `emso` int(13) NOT NULL,
  `ime` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `kraj_rojstva` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `drzava_rojstva` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `id` int(10) NOT NULL,
  `maticna_st` int(5) NOT NULL,
  `davcna` int(11) NOT NULL,
  `drzavljanstvo` varchar(15) NOT NULL,
  `stalni_naslov` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `zacasni_naslov` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `izobrazba` varchar(20) NOT NULL,
  `invalidnost` int(5) NOT NULL,
  `kategorija_inv` int(5) NOT NULL,
  `delna_upok` int(5) NOT NULL,
  `last_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ime_delodajalca_dop` varchar(10) NOT NULL,
  `naslov_delodajalca_dop` varchar(30) NOT NULL,
  `pogodba_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Odloži podatke za tabelo `zaposleni`
--

INSERT INTO `zaposleni` (`emso`, `ime`, `kraj_rojstva`, `drzava_rojstva`, `id`, `maticna_st`, `davcna`, `drzavljanstvo`, `stalni_naslov`, `zacasni_naslov`, `izobrazba`, `invalidnost`, `kategorija_inv`, `delna_upok`, `last_change`, `ime_delodajalca_dop`, `naslov_delodajalca_dop`, `pogodba_fk`) VALUES
(123, 'asd', 'asd', 'asd', 2, 123, 123, 'qwe', 'qwe', 'qwe', 'qwe', 1, 1, 1, '2019-01-09 12:18:58', '', '', 0);

--
-- Sprožilci `zaposleni`
--
DELIMITER $$
CREATE TRIGGER `after_update` BEFORE UPDATE ON `zaposleni` FOR EACH ROW insert into zaposleni_history SELECT * FROM zaposleni
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabele `zaposleni_history`
--

CREATE TABLE `zaposleni_history` (
  `emso` int(13) NOT NULL,
  `ime` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `kraj_rojstva` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `drzava_rojstva` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `id` int(10) UNSIGNED NOT NULL,
  `maticna_st` int(5) NOT NULL,
  `davcna` int(11) NOT NULL,
  `drzavljanstvo` varchar(15) NOT NULL,
  `stalni_naslov` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `zacasni_naslov` varchar(20) CHARACTER SET utf32 COLLATE utf32_slovenian_ci NOT NULL,
  `izobrazba` varchar(20) NOT NULL,
  `invalidnost` int(5) NOT NULL,
  `kategorija_inv` int(5) NOT NULL,
  `delna_upok` int(5) NOT NULL,
  `last_change` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ime_delodajalca_dop` varchar(10) NOT NULL,
  `naslov_delodajalca_dop` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Odloži podatke za tabelo `zaposleni_history`
--

INSERT INTO `zaposleni_history` (`emso`, `ime`, `kraj_rojstva`, `drzava_rojstva`, `id`, `maticna_st`, `davcna`, `drzavljanstvo`, `stalni_naslov`, `zacasni_naslov`, `izobrazba`, `invalidnost`, `kategorija_inv`, `delna_upok`, `last_change`, `ime_delodajalca_dop`, `naslov_delodajalca_dop`) VALUES
(123, 'asd', 'asd', 'asd', 2, 123, 123, 'qwe', 'qwe', 'qwe', 'qwe', 1, 1, 1, '2019-01-09 12:18:58', '', '');

--
-- Indeksi zavrženih tabel
--

--
-- Indeksi tabele `pogodba_zaposlitev`
--
ALTER TABLE `pogodba_zaposlitev`
  ADD PRIMARY KEY (`id`);

--
-- Indeksi tabele `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indeksi tabele `vzdrzevani_druz_clani`
--
ALTER TABLE `vzdrzevani_druz_clani`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tujifk` (`zaposleni_id`);

--
-- Indeksi tabele `vzdrzevani_druz_clani_history`
--
ALTER TABLE `vzdrzevani_druz_clani_history`
  ADD UNIQUE KEY `tujifk` (`zaposleni_id`),
  ADD KEY `id` (`id`) USING BTREE;

--
-- Indeksi tabele `zaposleni`
--
ALTER TABLE `zaposleni`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pogodba_fk` (`pogodba_fk`);

--
-- AUTO_INCREMENT zavrženih tabel
--

--
-- AUTO_INCREMENT tabele `pogodba_zaposlitev`
--
ALTER TABLE `pogodba_zaposlitev`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT tabele `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT tabele `vzdrzevani_druz_clani`
--
ALTER TABLE `vzdrzevani_druz_clani`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT tabele `vzdrzevani_druz_clani_history`
--
ALTER TABLE `vzdrzevani_druz_clani_history`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT tabele `zaposleni`
--
ALTER TABLE `zaposleni`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Omejitve tabel za povzetek stanja
--

--
-- Omejitve za tabelo `vzdrzevani_druz_clani`
--
ALTER TABLE `vzdrzevani_druz_clani`
  ADD CONSTRAINT `vzdrzevani_druz_clani_ibfk_1` FOREIGN KEY (`zaposleni_id`) REFERENCES `zaposleni` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
