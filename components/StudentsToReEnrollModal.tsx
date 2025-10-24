import React from 'react';
import { Student, Product, View, Enrollment } from '../types';

interface StudentsToReEnrollModalProps {
    studentsToReEnroll: { student: Student; enrollment: Enrollment; product: Product | undefined }[];
    onClose: () => void;
    setView: (view: View) => void;
}

const StudentsToReEnrollModal: React.FC<StudentsToReEnrollModalProps> = ({ studentsToReEnroll, onClose, setView }) => {
    
    const handleNavigate = (studentId: string) => {
        setView({ type: 'student-profile', id: studentId });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alunos Pendentes de Re-matrícula</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Estes alunos pagaram por um curso mas não compareceram. Acesse o perfil para reinscrevê-los em uma nova turma.
                    </p>
                </div>
                <div className="p-6 overflow-y-auto">
                    {studentsToReEnroll.length > 0 ? (
                        <ul className="space-y-3">
                            {studentsToReEnroll.map(({ student, product }) => (
                                <li key={student.id + product?.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{student.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Curso Ausente: {product?.name || 'N/A'}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleNavigate(student.id)}
                                        className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md flex-shrink-0"
                                    >
                                        Ver Perfil
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Nenhum aluno pendente no momento.</p>
                    )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-right">
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentsToReEnrollModal;