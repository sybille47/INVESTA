--
-- PostgreSQL database dump
--

\restrict YMgHRRLQaEzmPbT2bQqcUsXVufog6ZdPukCrykds2N9kz4YiEDxTsbPxRHsH4IB

-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.6 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: country_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.country_enum AS ENUM (
    'Germany',
    'France',
    'UK',
    'Switzerland',
    'USA',
    'Other'
);


ALTER TYPE public.country_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'Pending',
    'Confirmed'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: order_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_type_enum AS ENUM (
    'Subscription',
    'Redemption'
);


ALTER TYPE public.order_type_enum OWNER TO postgres;

--
-- Name: generate_business_days(date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_business_days(start_date date, end_date date) RETURNS TABLE(business_date date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT d::DATE
    FROM generate_series(start_date, end_date, '1 day'::interval) d
    WHERE EXTRACT(DOW FROM d) BETWEEN 1 AND 5; -- Monday(1) to Friday(5)
END;
$$;


ALTER FUNCTION public.generate_business_days(start_date date, end_date date) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: funds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.funds (
    fund_id integer NOT NULL,
    name text NOT NULL,
    fund_type text,
    min_init_amt numeric(12,2),
    trade_rule text,
    value_rule text,
    ccy text,
    isin character varying(12),
    value_calc integer,
    share_class character varying(1)
);


ALTER TABLE public.funds OWNER TO postgres;

--
-- Name: funds_fund_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.funds_fund_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.funds_fund_id_seq OWNER TO postgres;

--
-- Name: funds_fund_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.funds_fund_id_seq OWNED BY public.funds.fund_id;


--
-- Name: nav; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nav (
    isin character varying(12) NOT NULL,
    trade_date date NOT NULL,
    nav numeric(12,4) NOT NULL
);


ALTER TABLE public.nav OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    isin character varying(12),
    order_type text NOT NULL,
    trade_date date,
    value_date date,
    units numeric(12,4),
    amount numeric(12,2),
    status text DEFAULT 'Pending'::public.order_status_enum,
    account_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profile (
    account_id integer NOT NULL,
    last_name text NOT NULL,
    first_name text NOT NULL,
    street text,
    house_no numeric,
    zip_code character varying(20) NOT NULL,
    town character varying(80) NOT NULL,
    country public.country_enum NOT NULL,
    email_address text NOT NULL,
    iban character varying(34),
    holder character varying(80),
    bank_name character varying(255),
    bic character varying(11)
);


ALTER TABLE public.profile OWNER TO postgres;

--
-- Name: profile_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profile_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profile_account_id_seq OWNER TO postgres;

--
-- Name: profile_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profile_account_id_seq OWNED BY public.profile.account_id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    account_id integer NOT NULL,
    email_address character varying(80),
    first_name text,
    last_name text,
    street character varying(80),
    house_no character varying(80),
    zip_code character varying(20),
    town character varying(80),
    country character varying(80),
    iban character varying(34),
    holder character varying(80),
    bank_name character varying(255),
    bic character varying(11)
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    account_id integer NOT NULL,
    auth0_user_id character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_account_id_seq OWNER TO postgres;

--
-- Name: users_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_account_id_seq OWNED BY public.users.account_id;


--
-- Name: funds fund_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funds ALTER COLUMN fund_id SET DEFAULT nextval('public.funds_fund_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: profile account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile ALTER COLUMN account_id SET DEFAULT nextval('public.profile_account_id_seq'::regclass);


--
-- Name: users account_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN account_id SET DEFAULT nextval('public.users_account_id_seq'::regclass);


--
-- Name: funds funds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.funds
    ADD CONSTRAINT funds_pkey PRIMARY KEY (fund_id);


--
-- Name: nav nav_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nav
    ADD CONSTRAINT nav_pkey PRIMARY KEY (isin, trade_date);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: profile profile_email_address_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_email_address_key UNIQUE (email_address);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (account_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (account_id);


--
-- Name: users users_auth0_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth0_user_id_key UNIQUE (auth0_user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (account_id);


--
-- Name: orders orders_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.profiles(account_id);


--
-- PostgreSQL database dump complete
--

\unrestrict YMgHRRLQaEzmPbT2bQqcUsXVufog6ZdPukCrykds2N9kz4YiEDxTsbPxRHsH4IB

