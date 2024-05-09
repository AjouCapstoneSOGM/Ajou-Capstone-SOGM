CREATE TABLE `user` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL UNIQUE,
    `is_verified` bool NULL,
    `password` varchar(255) NULL,
    `name` varchar(30) NOT NULL,
    `role` varchar(30) NOT NULL,
    `created_date` datetime,
    `modified_date` datetime NULL,
    `enabled` bool NOT NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `portfolio` (
    `pf_id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100),
    `created_date` datetime,
    `country` varchar(30) NOT NULL,
    `is_auto` bool NOT NULL,
    `init_asset` float NOT NULL,
    `init_cash` float NOT NULL,
    `current_cash` float NOT NULL,
    `risk_value` int,
    `user_id` int NOT NULL,
    PRIMARY KEY (`pf_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `sector` (
    `sector_id` varchar(3) NOT NULL,
    `name` varchar(40) NOT NULL,
    PRIMARY KEY (`sector_id`)
);

CREATE TABLE `ticker` (
    `ticker` varchar(20) NOT NULL,
    `name` varchar(50),
    `market_cap` float,
    `dividend` int,
    `exchange` varchar(30),
    `updated_date` datetime NOT NULL,
    `equity` varchar(10),
    `sector_id` varchar(3),
    PRIMARY KEY (`ticker`),
    FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`)
);

CREATE TABLE `portfolio_ticker` (
    `pf_id` int NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `number` int NOT NULL,
    `average_price` float NOT NULL,
    `init_proportion` float NOT NULL,
    `current_proportion` float NOT NULL,
    PRIMARY KEY (`pf_id`, `ticker`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `portfolio_record` (
    `rec_id` int NOT NULL AUTO_INCREMENT,
    `record_date` datetime NOT NULL,
    `is_buy` bool NOT NULL,
    `number` int NOT NULL,
    `price` float NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `pf_id` int NOT NULL,
    PRIMARY KEY (`rec_id`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`)
);

CREATE TABLE `rebalancing` (
    `rn_id` int NOT NULL AUTO_INCREMENT,
    `pf_id` int NOT NULL,
    PRIMARY KEY (`rn_id`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`)
);

CREATE TABLE `portfolio_sector` (
    `pf_id` int NOT NULL,
    `sector_id` varchar(3) NOT NULL,
    PRIMARY KEY (`pf_id`, `sector_id`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`),
    FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`)
);

CREATE TABLE `rebalancing_ticker` (
    `rn_id` int NOT NULL,
    `is_buy` bool NOT NULL,
    `number` int NOT NULL,
    `ticker` varchar(20) NOT NULL,
    PRIMARY KEY (`rn_id`, `ticker`),
    FOREIGN KEY (`rn_id`) REFERENCES `rebalancing` (`rn_id`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `value` (
    `score_date` datetime NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `eps` float NULL,
    `bps` float NULL,
    `dps` float NULL,
    `ev_ebitda` float NULL,
    `pbr` float NULL,
    `pcr` float NULL,
    `per` float NULL,
    `psr` float NULL,
    `roe` float NULL,
    `roa` float NULL,
    `gpa` float NULL,
    `op` float NULL,
    `cfo` float NULL,
    `12m_ret` float NULL,
    `k_ratio` float NULL,
    `quality` float NULL,
    `value` float NULL,
    `momentum` float NULL,
    `score` float NULL,
    `rank` int NULL,
    PRIMARY KEY (`ticker`, `score_date`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `price` (
    `date` datetime NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `close` double,
    PRIMARY KEY (`ticker`, `date`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `financial_statement` (
    `date` datetime NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `account` varchar(30) NULL,
    `value` float NULL,
    `period` varchar(1) NULL,
    PRIMARY KEY (`ticker`, `date`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);