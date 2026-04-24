import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const { platform, date } = await req.json()
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  const platformFocus =
    platform === 'all' ? 'TikTok, Instagram, dan X Indonesia'
    : platform === 'tiktok' ? 'TikTok Indonesia secara mendalam'
    : platform === 'instagram' ? 'Instagram Indonesia secara mendalam'
    : 'X/Twitter Indonesia secara mendalam'

  const prompt = `Kamu adalah senior social media strategist spesialis pasar Indonesia.
Berikan daily trend update untuk ${platformFocus} hari ini (${date}).

Respond ONLY in valid JSON, no markdown, no preamble. Format:
{
  "date": "string tanggal hari ini",
  "platform_focus": "string",
  "emerging_formats": [
    {"title": "string", "platform": "tiktok|instagram|x|all", "why": "string 1-2 kalimat spesifik Indonesia"}
  ],
  "viral_patterns": [
    {"title": "string", "desc": "string 1-2 kalimat spesifik Indonesia"}
  ],
  "platform_insights": [
    {"platform": "tiktok|instagram|x", "insight": "string 1-2 kalimat spesifik"}
  ],
  "content_ideas": [
    {"platform": "tiktok|instagram|x", "title": "string", "desc": "string 1-2 kalimat actionable"}
  ],
  "declining": [
    {"what": "string singkat", "why": "string 1 kalimat"}
  ]
}

Pastikan semua isi spesifik untuk audiens Indonesia. Jangan generik. Gunakan referensi budaya, bahasa gaul, dan perilaku digital lokal Indonesia.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json()
  const text = (data.content || []).map((c: { text?: string }) => c.text || '').join('')
  const clean = text.replace(/```json|```/g, '').trim()

  try {
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ error: 'Parse failed', raw: clean }, { status: 500 })
  }
}
