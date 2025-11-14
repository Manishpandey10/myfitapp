// app/api/generate-plan/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY || '';

function normalizeText(s: string) {
  return s.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function POST(req: Request) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY missing' }, { status: 401 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    const {
      name = '',
      age = '',
      gender = '',
      height = '',
      weight = '',
      goal = '',
      level = '',
      dietary = '',
      medical = '',
      stress = '',
    } = await req.json();

    // PROMPT: force strict JSON output following the schema below
    const prompt = `
You are an assistant that must output a single valid JSON object and nothing else (no explanation, no markdown, no code fences).

Schema (produce exactly this shape — use empty arrays/strings when needed):
{
  "summary": "short 1-2 sentence overview",
  "workoutPlan": [
    {
      "day": "Day 1",
      "exercises": [
        { "name": "Exercise name", "sets": "3x10", "notes": "optional short note" }
      ],
      "notes": "optional short note"
    }
  ],
  "dietPlan": [
    {
      "day": "Day 1",
      "meals": [
        { "name": "Breakfast", "items": ["item1","item2"], "calories": 450 }
      ],
      "notes": "optional short note"
    }
  ],
  "tips": ["brief tip 1", "brief tip 2"],
  "motivation": "one short motivational paragraph"
}

User details (customize output accordingly):
Name: ${name}
Age: ${age}
Gender: ${gender}
Height_cm: ${height}
Weight_kg: ${weight}
Fitness_Goal: ${goal}
Fitness_Level: ${level}
Dietary_Preference: ${dietary}
Medical_History: ${medical || 'None'}
Stress_Level: ${stress}

Constraints:
- Output only the JSON object and nothing else.
- Keep strings concise; calories may be estimated integers.
- Aim for up to 7 entries in workoutPlan and dietPlan for a weekly plan.
Generate the JSON now.
    `;

    // call model once (no retries)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // extract text safely
    let rawText = '';
    try {
      if (response && typeof response.text === 'function') {
        rawText = await response.text();
      } else if (typeof response === 'string') {
        rawText = response;
      } else if (response?.outputText) {
        rawText = response.outputText;
      } else {
        rawText = JSON.stringify(response);
      }
      rawText = normalizeText(rawText);
    } catch (e: any) {
      return NextResponse.json({ error: 'Failed to read model response', detail: String(e) }, { status: 502 });
    }

    // try to parse JSON
    try {
      const parsed = JSON.parse(rawText);
      return NextResponse.json({ plan: parsed }, { status: 200 });
    } catch (e) {
      // parsing failed — return raw text so frontend can show it or debug
      return NextResponse.json({ planRaw: rawText, parseError: String(e) }, { status: 200 });
    }
  } catch (err: any) {
    const msg = String(err?.message || err || 'Unknown server error');
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}