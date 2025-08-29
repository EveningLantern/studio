'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const faqResponses: Record<string, string> = {
    "what services do you offer?": "We offer Telecom Infrastructure, Geospatial & GIS Solutions, Skill Development, and Consultancy & Business Incubation.",
    "what are your business hours?": "Our business hours are Monday - Sunday, from 9:00 AM to 8:00 PM.",
    "how do i contact support?": "You can contact our support team via email at info@digitalindian.co.in or by calling +91 7908735132.",
    "how can i book a meeting?": "You can book a meeting by using the 'View Calendar' option on our contact page.",
};

const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (userMessage) => {
        const lowerMessage = userMessage.toLowerCase().trim();

        // Date query
        if (lowerMessage.includes("date") || lowerMessage.includes("today")) {
            const today = new Date();
            const formattedDate = today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            return `Hello! Today is ${formattedDate}.`;
        }

        // FAQ match
        if (faqResponses[lowerMessage]) {
            return faqResponses[lowerMessage];
        }

        // Fallback to Gemini
        const prompt = `You are a friendly and helpful AI assistant for a company called 'Digital Indian'. Your goal is to provide concise and professional responses. The user asked: "${userMessage}". Based on the user's question, provide a relevant and helpful answer about the company or its services. If the question is outside of your scope, politely say that you can only answer questions related to Digital Indian.`;
        
        const { output } = await ai.generate({
            prompt: prompt,
        });

        return output || "I'm sorry, I couldn't process that. Could you please rephrase?";
    }
);


export async function chat(message: string): Promise<string> {
    return await chatFlow(message);
}
