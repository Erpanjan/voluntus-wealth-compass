
-- Create a function for fuzzy slug matching that tries multiple strategies
CREATE OR REPLACE FUNCTION public.get_article_by_slug_fuzzy(slug_param text)
 RETURNS TABLE(id uuid, title text, slug text, description text, content jsonb, category text, author_name text, image_url text, published_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone, authors jsonb, reports jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Strategy 1: Try exact match first
  RETURN QUERY
  SELECT 
    a.id, a.title, a.slug, a.description, a.content, a.category, a.author_name, a.image_url,
    a.published_at, a.created_at, a.updated_at,
    '[]'::jsonb AS authors,
    (
      SELECT jsonb_agg(json_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'file_url', r.file_url, 'created_at', r.created_at
      ))
      FROM public.reports r WHERE r.article_id = a.id
    ) AS reports
  FROM public.articles a
  WHERE a.slug = slug_param;
  
  -- If exact match found, return
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- Strategy 2: Try URL decoded version
  RETURN QUERY
  SELECT 
    a.id, a.title, a.slug, a.description, a.content, a.category, a.author_name, a.image_url,
    a.published_at, a.created_at, a.updated_at,
    '[]'::jsonb AS authors,
    (
      SELECT jsonb_agg(json_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'file_url', r.file_url, 'created_at', r.created_at
      ))
      FROM public.reports r WHERE r.article_id = a.id
    ) AS reports
  FROM public.articles a
  WHERE a.slug = replace(replace(slug_param, '%3F', '?'), '%21', '!');
  
  -- If URL decoded match found, return
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- Strategy 3: Try pattern matching (remove special characters from both sides)
  RETURN QUERY
  SELECT 
    a.id, a.title, a.slug, a.description, a.content, a.category, a.author_name, a.image_url,
    a.published_at, a.created_at, a.updated_at,
    '[]'::jsonb AS authors,
    (
      SELECT jsonb_agg(json_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'file_url', r.file_url, 'created_at', r.created_at
      ))
      FROM public.reports r WHERE r.article_id = a.id
    ) AS reports
  FROM public.articles a
  WHERE regexp_replace(a.slug, '[^a-zA-Z0-9\-]', '', 'g') = regexp_replace(slug_param, '[^a-zA-Z0-9\-]', '', 'g');
  
  -- If pattern match found, return
  IF FOUND THEN
    RETURN;
  END IF;
  
  -- Strategy 4: Fallback to LIKE pattern matching
  RETURN QUERY
  SELECT 
    a.id, a.title, a.slug, a.description, a.content, a.category, a.author_name, a.image_url,
    a.published_at, a.created_at, a.updated_at,
    '[]'::jsonb AS authors,
    (
      SELECT jsonb_agg(json_build_object(
        'id', r.id, 'title', r.title, 'description', r.description,
        'file_url', r.file_url, 'created_at', r.created_at
      ))
      FROM public.reports r WHERE r.article_id = a.id
    ) AS reports
  FROM public.articles a
  WHERE a.slug LIKE '%' || slug_param || '%' OR slug_param LIKE '%' || a.slug || '%'
  LIMIT 1;
  
END;
$function$
