import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize using the stable SDK constructor
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { subject, topics, examDate } = await req.json();

    if (!subject || !topics || !examDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `
      You are an expert academic advisor. Generate a highly structured study plan leading up to the exam date: ${examDate}.
      Subject: ${subject}
      Topics to cover: ${topics}
      
      Respond STRICTLY with a valid JSON object. Do not include markdown code blocks like \`\`\`json. 
      The JSON structure must match this format precisely:
      {
        "title": "Study Plan for ${subject}",
        "weeks": [
          {
            "weekNumber": 1,
            "focus": "Brief focus description",
            "milestones": ["Milestone 1", "Milestone 2"]
          }
        ]
      }
    `;

    // FIX: Using 'gemini-2.5-flash' handles modern endpoint routing cleanly
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Call the generation service using a clean string payload
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    
    // Clean up potential markdown blocks if the model appends them
    const cleanJson = responseText.replace(/^```json\s*|```$/g, '');
    const studyPlanData = JSON.parse(cleanJson);

    return NextResponse.json({ data: studyPlanData });
  } catch (error) {
    // Cast to Error object safely or read standard message
    const errorMessage = error instanceof Error ? error.message : 'Unknown compilation error';
    console.error('AI Generation Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 });
  }
}