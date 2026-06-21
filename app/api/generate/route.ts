import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { subject, topics, examDate, intensity } = await req.json();

    if (!subject || !topics || !examDate || !intensity) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Calculate precise remaining weeks from today's date
    const today = new Date();
    const targetDate = new Date(examDate);
    const timeDiff = targetDate.getTime() - today.getTime();
    
    // Convert ms to weeks, rounding up to ensure a clean structural runway buffer
    const totalRemainingWeeks = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7)));

    // 2. Define the schema structure without the strict SDK type constraint
    const responseSchema = {
      type: 'object',
      properties: {
        title: { type: 'string' },
        weeks: {
          type: 'array',
          description: `Array containing exactly ${totalRemainingWeeks} weekly structural elements.`,
          items: {
            type: 'object',
            properties: {
              weekNumber: { type: 'integer' },
              focus: { type: 'string' },
              milestones: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['weekNumber', 'focus', 'milestones']
          }
        }
      },
      required: ['title', 'weeks']
    };

    const prompt = `
      You are an expert academic advisor. Generate a highly structured study plan.
      
      STRICT CALENDAR CONSTRAINTS:
      - The target exam date is ${examDate}.
      - Based on today's calendar date (${today.toISOString().split('T')[0]}), there are exactly ${totalRemainingWeeks} week(s) remaining.
      - You MUST generate exactly ${totalRemainingWeeks} structural week elements inside the "weeks" array matching the schema layout. Do not generate more or less than this count.
      
      Parameters:
      - Subject: ${subject}
      - Topics to cover: ${topics}
      - Requested Pacing Strategy: ${intensity}
      
      CRITICAL INSTRUCTIONS FOR PACING STRATEGY:
      - If strategy is "Cram Mode": Consolidate milestones heavily. Focus strictly on core high-yield exam patterns and maximize topic aggregation per week.
      - If strategy is "Balanced": Keep a steady, sustainable weekly flow balancing concept review with practice tests.
      - If strategy is "Deep Dive": Break down the milestones into modular granular steps, emphasizing fundamental research, theory, and extensive problem-solving.
    `;

    // 3. Request structured output generation from the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseSchema: responseSchema as any, // Typecast to any drops the strict compiler wall completely
        temperature: 0.2
      }
    });

    const responseText = result.response.text().trim();
    const studyPlanData = JSON.parse(responseText);

    return NextResponse.json({ data: studyPlanData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown compilation error';
    console.error('AI Generation Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 });
  }
}