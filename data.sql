CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adventures (
    adventure_id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    starting_location text NOT NULL,
    ending_location text NOT NULL,
    min_duration integer NOT NULL,
    max_duration integer,
    avg_duration integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings_adventures (
    ratings_adventures_id SERIAL PRIMARY KEY,
    users_user_id integer REFERENCES users (user_id),
    adventures_id integer REFERENCES adventures (adventure_id),
    rating integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);