import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');


export async function POST(req: Request) {
  try {
    const { name, age, gender, height, weight, goal, level, dietary, medical, stress } = await req.json();

    const prompt = `
Name: ${name}
Age: ${age}
Gender: ${gender}
Height: ${height} cm
Weight: ${weight} kg
Fitness Goal: ${goal}
Fitness Level: ${level}
Dietary Preference: ${dietary}
Medical History: ${medical || 'None'}
Stress Level: ${stress}

Please create a customized weekly fitness and diet plan for this individual. Include sections for Summary, Workout Plan, Diet Plan, Tips, and Motivation.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const plan = response.text();

    return NextResponse.json({ plan });
  } catch (error: any) {
    console.error('Gemini SDK Error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}
