CREATE TABLE users(
    "id"              SERIAL PRIMARY KEY,
    "firstName"       VARCHAR (80) NOT NULL,
    "lastName"        VARCHAR (80) NOT NULL,
    "email"           VARCHAR UNIQUE NOT NULL,
    "isConsumer"      BOOLEAN NOT NULL DEFAULT TRUE,
    "isWorker"        BOOLEAN NOT NULL DEFAULT TRUE,
    "password"        VARCHAR NOT NULL,
    "age"             INTEGER,
    "country"         VARCHAR,
    "street"          VARCHAR,
    "city"            VARCHAR,
    "zipPostalCode"   VARCHAR,
    "createdOn"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs(
    "id"              SERIAL PRIMARY KEY,
    "consumerId"      BIGINT REFERENCES users(id),
    "workerId"        BIGINT,
    "title"           VARCHAR NOT NULL,
    "description"     VARCHAR NOT NULL,
    "dueDate"         TIMESTAMP,
    "bid"             FLOAT,
    "status"          VARCHAR
);
