--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 16.9 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: vod_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vod_comments (
    id integer NOT NULL,
    vod_id uuid NOT NULL,
    timestamp_seconds double precision,
    comments text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: vod_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vod_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vod_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vod_comments_id_seq OWNED BY public.vod_comments.id;


--
-- Name: vods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vods (
    url text NOT NULL,
    user_id text,
    date_uploaded date,
    s3_key text,
    vod_id uuid DEFAULT gen_random_uuid()
);


--
-- Name: vods_url_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vods_url_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vods_url_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vods_url_seq OWNED BY public.vods.url;


--
-- Name: vod_comments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vod_comments ALTER COLUMN id SET DEFAULT nextval('public.vod_comments_id_seq'::regclass);


--
-- Name: vods url; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vods ALTER COLUMN url SET DEFAULT nextval('public.vods_url_seq'::regclass);


--
-- Data for Name: vod_comments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.vod_comments (id, vod_id, timestamp_seconds, comments, created_at) VALUES
(1, '038ce48d-dadd-4179-942e-8c8a7df2bf8d', NULL, 'THIS IS IMBA', '2025-06-16 18:31:16.761414'),
(2, '038ce48d-dadd-4179-942e-8c8a7df2bf8d', 0, 'This guy sucks', '2025-07-01 20:27:59.109'),
(3, 'b984fa61-6d9e-46e0-8373-b665da2173d2', 0, 'This guy sucks LOL', '2025-07-02 00:33:58.845'),
(4, 'b984fa61-6d9e-46e0-8373-b665da2173d2', 0, 'THis guy sucks lol', '2025-07-02 00:54:07.441');



--
-- Data for Name: vods; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.vods (url, user_id, date_uploaded, s3_key, vod_id) VALUES
('https://vod-storage-proj.s3.us-east-2.amazonaws.com/vods/compressed-e2bc3465-2f91-470f-ac3d-b83b926f641c.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYLKIYXEZSAWWUR3J%2F20250616%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250616T182742Z&X-Amz-Expires=216000&X-Amz-Signature=53e6f98a826bafb6b7820228b0a256a545091223b963189442dcccb5da886128&X-Amz-SignedHeaders=host', 'XtwOn7UquVQlk13htGYKewEHLOp1', '2025-06-16', NULL, '038ce48d-dadd-4179-942e-8c8a7df2bf8d'),

('https://vod-storage-proj.s3.us-east-2.amazonaws.com/vods/compressed-86a2cfa7-6c86-49df-b9ba-3680d4c81478.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYLKIYXEZSAWWUR3J%2F20250616%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250616T184007Z&X-Amz-Expires=216000&X-Amz-Signature=6d90aaef0f6cdf57f4f2585ad18620ebea85514e7b41c8abb34f9645cd3b7ec2&X-Amz-SignedHeaders=host', 'XtwOn7UquVQlk13htGYKewEHLOp1', '2025-06-16', NULL, 'f41a71be-0b3e-4d04-90e4-fdd66c31923b'),

('https://vod-storage-proj.s3.us-east-2.amazonaws.com/vods/compressed-917c292c-8088-46c9-a11a-646e4608e28c.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYLKIYXEZSAWWUR3J%2F20250616%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250616T184658Z&X-Amz-Expires=216000&X-Amz-Signature=549f08253b19845aed84f9ad6492bde57ad11765025b3489648085f4390fff9d&X-Amz-SignedHeaders=host', 'XtwOn7UquVQlk13htGYKewEHLOp1', '2025-06-16', NULL, 'c6c46266-7539-430e-aa59-4480ff4047b4'),

('https://vod-storage-proj.s3.us-east-2.amazonaws.com/vods/compressed-450d484d-1dcf-43fc-8ccc-dd913a2ec3ea.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYLKIYXEZSAWWUR3J%2F20250626%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250626T195018Z&X-Amz-Expires=216000&X-Amz-Signature=640dc2b015859a8c5e42baba7b8996a733f65a060630ef86360c78f864caaa21&X-Amz-SignedHeaders=host', 'XtwOn7UquVQlk13htGYKewEHLOp1', '2025-06-26', NULL, '2b537d8b-66f2-4fbf-a165-2d461533ef92'),

('https://vod-storage-proj.s3.us-east-2.amazonaws.com/vods/compressed-fde3e87b-9ab8-4d42-8e46-cb2b0483b92d.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYLKIYXEZSAWWUR3J%2F20250702%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20250702T003339Z&X-Amz-Expires=216000&X-Amz-Signature=8362d45f4e0de4f9d63206adada919e6cca4f8f15225d52456f67ed3e05b3303&X-Amz-SignedHeaders=host', 'XtwOn7UquVQlk13htGYKewEHLOp1', '2025-07-02', NULL, 'b984fa61-6d9e-46e0-8373-b665da2173d2');



--
-- Name: vod_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vod_comments_id_seq', 4, true);


--
-- Name: vods_url_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.vods_url_seq', 1, true);


--
-- Name: vod_comments vod_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vod_comments
    ADD CONSTRAINT vod_comments_pkey PRIMARY KEY (id);


--
-- Name: vods vods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vods
    ADD CONSTRAINT vods_pkey PRIMARY KEY (url);


--
-- PostgreSQL database dump complete
--

