import { NextRequest, NextResponse } from 'next/server'
import { extract } from 'readability-extractor'
import { storeArticle } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Extract content using readability
    const article = await extract(url)
    
    if (!article.content) {
      return NextResponse.json({ error: 'Failed to extract content' }, { status: 400 })
    }

    // Store in Supabase with embedding
    await storeArticle(url, article.title || '', article.content)

    return NextResponse.json({ 
      success: true, 
      title: article.title,
      message: 'Article imported successfully' 
    })

  } catch (error) {
    console.error('Import API error:', error)
    return NextResponse.json(
      { error: 'Failed to import article' }, 
      { status: 500 }
    )
  }
}