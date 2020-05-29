--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public; Owner: johnmack
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_set_timestamp() OWNER TO johnmack;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adventure_categories; Type: TABLE; Schema: public; Owner: johnmack
--

CREATE TABLE public.adventure_categories (
    category_id integer NOT NULL,
    category text NOT NULL
);


ALTER TABLE public.adventure_categories OWNER TO johnmack;

--
-- Name: adventure_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: johnmack
--

CREATE SEQUENCE public.adventure_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adventure_categories_category_id_seq OWNER TO johnmack;

--
-- Name: adventure_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: johnmack
--

ALTER SEQUENCE public.adventure_categories_category_id_seq OWNED BY public.adventure_categories.category_id;


--
-- Name: adventures; Type: TABLE; Schema: public; Owner: johnmack
--

CREATE TABLE public.adventures (
    adventure_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category_id integer NOT NULL,
    starting_location text NOT NULL,
    ending_location text,
    min_duration integer NOT NULL,
    max_duration integer,
    avg_duration integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.adventures OWNER TO johnmack;

--
-- Name: adventures_adventure_id_seq; Type: SEQUENCE; Schema: public; Owner: johnmack
--

CREATE SEQUENCE public.adventures_adventure_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adventures_adventure_id_seq OWNER TO johnmack;

--
-- Name: adventures_adventure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: johnmack
--

ALTER SEQUENCE public.adventures_adventure_id_seq OWNED BY public.adventures.adventure_id;


--
-- Name: ratings_adventures; Type: TABLE; Schema: public; Owner: johnmack
--

CREATE TABLE public.ratings_adventures (
    ratings_adventures_id integer NOT NULL,
    users_user_id integer NOT NULL,
    adventures_id integer NOT NULL,
    rating integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.ratings_adventures OWNER TO johnmack;

--
-- Name: ratings_adventures_ratings_adventures_id_seq; Type: SEQUENCE; Schema: public; Owner: johnmack
--

CREATE SEQUENCE public.ratings_adventures_ratings_adventures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ratings_adventures_ratings_adventures_id_seq OWNER TO johnmack;

--
-- Name: ratings_adventures_ratings_adventures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: johnmack
--

ALTER SEQUENCE public.ratings_adventures_ratings_adventures_id_seq OWNED BY public.ratings_adventures.ratings_adventures_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: johnmack
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO johnmack;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: johnmack
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO johnmack;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: johnmack
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: adventure_categories category_id; Type: DEFAULT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.adventure_categories ALTER COLUMN category_id SET DEFAULT nextval('public.adventure_categories_category_id_seq'::regclass);


--
-- Name: adventures adventure_id; Type: DEFAULT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.adventures ALTER COLUMN adventure_id SET DEFAULT nextval('public.adventures_adventure_id_seq'::regclass);


--
-- Name: ratings_adventures ratings_adventures_id; Type: DEFAULT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.ratings_adventures ALTER COLUMN ratings_adventures_id SET DEFAULT nextval('public.ratings_adventures_ratings_adventures_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: adventure_categories; Type: TABLE DATA; Schema: public; Owner: johnmack
--

COPY public.adventure_categories (category_id, category) FROM stdin;
1	Hiking
2	Wildlife
3	Hunting
4	Fishing
5	Biking
6	Off-Roading
7	Winter
8	Boating
9	Watersports
\.


--
-- Data for Name: adventures; Type: TABLE DATA; Schema: public; Owner: johnmack
--

COPY public.adventures (adventure_id, name, description, category_id, starting_location, ending_location, min_duration, max_duration, avg_duration, created_at, updated_at) FROM stdin;
5	Slippery Ann Elk Viewing Area	See up to 500 elk during September and October. The first and last two hours of daylight are the best times to see these elk.	2	47.616862,-108.567182	\N	120	\N	\N	2020-05-25 21:26:57.94942-06	2020-05-25 21:26:57.94942-06
6	Our Lake Hike	This popular 7 mile, moderate hike takes you by a waterfall and to a hidden alpine lake frequented by Mountain Goats.	1	47.846278,-112.782389	\N	240	\N	\N	2020-05-25 21:26:59.393223-06	2020-05-25 21:26:59.393223-06
7	Cataract Falls	This easy, short hike (about .5 miles out and back) to a beautiful waterfall is quick and refreshing. Cataract Falls is a popular ice climbing spot in the winter. There is a small creek crossing (about 10-12' across) which can be 6" deep or more during wet seasons.	1	47.324134, -112.602843	\N	45	\N	\N	2020-05-28 11:54:54.748652-06	2020-05-28 11:54:54.748652-06
21	Willow Creek Falls	This moderate, 4-ish mile hike takes you through rocky mountainsides, waterfalls, willow groves, beautiful valleys, and more. There might be creek crossing at the start depending on the time of year and the road getting to the trailhead can be rough.	1	47.461961, -112.727218	\N	180	\N	\N	2020-05-28 12:13:58.54888-06	2020-05-28 12:14:28.930985-06
\.


--
-- Data for Name: ratings_adventures; Type: TABLE DATA; Schema: public; Owner: johnmack
--

COPY public.ratings_adventures (ratings_adventures_id, users_user_id, adventures_id, rating, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: johnmack
--

COPY public.users (user_id, username, first_name, last_name, email, password, is_admin, created_at, updated_at) FROM stdin;
5	01392338	John	Mack	mackspace@gmail.com	$2b$15$meJF9i63SbEpViUkiMQ.b.MoE5PcGxk3agLbt6/hFV.bMhLvzWGhC	t	2020-05-28 11:32:24.3614-06	2020-05-28 11:33:22.918882-06
\.


--
-- Name: adventure_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: johnmack
--

SELECT pg_catalog.setval('public.adventure_categories_category_id_seq', 9, true);


--
-- Name: adventures_adventure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: johnmack
--

SELECT pg_catalog.setval('public.adventures_adventure_id_seq', 21, true);


--
-- Name: ratings_adventures_ratings_adventures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: johnmack
--

SELECT pg_catalog.setval('public.ratings_adventures_ratings_adventures_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: johnmack
--

SELECT pg_catalog.setval('public.users_user_id_seq', 5, true);


--
-- Name: adventure_categories adventure_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.adventure_categories
    ADD CONSTRAINT adventure_categories_pkey PRIMARY KEY (category_id);


--
-- Name: adventures adventures_name_key; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_name_key UNIQUE (name);


--
-- Name: adventures adventures_pkey; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_pkey PRIMARY KEY (adventure_id);


--
-- Name: ratings_adventures ratings_adventures_pkey; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.ratings_adventures
    ADD CONSTRAINT ratings_adventures_pkey PRIMARY KEY (ratings_adventures_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: adventures set_timestamp; Type: TRIGGER; Schema: public; Owner: johnmack
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.adventures FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: users set_timestamp; Type: TRIGGER; Schema: public; Owner: johnmack
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_timestamp();


--
-- Name: adventures adventures_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: johnmack
--

ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.adventure_categories(category_id);


--
-- PostgreSQL database dump complete
--

