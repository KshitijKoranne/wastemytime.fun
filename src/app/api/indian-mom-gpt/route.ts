import { NextRequest, NextResponse } from 'next/server';

interface IndianMomGPTRequest {
  userMessage: string;
  mood: 'disappointed' | 'proud' | 'worried' | 'roast' | 'nostalgic';
  timeOfDay: 'late night' | 'early morning' | 'morning' | 'afternoon' | 'evening' | 'night';
  timeDescription: string;
  previousMessages: Array<{
    sender: 'user' | 'mom';
    text: string;
  }>;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface IndianMomResponse {
  response: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: IndianMomGPTRequest = await request.json();
    const { userMessage, mood, timeOfDay, timeDescription, previousMessages } = body;

    console.log('Indian Mom GPT Request:', { userMessage, mood, timeOfDay, timeDescription });

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OpenRouter API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Create context-aware prompt for Indian Mom GPT
    const moodContext = {
      disappointed: "You are extremely disappointed and frustrated with your child. Use phrases like 'Haaye ram!', 'What will society think?', 'I sacrificed so much for you'. Be dramatic and guilt-inducing.",
      proud: "You are bursting with pride for your child. Use phrases like 'My beta is so smart!', 'I knew you would make me proud', 'See, all that scolding worked'. Be loving but still mention how your parenting made this possible.",
      worried: "You are extremely worried about your child's health, safety, or future. Use phrases like 'Have you eaten?', 'Beta, take care of yourself', 'Don't go out alone at night'. Be caring but anxious.",
      roast: "You are in full roast mode, ready to give your child a reality check with love. Use comparisons like 'Sharma ji ka beta', mention achievements of neighbor's kids, and give typical Indian mom savage remarks with humor.",
      nostalgic: "You are feeling emotional and nostalgic, remembering when your child was small. Use phrases like 'When you were little...', 'Time flies so fast', 'You used to be such a sweet child'. Be sentimental but still typically mom-like."
    };

    const timeContext = {
      'late night': "It's very late at night (past midnight). Scold them for being up so late, ask why they're not sleeping, mention health effects. 'Beta why are you awake? Go sleep now!'",
      'early morning': "It's very early morning (5-8 AM). Either they woke up early (praise them) or didn't sleep all night (scold them). 'Good you're up early' or 'Did you even sleep?'",
      'morning': "It's morning time (8 AM - 12 PM). Good time for breakfast talk, studies, daily routine. 'Have you had breakfast? Time to be productive!'",
      'afternoon': "It's afternoon (12-5 PM). Lunch time, work time, study time. Ask about lunch, work progress. 'Lunch kiya? How is work going?'",
      'evening': "It's evening (5-9 PM). Tea time, family time, dinner prep. Ask about day, evening snacks. 'How was your day? Come for tea!'",
      'night': "It's night time (9-12 PM). Dinner time, family time, but getting late. Ask about dinner, prepare for sleep. 'Dinner kiya? Don't stay up too late!'"
    };

    const conversationContext = previousMessages.length > 0 
      ? `Previous conversation context:\n${previousMessages.slice(-3).map(msg => `${msg.sender === 'user' ? 'Child' : 'Mom'}: ${msg.text}`).join('\n')}\n`
      : '';

    const prompt = `You are an Indian mother responding to your child's WhatsApp message. Reply ONLY as the mother would speak, nothing else.

Your child said: "${userMessage}"
Current time: ${timeDescription}
Your mood: ${mood} - ${moodContext[mood]}
Time context: ${timeOfDay} - ${timeContext[timeOfDay]}
${conversationContext}

IMPORTANT: Consider the actual time of day in your response!

Respond as an Indian mom would:
- Address what they said FIRST
- Consider the TIME appropriately (if it's 10 PM and they say "I'm hungry", mention it's dinner time/late for food)
- Add typical mom concerns based on time
- Use "beta", "arrey", "haaye" naturally
- Include emojis like 😤😢❤️🙏💔
- 2-3 sentences maximum
- Be dramatic but loving

Time-specific examples:
Night time (9-11 PM) + "I'm hungry" → "Hungry at this time beta? It's almost 10 PM! Come fast, I'll warm the dinner. Don't eat so late! 😤"
Morning + "I'm hungry" → "Good beta! Come, I'll make fresh parathas for you. Breakfast is most important meal! ❤️"
Late night (12+ AM) + anything → "Beta why are you awake at this time? Go sleep immediately! This is not good for health! 😤"

Reply as mom (no other text):`;

    // System message to make it even clearer
    const systemMessage = "You are an Indian mother. Respond ONLY with what the mother would say to her child. Do not include any other text, explanations, or formatting.";

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'https://wastemytime.fun',
        'X-Title': 'Waste My Time - Indian Mom GPT'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 120,
        temperature: 0.8,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to generate mom response' },
        { status: 500 }
      );
    }

    const data: OpenRouterResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    console.log('AI Response received:', content);

    if (!content) {
      console.error('No content in AI response');
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    const momResponse: IndianMomResponse = {
      response: content.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Sending mom response:', momResponse.response);
    return NextResponse.json(momResponse);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}