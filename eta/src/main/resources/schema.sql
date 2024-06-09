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

CREATE TABLE `token` (
    `user_id` int NOT NULL,
    `expo_push_token` varchar(255) NOT NULL,
    PRIMARY KEY (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `signup_info` (
    `email` varchar(100) NOT NULL,
    `code` varchar(6) NOT NULL,
    `code_expires` datetime NOT NULL,
    `is_verified` bool NOT NULL,
    `signup_token` varchar(20) NULL,
    PRIMARY KEY (`email`)
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
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE `sector` (
    `sector_id` varchar(3) NOT NULL,
    `sector_name` varchar(40) NOT NULL,
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
    `dart_code` varchar(8),
    `sector_id` varchar(3),
    PRIMARY KEY (`ticker`),
    FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`)
);

CREATE TABLE `portfolio_ticker` (
    `pf_id` int NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `number` int NOT NULL,
    `average_price` float NOT NULL,
    `init_proportion` float,
    `current_proportion` float,
    PRIMARY KEY (`pf_id`, `ticker`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`) ON DELETE CASCADE,
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
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`) ON DELETE CASCADE
);

CREATE TABLE `rebalancing` (
    `rn_id` int NOT NULL AUTO_INCREMENT,
    `created_date` datetime NOT NULL,
    `pf_id` int NOT NULL,
    PRIMARY KEY (`rn_id`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`) ON DELETE CASCADE
);

CREATE TABLE `portfolio_sector` (
    `pf_id` int NOT NULL,
    `sector_id` varchar(3) NOT NULL,
    PRIMARY KEY (`pf_id`, `sector_id`),
    FOREIGN KEY (`pf_id`) REFERENCES `portfolio` (`pf_id`) ON DELETE CASCADE,
    FOREIGN KEY (`sector_id`) REFERENCES `sector` (`sector_id`)
);

CREATE TABLE `rebalancing_ticker` (
    `rn_id` int NOT NULL,
    `is_buy` bool NOT NULL,
    `number` int NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `price` float NOT NULL,
    PRIMARY KEY (`rn_id`, `ticker`),
    FOREIGN KEY (`rn_id`) REFERENCES `rebalancing` (`rn_id`) ON DELETE CASCADE,
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `value` (
    `score_date` date NOT NULL,
    `ticker` varchar(8) NOT NULL,
    `sector_name` varchar(255) NULL,
    `ROE` float NULL,
    `ROA` float NULL,
    `GPA` float NULL,
    `GM` float NULL,
    `OP` float NULL,
    `CFROA` float NULL,
    `EV/sales` float NULL,
    `PER` float NULL,
    `PBR` float NULL,
    `PCR` float NULL,
    `PSR` float NULL,
    `DPS` float NULL,
    `12M_ret` float NULL,
    `K_ratio` float NULL,
    `quality` float NULL,
    `value` float NULL,
    `momentum` float NULL,
    `score` float NULL,
    `ranking` int NULL,
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

CREATE TABLE `news` (
    `date` datetime NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `summary` text NOT NULL,
    PRIMARY KEY (`ticker`, `date`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `financial_statement` (
    `date` datetime NOT NULL,
    `ticker` varchar(20) NOT NULL,
    `account` varchar(50) NULL,
    `value` int NULL,
    `period` varchar(1) NULL,
    PRIMARY KEY (`ticker`, `date`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `ticker_search` (
    `ticker` varchar(20) NOT NULL,
    `decomposed_name` varchar(150),
    PRIMARY KEY (`ticker`),
    FOREIGN KEY (`ticker`) REFERENCES `ticker` (`ticker`)
);

CREATE TABLE `question` (
    `question_id`	int	NOT NULL AUTO_INCREMENT,
    `title`	varchar(100)	NOT NULL,
    `content`	text	NOT NULL,
    `answer`	text	NULL,
    `created_date`	datetime	NOT NULL,
    `answered_date`	datetime	NULL,
    `user_id`	int	NOT NULL,
    PRIMARY KEY (`question_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
);

CREATE TABLE `statistic` (
     `date` datetime NOT NULL,
     `total_user` int NOT NULL,
     `total_portfolio` int NOT NULL,
     PRIMARY KEY (`date`)
);