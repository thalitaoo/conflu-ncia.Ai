
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractEnrollmentData = async (text: string, products: Product[]): Promise<any> => {
    const productNames = products.map(p => p.name).join(', ');

    const prompt = `
        Extraia as seguintes informações do texto abaixo:
        - Nome completo do aluno
        - Email do aluno
        - Endereço completo
        - Localidade (cidade/estado)
        - Telefone de contato
        - Empresa onde trabalha
        - Cargo que exerce
        - Nome do produto/curso
        - Método de pagamento
        
        Texto: "${text}"

        Considere os seguintes produtos disponíveis: ${productNames}.
        Se algum campo não for mencionado, deixe-o em branco.
        Responda apenas com o JSON.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    studentName: { type: Type.STRING, description: 'Nome completo do aluno.' },
                    studentEmail: { type: Type.STRING, description: 'Endereço de e-mail do aluno.' },
                    address: { type: Type.STRING, description: 'Endereço completo do aluno (Rua, número, cidade, estado).' },
                    location: { type: Type.STRING, description: 'Cidade e estado do aluno.' },
                    phone: { type: Type.STRING, description: 'Número de telefone para contato.' },
                    companyName: { type: Type.STRING, description: 'Nome da empresa onde o aluno trabalha.' },
                    jobTitle: { type: Type.STRING, description: 'Cargo que o aluno exerce na empresa.' },
                    productName: { type: Type.STRING, description: `Nome do curso. Deve ser um dos seguintes: ${productNames}` },
                    paymentMethod: { type: Type.STRING, description: 'Método de pagamento (ex: PIX, Cartão de Crédito).' },
                },
                required: ["studentName", "studentEmail", "productName"]
            }
        }
    });
    
    const jsonStr = response.text.trim();
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("Failed to parse Gemini response:", jsonStr);
        throw new Error("Could not extract enrollment data from text.");
    }
};

export const generateInsights = async (data: { products: Product[], students: Student[] }): Promise<string> => {
    const prompt = `
        Com base nos seguintes dados de uma escola de cursos, gere insights acionáveis para o gestor.
        Foque em:
        - Cursos com mais e menos matrículas.
        - Fontes de matrículas mais eficazes.
        - Status de pagamento e alunos com pendências.
        - Sugestões para aumentar matrículas ou engajamento.

        Dados:
        ${JSON.stringify(data, null, 2)}

        Seja conciso e direto, use markdown para formatação (negrito, listas).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    
    return response.text;
};