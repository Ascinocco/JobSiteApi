CREATE TABLE users(
    "id"                    SERIAL PRIMARY KEY,
    "blacklist"             BOOLEAN NOT NULL DEFAULT FALSE,
    "notifyMeIfJobsInRange" BOOLEAN NOT NULL DEFAULT FALSE,
    "maxDistance"           INTEGER NOT NULL DEFAULT 50,
    "distanceUnit"          VARCHAR (25) NOT NULL DEFAULT 'KILOMETRE',
    "firstName"             VARCHAR (80) NOT NULL,
    "lastName"              VARCHAR (80) NOT NULL,
    "email"                 VARCHAR UNIQUE NOT NULL,
    "isConsumer"            BOOLEAN NOT NULL DEFAULT TRUE,
    "isWorker"              BOOLEAN NOT NULL DEFAULT TRUE,
    "password"              VARCHAR NOT NULL,
    "age"                   INTEGER,
    "country"               VARCHAR,
    "street"                VARCHAR,
    "city"                  VARCHAR,
    "zipPostalCode"         VARCHAR,
    "createdOn"             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blacklisted_tokens(
    "id"              SERIAL PRIMARY KEY,
    "userId"          BIGINT REFERENCES users(id),
    "token"           VARCHAR NOT NULL,
    "createdOn"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs(
    "id"              SERIAL PRIMARY KEY,
    "consumerId"      BIGINT REFERENCES users(id),
    "workerId"        BIGINT,
    "allowWorkerToAddActionItems" BOOLEAN NOT NULL DEFAULT FALSE,
    "title"           VARCHAR NOT NULL,
    "description"     VARCHAR NOT NULL,
    "dueDate"         TIMESTAMP,
    "bid"             FLOAT,
    "status"          VARCHAR,
    "createdOn"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE action_items(
    "id"             SERIAL PRIMARY KEY,
    "order"          INTEGER NOT NULL,
    "jobId"          BIGINT REFERENCES jobs(id),
    "authorId"       BIGINT REFERENCES users(id),
    "checkedOffById" BIGINT REFERENCES users(id),
    "completed"      BOOLEAN NOT NULL DEFAULT FALSE,
    "text"           VARCHAR NOT NULL,
    "status"         VARCHAR,
    "createdOn"      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
