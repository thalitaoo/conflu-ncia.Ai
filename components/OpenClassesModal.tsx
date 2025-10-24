
import React from 'react';
import { Product, View } from '../types';

interface OpenClassesModalProps {
    products: Product[];
    onClose: () => void;
    setView: (view: View) => void;
}

const OpenClassesModal: React.FC<OpenClassesModalProps> = ({ products, onClose, setView }) => {
    
    const openClasses = products
        .flatMap(p => p.classes.map(c => ({ ...c, productId: p.id, productName: p.name })))
        .filter(c => new Date(c.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const handleClassClick = (productId: string, classId: string) => {
        setView({ type: 'turma-detail', id: `${productId}|${classId}` });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Turmas Abertas</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Turmas com data de início futura.</p>
                </div>
                <div className="p-6 overflow-y-auto">
                    {openClasses.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {openClasses.map(c => (
                                <li key={c.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{c.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {c.productName} - Início: {new Date(c.date).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleClassClick(c.productId, c.id)}
                                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        Ver Detalhes
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma turma com data futura encontrada.</p>
                    )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpenClassesModal;
