CREATE TABLE `user` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL UNIQUE,
    `is_verified` bool NULL,
    `password` varchar(255) NULL,
    `name` varchar(30) NOT NULL,
    `role` varchar(30) NOT NULL,
    `created_date` datetime NOT NULL,
    `modified_date` datetime NULL,
    `enabled` bool NOT NULL,
    PRIMARY KEY (`user_id`)
);

CREATE TABLE `portfolio` (
    `pf_id` int NOT NULL AUTO_INCREMENT,
    `created_date` datetime NOT NULL,
    `country` varchar(30) NOT NULL,
    `is_auto` bool NOT NULL,
    `init_asset` float NOT NULL,
    `current_asset` float NOT NULL,
    `init_cash` float NOT NULL,
    `current_cash` float NOT NULL,
    `rate_return` float NOT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`pf_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `sector` (
    `sector_id` int NOT NULL,
    `name` varchar(40) NOT NULL,
    PRIMARY KEY (`sector_id`)
);

CREATE TABLE `ticker` (
    `ticker` varchar(20) NOT NULL,
    `name` varchar(50) NOT NULL,
    `country` varchar(30) NOT NULL,
    `exchange` varchar(30) NOT NULL,
    `market cap` float NOT NULL,
    `updated_date` datetime NOT NULL,
    `eps` float NOT NULL,
    `forward_eps` float NOT NULL,
    `bps` float NOT NULL,
    `dps` float NOT NULL,
    `sector_id` int NOT NULL,
    PRIMARY KEY (`ticker`),
    FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`)
);

CREATE TABLE `portfolio_ticker` (
    `pf_id` int NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `number` int NOT NULL,
    `buying_price` float NOT NULL,
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
    `created_date` datetime NOT NULL,
    `expired_date` datetime NOT NULL,
    `pf_id` int NOT NULL,
    PRIMARY KEY (`rn_id`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`)
);

CREATE TABLE `portfolio_sector` (
    `pf_id` int NOT NULL,
    `sector_id` int NOT NULL,
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

CREATE TABLE `ticker_invest` (
    `ticker` varchar(20) NOT NULL,
    `quality` float NOT NULL,
    `value` float NOT NULL,
    `momentum` float NOT NULL,
    `qvm` float NOT NULL,
    `updated_date` datetime NOT NULL,
    PRIMARY KEY (`ticker`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);