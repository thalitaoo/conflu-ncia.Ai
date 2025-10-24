
import React, { useState } from 'react';
import { extractEnrollmentData } from '../services/geminiService';
import { Product } from '../types';

interface AIEnrollmentAssistantProps {
    products: Product[];
    onEnrollmentDataExtracted: (data: any) => void;
}

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.6.8 4 3.9-1 5.5 5-2.7 5 2.7-1-5.5 4-3.9-5.6-.8z"/></svg>;

const AIEnrollmentAssistant: React.FC<AIEnrollmentAssistantProps> = ({ products, onEnrollmentDataExtracted }) => {
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleExtract = async () => {
        if (!text.trim()) {
            setError('Por favor, insira o texto da matrícula.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const data = await extractEnrollmentData(text, products);
            onEnrollmentDataExtracted(data);
            setText('');
        } catch (err) {
            setError('Não foi possível extrair os dados. Verifique o texto e tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Assistente de Matrícula IA</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Cole aqui uma mensagem (de WhatsApp, email, etc.) para que a IA extraia os dados e preencha o formulário.
            </p>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: 'Olá, quero inscrever o João da Silva (joao@email.com) no Curso de Oratória. O pagamento será por PIX.'"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
                onClick={handleExtract}
                disabled={isLoading}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
                <SparklesIcon/>
                <span className="ml-2">{isLoading ? 'Extraindo...' : 'Extrair Dados com IA'}</span>
            </button>
        </div>
    );
};

export default AIEnrollmentAssistant;
