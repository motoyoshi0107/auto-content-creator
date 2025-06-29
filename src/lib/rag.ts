import { supabase, Article } from './supabase'
import { createEmbedding } from './embeddings'

export interface SimilarArticle extends Article {
  similarity: number
}

export async function findSimilarArticles(query: string, limit: number = 5): Promise<SimilarArticle[]> {
  try {
    const queryEmbedding = await createEmbedding(query)
    
    const { data, error } = await supabase.rpc('match_articles', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: limit
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('RAG search error:', error)
    return []
  }
}

export async function storeArticle(url: string, title: string, text: string): Promise<void> {
  try {
    const embedding = await createEmbedding(text)
    
    const { error } = await supabase
      .from('articles')
      .insert({
        url,
        title,
        text,
        embedding
      })

    if (error) {
      console.error('Store article error:', error)
      throw new Error('Failed to store article')
    }
  } catch (error) {
    console.error('Store article error:', error)
    throw error
  }
}