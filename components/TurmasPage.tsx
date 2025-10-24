
import React, { useState } from 'react';
// FIX: Import View from types.ts and remove the local definition.
import { Product, CourseClass, View } from '../types';
import CreateClassModal from './CreateClassModal';

interface TurmasPageProps {
    products: Product[];
    setView: (view: View) => void;
    onCreateClass: (newClassData: Omit<CourseClass, 'id'>, productId: string) => void;
}

const TurmasPage: React.FC<TurmasPageProps> = ({ products, setView, onCreateClass }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const allTurmas = products.flatMap(p => p.classes.map(c => ({ ...c, productName: p.name, productId: p.id })));
    allTurmas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="space-y-6">
             <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gerenciamento de Turmas</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                    + Criar Nova Turma
                </button>
            </header>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Turma</th>
                                <th scope="col" className="px-6 py-3">Curso</th>
                                <th scope="col" className="px-6 py-3">Data de Início</th>
                                <th scope="col" className="px-6 py-3">Sessões</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTurmas.map(turma => (
                                <tr key={turma.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{turma.name}</td>
                                    <td className="px-6 py-4">{turma.productName}</td>
                                    <td className="px-6 py-4">{new Date(turma.date).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4">{turma.totalSessions}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setView({ type: 'turma-detail', id: `${turma.productId}|${turma.id}` })}
                                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {allTurmas.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Nenhuma turma criada.</p>}
                </div>
            </div>
            {isCreateModalOpen && <CreateClassModal products={products} onClose={() => setIsCreateModalOpen(false)} onCreateClass={onCreateClass} />}
        </div>
    );
};

export default TurmasPage;
