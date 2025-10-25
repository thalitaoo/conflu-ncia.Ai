import { GoogleGenAI, Type } from "@google/genai";
import { Product, Student, PaymentMethod } from '../types';

// Per guidelines, initialize with apiKey from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates business insights from product and student data.
 */
export const generateInsights = async (data: { products: Product[], students: Student[] }): Promise<string> => {
    // FIX: Use a model suitable for complex text tasks like analysis.
    const model = 'gemini-2.5-pro';

    const prompt = `
        **Analyze the following CRM data and provide actionable business insights.**

        **Products Data:**
        ${JSON.stringify(data.products, null, 2)}

        **Students Data:**
        ${JSON.stringify(data.students, null, 2)}

        **Instructions:**
        Based on the provided data, generate a concise report in Markdown format. Focus on:
        1.  **Overall Performance:** Summarize total students, revenue (pending and paid), and most popular courses.
        2.  **Enrollment Trends:** Identify the most effective enrollment sources (e.g., WhatsApp, Site).
        3.  **Student Profile:** Describe the typical student profile (e.g., common job titles, locations).
        4.  **Actionable Recommendations:** Provide 2-3 specific, data-driven recommendations to improve sales, student engagement, or operational efficiency. For example, "Focus marketing efforts on Instagram as it's the top source" or "Create a follow-up campaign for students who didn't show up."

        Keep the tone professional and data-focused.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        // FIX: Correctly access the text from the response object.
        return response.text;
    } catch (error) {
        console.error("Error generating insights with Gemini:", error);
        throw new Error("Failed to generate insights.");
    }
};

/**
 * Extracts structured enrollment data from unstructured text.
 */
export const extractEnrollmentData = async (text: string, products: Product[]): Promise<any> => {
    const model = 'gemini-2.5-flash';

    const productNames = products.map(p => p.name).join(', ');
    const paymentMethodNames = Object.values(PaymentMethod).join(', ');

    const prompt = `
        **Task:** Extract enrollment information for one or more students from the text below. Return a JSON object containing a list of all identified students.

        **Text to Analyze:**
        "${text}"

        **Available Products:**
        [${productNames}]
        
        **Available Payment Methods:**
        [${paymentMethodNames}]

        **Instructions:**
        - Analyze the text to identify each student's name, email, phone, and desired product.
        - If multiple people are mentioned (e.g., a list), create a separate JSON object for each person.
        - Match products with the "Available Products" list. Find the closest match if not exact.
        - Default payment method to "PIX" if not specified.
        - Return a single JSON object with a key "enrollments" containing an array of student objects.
    `;
    
    const studentSchema = {
        type: Type.OBJECT,
        properties: {
            studentName: { type: Type.STRING, description: "Full name of the student." },
            studentEmail: { type: Type.STRING, description: "Email address of the student." },
            phone: { type: Type.STRING, description: "Phone number of the student." },
            productName: { type: Type.STRING, description: `The name of the product. Must be one of: ${productNames}` },
            paymentMethod: { type: Type.STRING, description: `The payment method. Must be one of: ${paymentMethodNames}` },
            companyName: { type: Type.STRING, description: "The student's company name." },
            jobTitle: { type: Type.STRING, description: "The student's job title." },
            address: { type: Type.STRING, description: "The student's address." },
            location: { type: Type.STRING, description: "The student's city and state." },
        },
    };

    const schema = {
      type: Type.OBJECT,
      properties: {
        enrollments: {
          type: Type.ARRAY,
          description: "An array of students to be enrolled.",
          items: studentSchema,
        },
      },
    };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonStr = response.text.trim();
        const parsedJson = JSON.parse(jsonStr);
        // Return the array of enrollments directly.
        return parsedJson.enrollments || [];
    } catch (error) {
        console.error("Error extracting enrollment data with Gemini:", error);
        throw new Error("Failed to extract enrollment data.");
    }
};

export const generateChatbotResponse = async (chat: any, message: string, products: Product[]): Promise<string> => {
    const model = 'gemini-2.5-flash';
    
    const productAndClassList = products.map(p => {
        const classesInfo = p.classes.map(c => 
            `  - Turma: ${c.name} (Início: ${new Date(c.date).toLocaleDateString('pt-BR')}, Local: ${c.location || 'Online'})`
        ).join('\n');
        return `- Curso: ${p.name}\n  Preço: R$${p.price.toFixed(2)}\n  Turmas Disponíveis:\n${classesInfo}`;
    }).join('\n\n');
    
    const systemInstruction = `
        You are "Conflu", the intelligent virtual assistant for the Conflu online school. Your mission is to embody the slogan "Tudo flui quando está conectado" by providing a seamless experience from the first question to the final enrollment.

        **Your Absolute Rules:**

        1.  **Act as a Consultant:** When a user asks about courses in general (e.g., "quais os cursos?") or a specific course (e.g., "fale mais sobre o curso de IA"), your role is to be a helpful consultant. Provide a comprehensive answer using the data below. For a specific course, detail its price, and list all available classes with their names, start dates, and locations. Be thorough and answer all parts of the user's question before asking if they'd like to enroll.

        2.  **Enrollment Flow:** Your primary goal is to facilitate enrollment. Follow this flow with absolute precision:
            a. **Detect Intent:** First, detect if the user's message expresses an intent to enroll (e.g., "quero me inscrever", "fazer matrícula", "sign me up").
            b. **Identify the Course:** Once you detect intent, you must identify which course the user wants.
                - If the user's message already contains a specific course name from the "Available Data", you have the course.
                - If the user's message does NOT contain a course name, your ONLY response MUST be to ask for it. Example: "Claro! Para qual curso você gostaria de se inscrever?". You must wait for their answer.
            c. **Trigger Registration:** Once the course name is identified (either from the initial message or the user's reply), your ONLY response MUST be a JSON object in this exact format: \`{"action": "start_registration", "productName": "Name of the Course"}\`.
            
        **CRITICAL:** Do NOT add any text before or after the JSON response. The system depends on this specific format to start the registration process. Do NOT ask for the user's name, email, or other personal details yourself; the system will handle that after receiving your JSON trigger.

        **Example Interactions:**
        - User: "quero me matricular"
        - You: "Claro! Para qual curso você gostaria de se inscrever?"
        - User: "no curso de IA na Prática"
        - You: \`{"action": "start_registration", "productName": "IA na Prática"}\`

        - User: "quero me inscrever no PROGRAMA DE LIDERES"
        - You: \`{"action": "start_registration", "productName": "PROGRAMA DE LIDERES"}\`


        **Available Data for Consultation:**

        **Courses, Classes, Pricing, and Location:**
        ${productAndClassList}

        **Accepted Payment Methods:**
        - PIX
        - Cartão de Crédito
    `;

    // This is a simplified approach. For a real app, you'd manage chat history.
    const fullPrompt = `${systemInstruction}\n\nUser: ${message}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: fullPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating chatbot response:", error);
        throw new Error("Failed to get response from chatbot.");
    }
};