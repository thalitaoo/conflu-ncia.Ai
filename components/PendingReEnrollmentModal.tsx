import React, { useState } from 'react';
import { Student, Product } from '../types';

interface PendingReEnrollmentModalProps {
    student: Student;
    product: Product;
    onClose: () => void;
    onReEnroll: (studentId: string, productId: string, classId: string) => void;
}

const PendingReEnrollmentModal: React.FC<PendingReEnrollmentModalProps> = ({ student, product, onClose, onReEnroll }) => {
    const [selectedClassId, setSelectedClassId] = useState<string>(product.classes[0]?.id || '');

    const handleReEnroll = () => {
        if (!selectedClassId) {
            alert('Por favor, selecione uma turma.');
            return;
        }
        onReEnroll(student.id, product.id, selectedClassId);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reinscrever Aluno</h2>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Você está reinscrevendo <strong>{student.name}</strong> no curso <strong>{product.name}</strong>.
                    </p>
                    <div>
                        <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione a nova turma</label>
                        <select 
                            id="classId" 
                            value={selectedClassId} 
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            required 
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {product.classes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name} - {new Date(c.date).toLocaleDateString('pt-BR')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                     <button
                        onClick={onClose}
                        type="button"
                        className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleReEnroll}
                        type="button"
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        Confirmar Re-inscrição
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingReEnrollmentModal;
