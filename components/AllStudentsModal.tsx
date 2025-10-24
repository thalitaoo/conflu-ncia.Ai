
import React, { useState } from 'react';
import { Student, View } from '../types';

interface AllStudentsModalProps {
    students: Student[];
    onClose: () => void;
    setView: (view: View) => void;
}

const AllStudentsModal: React.FC<AllStudentsModalProps> = ({ students, onClose, setView }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students
        .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    const handleStudentClick = (studentId: string) => {
        setView({ type: 'student-profile', id: studentId });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Todos os Alunos ({students.length})</h2>
                </div>
                <div className="p-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="p-6 pt-0 overflow-y-auto">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredStudents.map(student => (
                            <li key={student.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                                </div>
                                <button
                                    onClick={() => handleStudentClick(student.id)}
                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    Ver Perfil
                                </button>
                            </li>
                        ))}
                    </ul>
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

export default AllStudentsModal;
