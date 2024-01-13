DROP DATABASE IF EXISTS tech_courses;

CREATE DATABASE tech_courses;

USE tech_courses;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE TABLE verify_tokens(
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expire_at DATE,
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);