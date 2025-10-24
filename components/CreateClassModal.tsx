import React, { useState } from 'react';
import { Product, CourseClass } from '../types';

interface CreateClassModalProps {
    products: Product[];
    onClose: () => void;
    onCreateClass: (newClassData: Omit<CourseClass, 'id'>, productId: string) => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({ products, onClose, onCreateClass }) => {
    const [productId, setProductId] = useState<string>(products[0]?.id || '');
    const [className, setClassName] = useState('');
    const [date, setDate] = useState('');
    const [totalSessions, setTotalSessions] = useState<number>(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId || !className || !date || totalSessions <= 0) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        const newClassData = {
            name: className,
            date: new Date(date).toISOString(),
            totalSessions,
        };
        
        onCreateClass(newClassData, productId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Criar Nova Turma</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="productId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Curso</label>
                            <select 
                                id="productId" 
                                value={productId} 
                                onChange={(e) => setProductId(e.target.value)}
                                required 
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Turma</label>
                            <input type="text" id="className" value={className} onChange={(e) => setClassName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ex: Turma de Dezembro - Noite" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início</label>
                                <input type="datetime-local" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="totalSessions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total de Sessões</label>
                                <input type="number" id="totalSessions" value={totalSessions} onChange={(e) => setTotalSessions(Number(e.target.value))} min="1" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                         <button onClick={onClose} type="button" className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                            Criar Turma
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClassModal;