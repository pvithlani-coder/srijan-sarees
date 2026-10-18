-- Adds video support to product media.
-- Run once in Supabase Dashboard -> SQL Editor.
--
-- saree_photos already stores a product's extra images (photo_id, product_id,
-- photo_url, sort_order). Videos reuse the same table so ordering, deletion and
-- the catalog query keep working. Existing rows become media_type = 'image'.

alter table public.saree_photos
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image', 'video')),
  add column if not exists poster_url text;   -- still frame shown before a video plays

-- Storage: videos are uploaded to the same 'saree-images' bucket. In
-- Dashboard -> Storage -> saree-images -> Edit bucket, make sure that
--   * "Allowed MIME types" is empty, or includes video/mp4, video/webm, video/quicktime
--   * "File size limit" is at least 50 MB (the admin page enforces a 50 MB cap).
-- Supabase's free plan caps any single file at 50 MB globally.
