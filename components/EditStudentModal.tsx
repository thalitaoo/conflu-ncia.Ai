
import React, { useState } from 'react';
import { Student } from '../types';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
    onUpdateStudent: (studentId: string, updatedData: Partial<Omit<Student, 'id' | 'enrollments'>>) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose, onUpdateStudent }) => {
    const [formData, setFormData] = useState({
        name: student.name,
        email: student.email,
        companyName: student.companyName || '',
        jobTitle: student.jobTitle || '',
        phone: student.phone || '',
        address: student.address || '',
        location: student.location || '',
        notes: student.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateStudent(student.id, formData);
        onClose();
    };
    
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";


    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil do Aluno</h2>
                    </div>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="name" className={labelStyle}>Nome</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="email" className={labelStyle}>Email</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputStyle} />
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="companyName" className={labelStyle}>Empresa</label>
                                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="jobTitle" className={labelStyle}>Cargo</label>
                                <input type="text" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className={inputStyle} />
                            </div>
                         </div>
                          <div>
                            <label htmlFor="phone" className={labelStyle}>Telefone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="location" className={labelStyle}>Localidade (Cidade/UF)</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="address" className={labelStyle}>Endereço</label>
                            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="notes" className={labelStyle}>Notas Internas</label>
                            <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputStyle}></textarea>
                        </div>
                    </div>
                     <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;