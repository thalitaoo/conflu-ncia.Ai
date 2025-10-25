import React, { useState, useEffect, useRef } from 'react';
import { Product, ChatMessage, PaymentMethod, Source, PaymentStatus, EnrollmentStatus, CertificateStatus } from '../types';
import { generateChatbotResponse } from '../services/geminiService';

interface PublicChatbotProps {
    products: Product[];
    onClose: () => void;
    onRegisterStudent: (data: any) => void;
}

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;

const PublicChatbot: React.FC<PublicChatbotProps> = ({ products, onClose, onRegisterStudent }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationState, setConversationState] = useState('idle');
    const [registrationData, setRegistrationData] = useState<any>({});
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMessages([
            {
                id: crypto.randomUUID(),
                sender: 'bot',
                text: 'Olá! Sou o Conflu, seu assistente virtual. Como posso te ajudar a alavancar sua carreira hoje?',
                options: [
                    { label: 'Quais cursos estão disponíveis?', value: 'Quais cursos estão disponíveis?' },
                    { label: 'Quero me inscrever', value: 'Quero me inscrever' },
                ]
            }
        ]);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (sender: 'user' | 'bot', text: string, options: ChatMessage['options'] = []) => {
        const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender,
            text,
            options,
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleRegistrationStep = (input: string, payload?: any) => {
        setIsLoading(false);
        let nextState = conversationState;
        const updatedData = { ...registrationData };

        switch (conversationState) {
            case 'start_registration':
                nextState = 'collecting_name';
                addMessage('bot', 'Ótima escolha! Para começar, qual é o seu nome completo?');
                break;
            
            case 'collecting_name':
                updatedData.name = input;
                nextState = 'collecting_email';
                addMessage('bot', `Prazer, ${input}! Agora, qual o seu melhor e-mail?`);
                break;

            case 'collecting_email':
                // A simple email regex validation
                if (!/\S+@\S+\.\S+/.test(input)) {
                    addMessage('bot', 'Parece que este e-mail não é válido. Por favor, tente novamente.');
                    return; // Stay in the same state
                }
                updatedData.email = input;
                nextState = 'collecting_password';
                addMessage('bot', 'Ok. Agora, crie uma senha para acessar o portal do aluno.');
                break;
            
            case 'collecting_password':
                if (input.length < 3) {
                     addMessage('bot', 'Sua senha precisa ter pelo menos 3 caracteres. Tente novamente.');
                     return;
                }
                updatedData.password = input;
                const product = products.find(p => p.name === updatedData.productName);
                if (product && product.classes.length > 0) {
                    nextState = 'collecting_class';
                    addMessage('bot', 'Senha anotada! Escolha uma das turmas disponíveis:',
                        product.classes.map(c => ({
                            label: `${c.name} - ${new Date(c.date).toLocaleDateString()}`,
                            value: c.name,
                            payload: c.id
                        }))
                    );
                } else {
                    addMessage('bot', 'Não encontrei turmas para este curso. Por favor, contate o suporte.');
                    nextState = 'idle';
                }
                break;

            case 'collecting_class':
                updatedData.classId = payload;
                nextState = 'collecting_payment';
                addMessage('bot', 'Turma selecionada! Qual será a forma de pagamento?', [
                    { label: 'PIX', value: PaymentMethod.Pix, payload: PaymentMethod.Pix },
                    { label: 'Cartão de Crédito', value: PaymentMethod.CreditCard, payload: PaymentMethod.CreditCard },
                ]);
                break;

            case 'collecting_payment':
                updatedData.paymentMethod = payload;
                nextState = 'awaiting_payment_confirmation';
                const paymentLink = `https://pagamento.conflu.com/simulado?valor=${products.find(p => p.name === updatedData.productName)?.price}`;
                addMessage('bot', `Perfeito! Aqui está o link para pagamento: ${paymentLink}\n\nApós concluir, clique no botão abaixo.`, [
                    { label: 'Pagamento Concluído', value: 'payment_done', payload: 'payment_done' },
                ]);
                break;

            case 'awaiting_payment_confirmation':
                if (payload === 'payment_done') {
                    const finalProduct = products.find(p => p.name === updatedData.productName);
                    if (!finalProduct) {
                         addMessage('bot', 'Ocorreu um erro ao encontrar o curso. Tente novamente.');
                         nextState = 'idle';
                         break;
                    }
                    const enrollment = {
                        productId: finalProduct.id,
                        classId: updatedData.classId,
                        enrollmentDate: new Date().toISOString(),
                        source: Source.Chatbot,
                        paymentMethod: updatedData.paymentMethod,
                        paymentStatus: PaymentStatus.Paid,
                        enrollmentStatus: EnrollmentStatus.Active,
                        certificateStatus: CertificateStatus.NotIssued,
                        isCorporatePurchase: false,
                    };
                    const student = {
                        name: updatedData.name,
                        email: updatedData.email,
                        password: updatedData.password,
                        enrollment: enrollment,
                    };

                    onRegisterStudent(student);
                    addMessage('bot', 'Pronto! Sua matrícula foi realizada com sucesso. Enviamos um e-mail de confirmação para você. Bem-vindo(a) à Conflu!');
                    nextState = 'idle';
                }
                break;
        }

        setConversationState(nextState);
        setRegistrationData(updatedData);
    };

    const handleSendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        addMessage('user', messageText);
        setUserInput('');
        
        if (messageText.toLowerCase().trim() === 'cancelar' && conversationState !== 'idle') {
            setIsLoading(true);
            addMessage('bot', 'Ok, o processo de matrícula foi cancelado. Como mais posso ajudar?');
            setConversationState('idle');
            setRegistrationData({});
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);

        if (conversationState !== 'idle') {
            handleRegistrationStep(messageText);
            return;
        }

        try {
            const responseText = await generateChatbotResponse(null, messageText, products);
            
            let isAction = false;
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonAction = JSON.parse(jsonMatch[0]);
                    if (jsonAction.action === 'start_registration' && jsonAction.productName) {
                        isAction = true;
                        const productExists = products.some(p => p.name === jsonAction.productName);
                        if (productExists) {
                            setRegistrationData({ productName: jsonAction.productName });
                            setConversationState('start_registration');
                            addMessage('bot', `Vamos iniciar sua matrícula em ${jsonAction.productName}!\n\n(Digite "cancelar" a qualquer momento para interromper).`);
                            // Use timeout to allow state update before triggering next step
                            setTimeout(() => handleRegistrationStep(''), 0);
                        } else {
                             addMessage('bot', `Desculpe, não encontrei o curso "${jsonAction.productName}". Poderia verificar o nome?`);
                        }
                    }
                }
            } catch (e) { /* Not a JSON action */ }

            if (!isAction) {
                addMessage('bot', responseText);
            }
        } catch (error) {
            console.error("Chat error:", error);
            addMessage('bot', 'Desculpe, ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleOptionClick = (option: { label: string; value: string; payload?: any }) => {
        addMessage('user', option.label);
        setIsLoading(true);
        
        if (conversationState !== 'idle') {
             handleRegistrationStep(option.value, option.payload);
        } else {
             handleSendMessage(option.value);
        }
    };


    return (
        <div className="fixed bottom-6 right-6 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Conflu Assistant</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"><CloseIcon /></button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">C</div>}
                            <div className={`p-3 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                {msg.options && !isLoading && (
                                    <div className="mt-3 grid grid-cols-1 gap-2">
                                        {msg.options.map((opt, i) => (
                                            <button key={i} onClick={() => handleOptionClick(opt)} className="w-full text-left text-sm text-indigo-600 dark:text-indigo-400 font-semibold p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors">
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2">
                             <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">C</div>
                             <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(userInput); }} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                        className="flex-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" disabled={isLoading} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400">
                        <SendIcon />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default PublicChatbot;