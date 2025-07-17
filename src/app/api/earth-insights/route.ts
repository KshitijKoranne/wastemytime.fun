import { NextRequest, NextResponse } from 'next/server';

interface EarthInsightRequest {
  statId: string;
  statTitle: string;
  currentValue: number;
  lifetimeValue?: number;
  userAge?: number;
  category: string;
  description: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface EarthInsightResponse {
  insight: string;
  reflection: string;
  funFact: string;
  statId: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EarthInsightRequest = await request.json();
    const { statId, statTitle, currentValue, lifetimeValue, userAge, category, description } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Create contextual prompt for Earth insights
    const prompt = `You are a thoughtful narrator exploring the interconnectedness of human life and Earth's rhythms. 

A user is contemplating this global statistic:
- **${statTitle}** (${category} category)
- Description: ${description}
- Current count since they opened the page: ${currentValue.toLocaleString()}
${lifetimeValue && userAge ? `- During their ${userAge}-year lifetime: ${lifetimeValue.toLocaleString()}` : ''}

Please provide three distinct responses (each 50-80 words):

**INSIGHT:** Share a profound, perspective-shifting insight about this statistic and its connection to the human experience or Earth's systems.

**REFLECTION:** Offer a personal, emotional reflection that helps the user feel connected to this global phenomenon.

**FUNFACT:** Provide a surprising, memorable fact related to this statistic that will amaze and educate.

Format your response as:
INSIGHT: [your insight]
REFLECTION: [your reflection]  
FUNFACT: [your fun fact]

Keep each section warm, enlightening, and awe-inspiring. Focus on scale, connection, and wonder.`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://wastemytime.fun',
        'X-Title': 'Waste My Time - Earth\'s Heartbeat'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.8,
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
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No insight generated' },
        { status: 500 }
      );
    }

    // Parse the response into sections
    const insightMatch = content.match(/INSIGHT:\s*(.*?)(?=REFLECTION:|$)/s);
    const reflectionMatch = content.match(/REFLECTION:\s*(.*?)(?=FUNFACT:|$)/s);
    const funFactMatch = content.match(/FUNFACT:\s*(.*?)$/s);

    const earthInsight: EarthInsightResponse = {
      insight: insightMatch?.[1]?.trim() || 'The interconnected nature of our world reveals itself in every statistic.',
      reflection: reflectionMatch?.[1]?.trim() || 'You are part of this grand tapestry of human experience.',
      funFact: funFactMatch?.[1]?.trim() || 'Every number tells a story of human connection.',
      statId,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(earthInsight);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}