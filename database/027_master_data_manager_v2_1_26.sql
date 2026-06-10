-- NONSTOP V2.1.26 – Master Data Manager Foundation
alter table public.clubs add column if not exists city_id bigint, add column if not exists is_active boolean default true;
alter table public.teams add column if not exists club_id bigint, add column if not exists city_id bigint, add column if not exists season_id bigint, add column if not exists category_id bigint, add column if not exists gender varchar(20), add column if not exists league_level varchar(20), add column if not exists is_active boolean default true;
alter table public.players add column if not exists team_id bigint, add column if not exists category_id bigint, add column if not exists city_id bigint, add column if not exists season_id bigint, add column if not exists gender varchar(20), add column if not exists jersey_number integer, add column if not exists birth_date date, add column if not exists is_active boolean default true;
create index if not exists idx_clubs_city_id on public.clubs(city_id);
create index if not exists idx_teams_club_id on public.teams(club_id);
create index if not exists idx_teams_city_season_category on public.teams(city_id, season_id, category_id);
create index if not exists idx_players_team_id on public.players(team_id);
