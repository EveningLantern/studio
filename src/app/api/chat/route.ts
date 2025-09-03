import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const faqResponses: Record<string, string> = {
  "what services do you offer": "We offer Telecom Infrastructure, Geospatial & GIS Solutions, Skill Development, and Consultancy & Business Incubation.",
  "what are your business hours": "Our business hours are Monday - Sunday, from 9:00 AM to 8:00 PM.",
  "how do i contact support": "You can contact our support team via email at info@digitalindian.co.in or by calling +91 7908735132.",
  "how can i book a meeting": "You can book a meeting by using the 'View Calendar' option on our contact page.",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage = body.message?.toLowerCase().trim();

    if (!userMessage) {
      return NextResponse.json({ reply: "I'm sorry, but I didn't receive a message. How can I help you?" }, { status: 400 });
    }

    // Date query
    if (userMessage.includes("date") || userMessage.includes("today")) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return NextResponse.json({ reply: `Hello! Today is ${formattedDate}.` });
    }

    // FAQ match (loose matching)
    for (const [key, value] of Object.entries(faqResponses)) {
      if (userMessage.includes(key)) {
        return NextResponse.json({ reply: value });
      }
    }

    // Fallback to Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not configured");
      return NextResponse.json({ reply: "API key not configured on server" }, { status: 500 });
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `You are a friendly and helpful AI assistant for a company called 'Digital Indian'. Your goal is to provide concise and professional responses. The user asked: "${userMessage}". If the question is outside of your scope, politely say that you can only answer questions related to Digital Indian.` },
          ],
        },
      ],
    };

    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      return NextResponse.json({ reply });
    } else {
      console.error("Invalid AI response structure:", data);
      return NextResponse.json({ reply: "I'm having trouble generating a response right now." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return NextResponse.json({ reply: "Error processing your request." }, { status: 500 });
  }
}
