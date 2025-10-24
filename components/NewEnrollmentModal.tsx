import React, { useState } from 'react';
import { Student, Product } from '../types';

interface NewEnrollmentModalProps {
    student: Student;
    product: Product;
    onClose: () => void;
    onEnroll: (studentId: string, productId: string, classId: string) => void;
}

const NewEnrollmentModal: React.FC<NewEnrollmentModalProps> = ({ student, product, onClose, onEnroll }) => {
    const [selectedClassId, setSelectedClassId] = useState<string>(product.classes[0]?.id || '');

    const handleEnroll = () => {
        if (!selectedClassId) {
            alert('Por favor, selecione uma turma.');
            return;
        }
        onEnroll(student.id, product.id, selectedClassId);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Matrícula</h2>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Aluno</label>
                        <p className="text-gray-800 dark:text-white font-semibold">{student.name}</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Curso</label>
                        <p className="text-gray-800 dark:text-white font-semibold">{product.name}</p>
                    </div>
                    <div>
                        <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione a Turma</label>
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
                        onClick={handleEnroll}
                        type="button"
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        Confirmar Matrícula
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewEnrollmentModal;
