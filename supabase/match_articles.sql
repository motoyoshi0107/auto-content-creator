-- Create a function to match articles by embedding similarity
create or replace function match_articles (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  url text,
  title text,
  text text,
  embedding vector(768),
  created_at timestamp with time zone,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    articles.id,
    articles.url,
    articles.title,
    articles.text,
    articles.embedding,
    articles.created_at,
    1 - (articles.embedding <=> query_embedding) as similarity
  from articles
  where 1 - (articles.embedding <=> query_embedding) > match_threshold
  order by articles.embedding <=> query_embedding
  limit match_count;
end;
$$;