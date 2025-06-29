-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store articles with their content and embeddings
create table if not exists articles (
  id bigserial primary key,
  url text,
  title text,
  text text,
  embedding vector(768),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an index to be used for vector similarity search
create index if not exists articles_embedding_idx on articles 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);