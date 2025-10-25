import React, { useState } from 'react';
import { Product, View } from '../types';
// FIX: Corrected import from the PublicChatbot module.
import PublicChatbot from './PublicChatbot';

interface PublicHomePageProps {
    products: Product[];
    setView: (view: View) => void;
    onRegisterStudent: (data: any) => void;
}

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;

const PublicHomePage: React.FC<PublicHomePageProps> = ({ products, setView, onRegisterStudent }) => {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
            <header className="bg-white dark:bg-gray-800 shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Conflu</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView({ type: 'signup' })}
                            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                        >
                           Cadastre-se
                        </button>
                        <button
                            onClick={() => setView({ type: 'login' })}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            Login
                        </button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-6 py-12">
                 <div className="text-center py-16">
                    <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Conflu</h2>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Tudo flui quando está conectado.
                    </p>
                    <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Invista no seu futuro. Encontre o curso perfeito para alavancar sua carreira.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {products.map(product => (
                        <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:scale-105 transition-transform duration-300">
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">{product.description}</p>
                            </div>
                            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                                <button
                                    onClick={() => {
                                        window.location.hash = `register/${product.id}`;
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Inscreva-se
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            
            {!isChatbotOpen && (
                 <button 
                    onClick={() => setIsChatbotOpen(true)}
                    className="fixed bottom-6 right-6 bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110 z-50"
                    aria-label="Abrir assistente virtual"
                >
                    <ChatIcon />
                </button>
            )}

            {isChatbotOpen && (
                <PublicChatbot 
                    products={products} 
                    onRegisterStudent={onRegisterStudent}
                    onClose={() => setIsChatbotOpen(false)} 
                />
            )}
        </div>
    );
};

export default PublicHomePage;
