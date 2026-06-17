-- Run this in the Supabase SQL Editor.
-- Adds support for MULTIPLE photos per collection (used by the homepage
-- hero slideshow and the "Our Collections" slideshow cards).

create table if not exists collection_gallery (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,          -- collection name (matches collections in src/data/products.ts)
  image_url   text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists collection_gallery_name_idx on collection_gallery (name);

-- Carry over any single images previously uploaded via the old admin tool
-- so nothing already set is lost. Safe to run more than once.
insert into collection_gallery (name, image_url, sort_order)
select name, image_url, 0
from collection_images
where image_url is not null and image_url <> ''
  and not exists (
    select 1 from collection_gallery g
    where g.name = collection_images.name and g.image_url = collection_images.image_url
  );
