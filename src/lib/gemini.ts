import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_VERTEX_API_KEY!)

export interface GenerateOptions {
  prompt: string
  maxTokens?: number
  temperature?: number
}

export interface FactCheckResult {
  hasErrors: boolean
  corrections: Array<{
    original: string
    corrected: string
    source?: string
  }>
}

export async function generateContent(options: GenerateOptions): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: options.prompt }] }],
      generationConfig: {
        maxOutputTokens: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
      },
    })

    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini generateContent error:', error)
    throw new Error('Failed to generate content')
  }
}

export async function factCheck(text: string): Promise<FactCheckResult> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      tools: [{ googleSearchRetrieval: {} }]
    })
    
    const prompt = `次のテキストをファクトチェックして、事実誤認があれば修正してください。
JSON形式で以下の構造で返してください：
{
  "hasErrors": boolean,
  "corrections": [
    {
      "original": "元の誤った記述",
      "corrected": "修正された記述", 
      "source": "参照URL（任意）"
    }
  ]
}

チェック対象テキスト：
${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()
    
    try {
      return JSON.parse(responseText)
    } catch {
      return { hasErrors: false, corrections: [] }
    }
  } catch (error) {
    console.error('Gemini factCheck error:', error)
    return { hasErrors: false, corrections: [] }
  }
}