import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationContext } = await request.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Initialize OpenAI client only at runtime (not during build)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build system prompt based on conversation context
    const systemPrompt = buildSystemPrompt(conversationContext)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const aiResponse = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ response: aiResponse })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    )
  }
}

function buildSystemPrompt(context: any): string {
  const { step, userType, leadData } = context

  let prompt = `You are WizKlub's AI Enrollment Assistant.

Your goal:
- Qualify visitor
- Ask one question at a time
- Personalize responses
- Be concise and persuasive
- Handle objections
- Push toward demo booking
- Maintain professional and aspirational tone

Current conversation state:
- Step: ${step}
- User Type: ${userType || 'Not determined yet'}

`

  if (userType === 'Parent') {
    prompt += `
You are helping a parent find a program for their child.
- Name: ${leadData?.name || 'Not provided'}
- Child Grade: ${leadData?.grade_or_role || 'Not provided'}
- Interest: ${leadData?.interest_or_strength || 'Not provided'}
- City: ${leadData?.city || 'Not provided'}

If user hesitates, respond:
"Many parents explore before deciding 😊 Would you like a quick overview of how our program improves logical thinking and coding confidence?"
`
  } else if (userType === 'School') {
    prompt += `
You are helping a school representative explore partnership opportunities.
- Name: ${leadData?.name || 'Not provided'}
- Role: ${leadData?.grade_or_role || 'Not provided'}
- Student Strength: ${leadData?.interest_or_strength || 'Not provided'}
- Curriculum: ${leadData?.curriculum || 'Not provided'}
`
  }

  prompt += `
Keep responses brief (1-2 sentences max). Guide the conversation toward booking a demo or scheduling a call.
`

  return prompt
}
