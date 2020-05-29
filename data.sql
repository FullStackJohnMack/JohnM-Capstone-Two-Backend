CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username text UNIQUE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE NOT NULL,
    password text NOT NULL,
    is_admin boolean DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Can't use this because we need to hash these passwords first
-- INSERT INTO users (username, first_name, last_name, email, password, is_admin) VALUES ('01392338', 'John', 'Mack', 'mackspace@gmail.com', 'password', true);
-- INSERT INTO users (username, first_name, last_name, email, password) VALUES ('Tester 1', 'Tester', '1', 'tester1@test.com', 'password');
-- INSERT INTO users (username, first_name, last_name, email, password) VALUES ('Tester 2', 'Tester', '2', 'tester2@test.com', 'password');
-- INSERT INTO users (username, first_name, last_name, email, password) VALUES ('Tester 3', 'Tester', '3', 'tester3@test.com', 'password');

CREATE TABLE adventure_categories (
    category_id SERIAL PRIMARY KEY,
    category text NOT NULL
);

INSERT INTO adventure_categories (category) VALUES ('Hiking');
INSERT INTO adventure_categories (category) VALUES ('Wildlife');
INSERT INTO adventure_categories (category) VALUES ('Hunting');
INSERT INTO adventure_categories (category) VALUES ('Fishing');
INSERT INTO adventure_categories (category) VALUES ('Biking');
INSERT INTO adventure_categories (category) VALUES ('Off-Roading');
INSERT INTO adventure_categories (category) VALUES ('Winter');
INSERT INTO adventure_categories (category) VALUES ('Boating');
INSERT INTO adventure_categories (category) VALUES ('Watersports');

CREATE TABLE adventures (
    adventure_id SERIAL PRIMARY KEY,
    name text UNIQUE NOT NULL,
    description text NOT NULL,
    category_id integer NOT NULL REFERENCES adventure_categories (category_id),
    starting_location text NOT NULL,
    ending_location text,
    min_duration integer NOT NULL,
    max_duration integer,
    avg_duration integer,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ratings_adventures (
    ratings_adventures_id SERIAL PRIMARY KEY,
    users_user_id integer NOT NULL REFERENCES users (user_id),
    adventures_id integer NOT NULL REFERENCES adventures (adventure_id),
    rating integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON adventures
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

INSERT INTO adventures (name, description, category_id, starting_location, min_duration) VALUES ('Slippery Ann Elk Viewing Area','See up to 500 elk during September and October. The first and last two hours of daylight are the best times to see these elk.','2','47.616862,-108.567182', 120);
INSERT INTO adventures (name, description, category_id, starting_location, min_duration) VALUES ('Our Lake Hike','This popular 7 mile, moderate hike takes you by a waterfall and to a hidden alpine lake frequented by Mountain Goats.','1','47.846278,-112.782389','240');