--
-- PostgreSQL database dump
--

\restrict QcktIJqkdS33YXWBGXPjAEmcVJcne7Q5eRJYCQtfAAY6HRiVdTtYHX8Mpq9wtc9

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
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (account_id, email_address, first_name, last_name, street, house_no, zip_code, town, country, iban, holder, bank_name, bic) FROM stdin;
23	myanac47@gmail.com	Sybille	Zehringer	Merianstr.	12	54292	Trier	Germany	lu 162716827617	\N	zquiziuziz	zquwziuq
24	test@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
25	navbartest@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
26	pktest@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
27	test123@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
28	user@mail.com	User	Name	Street	27	52918	City	Germany	DE178291782799019288	\N	Bank Name	BIC
\.


--
-- PostgreSQL database dump complete
--

\unrestrict QcktIJqkdS33YXWBGXPjAEmcVJcne7Q5eRJYCQtfAAY6HRiVdTtYHX8Mpq9wtc9

