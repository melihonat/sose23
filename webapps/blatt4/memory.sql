-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 05. Aug 2023 um 20:05
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `memory`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `karte`
--

CREATE TABLE `karte` (
  `id` int(11) NOT NULL,
  `bild` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `karte`
--

INSERT INTO `karte` (`id`, `bild`) VALUES
(2, 0x4b617274656e62696c6465722f342e706e67),
(3, 0x4b617274656e62696c6465722f372e706e67),
(4, 0x4b617274656e62696c6465722f382e706e67),
(5, 0x4b617274656e62696c6465722f312e706e67),
(6, 0x4b617274656e62696c6465722f322e706e67),
(7, 0x4b617274656e62696c6465722f332e706e67),
(8, 0x4b617274656e62696c6465722f352e706e67),
(9, 0x4b617274656e62696c6465722f362e706e67),
(10, 0x4b617274656e62696c6465722f392e706e67),
(11, 0x4b617274656e62696c6465722f31302e706e67),
(12, 0x4b617274656e62696c6465722f31312e706e67),
(13, 0x4b617274656e62696c6465722f31322e706e67),
(14, 0x4b617274656e62696c6465722f31332e706e67),
(15, 0x4b617274656e62696c6465722f31342e706e67),
(16, 0x4b617274656e62696c6465722f31352e706e67),
(17, 0x4b617274656e62696c6465722f31362e706e67);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `level`
--

CREATE TABLE `level` (
  `level` int(11) NOT NULL,
  `anzahl_karten` int(11) DEFAULT NULL,
  `spielZeit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `level`
--

INSERT INTO `level` (`level`, `anzahl_karten`, `spielZeit`) VALUES
(1, 8, 120),
(2, 8, 90),
(3, 8, 60),
(4, 16, 120),
(5, 16, 90),
(6, 16, 60);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `spiel`
--

CREATE TABLE `spiel` (
  `einzeln` tinyint(1) DEFAULT NULL,
  `spieltan` datetime DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `dauer` int(11) DEFAULT NULL,
  `verlauf` varchar(50) DEFAULT NULL,
  `gewinner` int(11) DEFAULT NULL,
  `initiator` int(11) DEFAULT NULL,
  `mitspieler` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `spieler`
--

CREATE TABLE `spieler` (
  `id` int(11) NOT NULL,
  `spielname` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `passwort` varchar(20) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `xp` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `spieler`
--

INSERT INTO `spieler` (`id`, `spielname`, `email`, `passwort`, `level`, `xp`) VALUES
(1, 'Admin Admin', 'admin@memory.de', '12345Aa', 0, 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `karte`
--
ALTER TABLE `karte`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `level`
--
ALTER TABLE `level`
  ADD PRIMARY KEY (`level`);

--
-- Indizes für die Tabelle `spiel`
--
ALTER TABLE `spiel`
  ADD KEY `gewinner` (`gewinner`),
  ADD KEY `initiator` (`initiator`),
  ADD KEY `mitspieler` (`mitspieler`);

--
-- Indizes für die Tabelle `spieler`
--
ALTER TABLE `spieler`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `karte`
--
ALTER TABLE `karte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT für Tabelle `spieler`
--
ALTER TABLE `spieler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `spiel`
--
ALTER TABLE `spiel`
  ADD CONSTRAINT `spiel_ibfk_1` FOREIGN KEY (`gewinner`) REFERENCES `spieler` (`id`),
  ADD CONSTRAINT `spiel_ibfk_2` FOREIGN KEY (`initiator`) REFERENCES `spieler` (`id`),
  ADD CONSTRAINT `spiel_ibfk_3` FOREIGN KEY (`mitspieler`) REFERENCES `spieler` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
