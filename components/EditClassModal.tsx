
import React, { useState } from 'react';
import { Product, CourseClass } from '../types';

interface EditClassModalProps {
    product: Product;
    courseClass: CourseClass;
    onClose: () => void;
    onEditClass: (updatedClass: CourseClass, productId: string) => void;
}

const EditClassModal: React.FC<EditClassModalProps> = ({ product, courseClass, onClose, onEditClass }) => {
    const [className, setClassName] = useState(courseClass.name);
    // Format date from ISO to 'yyyy-MM-ddThh:mm' for the datetime-local input
    const [date, setDate] = useState(new Date(new Date(courseClass.date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    const [totalSessions, setTotalSessions] = useState(courseClass.totalSessions);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedClass = {
            ...courseClass,
            name: className,
            date: new Date(date).toISOString(),
            totalSessions,
        };
        onEditClass(updatedClass, product.id);
        onClose();
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Turma</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Curso</label>
                            <p className="text-gray-800 dark:text-white font-semibold">{product.name}</p>
                        </div>
                        <div>
                            <label htmlFor="className" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Turma</label>
                            <input type="text" id="className" value={className} onChange={(e) => setClassName(e.target.value)} required className={inputStyle} />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Início</label>
                                <input type="datetime-local" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="totalSessions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total de Sessões</label>
                                <input type="number" id="totalSessions" value={totalSessions} onChange={(e) => setTotalSessions(Number(e.target.value))} min="1" required className={inputStyle} />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                         <button onClick={onClose} type="button" className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-500">
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClassModal;
