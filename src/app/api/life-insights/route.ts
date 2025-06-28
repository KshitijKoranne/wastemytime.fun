import { NextRequest, NextResponse } from 'next/server';

interface InsightRequest {
  weekNumber: number;
  startDate: string;
  endDate: string;
  userAge: number;
  lifeStage: string;
  historicalEvents?: string[];
  insightType?: 'full' | 'life-stage' | 'fun-fact';
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface AIResponse {
  insight?: string;
  lifeStageInsight?: string;
  funFact?: string;
  weekNumber: number;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InsightRequest = await request.json();
    const { weekNumber, startDate, endDate, userAge, lifeStage, historicalEvents = [], insightType = 'full' } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Create contextual prompt for the AI based on insight type
    let prompt: string;
    
    if (insightType === 'life-stage') {
      prompt = `You are a thoughtful life coach. A user is reflecting on being ${userAge} years old during their ${lifeStage} stage of life.

Please provide a meaningful, encouraging insight (80-120 words) about this life stage. Focus on:
- What makes this age/stage special and unique
- Key developmental aspects or opportunities at this stage
- Positive affirmations about growth and potential
- How this stage contributes to their overall life journey

Keep the tone warm, insightful, and personally meaningful. Make it feel like advice from a wise mentor.`;
    } else if (insightType === 'fun-fact') {
      prompt = `You are an engaging educator sharing fascinating facts. A user is looking at week ${weekNumber} of their life when they were ${userAge} years old.

Please provide one fascinating, surprising fun fact (60-100 words) related to:
- Human development at age ${userAge}
- Brain science or psychology relevant to this age
- Interesting life statistics or milestones
- Amazing abilities or changes happening at this life stage

Make it educational, surprising, and delightful. Start with "Did you know..." and focus on one specific, memorable fact.`;
    } else {
      // Full insight (original)
      prompt = `You are a thoughtful life coach and historian. A user is reflecting on week ${weekNumber} of their life (${startDate} to ${endDate}), when they were ${userAge} years old during their ${lifeStage} stage.

Historical context from that time period:
${historicalEvents.length > 0 ? historicalEvents.join('\n- ') : 'No specific historical events provided for this week.'}

Please provide a thoughtful, engaging response (150-200 words) that includes:

1. **Historical Perspective**: What was happening in the world during this week that might have influenced daily life
2. **Life Stage Insights**: Meaningful reflections about being ${userAge} years old during the ${lifeStage} phase
3. **Cultural Context**: What technology, music, movies, or trends were popular then
4. **Reflective Question**: One thought-provoking question to help the user reflect on this period

Keep the tone warm, insightful, and personally meaningful. Focus on helping the user connect with this moment in their life story.`;
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        'X-Title': 'Waste My Time - Life Calendar'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate insights' },
        { status: 500 }
      );
    }

    const data: OpenRouterResponse = await response.json();
    const insight = data.choices[0]?.message?.content;

    if (!insight) {
      return NextResponse.json(
        { error: 'No insight generated' },
        { status: 500 }
      );
    }

    const aiResponse: AIResponse = {
      weekNumber,
      timestamp: new Date().toISOString()
    };

    if (insightType === 'life-stage') {
      aiResponse.lifeStageInsight = insight.trim();
    } else if (insightType === 'fun-fact') {
      aiResponse.funFact = insight.trim();
    } else {
      aiResponse.insight = insight.trim();
    }

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}