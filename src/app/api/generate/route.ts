import { NextRequest, NextResponse } from 'next/server'
import { findSimilarArticles } from '@/lib/rag'
import { generateContent, factCheck } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { draft, format } = await request.json()

    if (!draft || !format) {
      return NextResponse.json({ error: 'Draft and format are required' }, { status: 400 })
    }

    // Step 1: RAG - Find similar articles
    const similarArticles = await findSimilarArticles(draft, 3)
    const context = similarArticles
      .map(article => `タイトル: ${article.title}\n内容: ${article.text?.substring(0, 500)}...`)
      .join('\n\n')

    // Step 2: Generate content based on format
    const formatPrompts = {
      wordpress: `以下の下書きを基に、WordPressブログ記事として完成させてください。
- 見出し（H2, H3）を使った構造化された文章
- 読みやすい段落構成
- 3000-5000文字程度
- Markdown形式で出力

参考情報:
${context}

下書き:
${draft}`,

      note: `以下の下書きを基に、noteの記事として完成させてください。
- 親しみやすく読みやすい文体
- 適度な改行と段落
- 2000-3000文字程度
- Markdown形式で出力

参考情報:
${context}

下書き:
${draft}`,

      x: `以下の下書きを基に、Xポスト（旧Twitter）として完成させてください。
- 280文字以内
- ハッシュタグを2-3個含める
- インパクトのある内容
- 絵文字を適度に使用

参考情報:
${context}

下書き:
${draft}`
    }

    const initialContent = await generateContent({
      prompt: formatPrompts[format as keyof typeof formatPrompts],
      maxTokens: format === 'x' ? 100 : 4000
    })

    // Step 3: Fact check
    const factCheckResult = await factCheck(initialContent)

    // Step 4: Apply corrections if needed
    let finalContent = initialContent
    if (factCheckResult.hasErrors && factCheckResult.corrections.length > 0) {
      const corrections = factCheckResult.corrections
        .map(c => `・${c.original} → ${c.corrected}`)
        .join('\n')

      const correctionPrompt = `以下の記事の事実誤認を修正してください。同じ文体と口調を保ちながら修正してください。

修正内容:
${corrections}

元の記事:
${initialContent}`

      finalContent = await generateContent({
        prompt: correctionPrompt,
        maxTokens: format === 'x' ? 100 : 4000
      })
    }

    return NextResponse.json({ 
      text: finalContent,
      factCheck: factCheckResult,
      similarArticlesCount: similarArticles.length
    })

  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' }, 
      { status: 500 }
    )
  }
}