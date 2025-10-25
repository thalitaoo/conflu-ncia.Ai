import React, { useState } from 'react';
import { Product, Student, Enrollment } from '../types';
import AIEnrollmentAssistant from './AIEnrollmentAssistant';
import EnrollmentForm from './EnrollmentForm';

interface EnrollmentPageProps {
    products: Product[];
    onRegisterStudent: (data: Omit<Student, 'id' | 'enrollments'> & { enrollment: Omit<Enrollment, 'id' | 'attendance'> }) => void;
}

const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ products, onRegisterStudent }) => {
    const [extractedStudents, setExtractedStudents] = useState<any[] | null>(null);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

    const handleEnrollmentDataExtracted = (data: any[]) => {
        setExtractedStudents(data);
        setCurrentStudentIndex(0);
    };

    const handleProcessAndMoveNext = (formData: any) => {
        onRegisterStudent(formData);
        
        const newList = extractedStudents?.filter((_, index) => index !== currentStudentIndex);

        if (newList && newList.length > 0) {
            setExtractedStudents(newList);
            // After removing, the index is reset to 0, so the form will be populated
            // with the data of the new first student in the list.
            setCurrentStudentIndex(0);
        } else {
            // All students have been processed
            setExtractedStudents(null);
        }
    };

    const currentInitialData = extractedStudents ? extractedStudents[currentStudentIndex] : null;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nova Matrícula</h1>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <AIEnrollmentAssistant 
                        products={products}
                        onEnrollmentDataExtracted={handleEnrollmentDataExtracted}
                    />
                </div>
                <div className="lg:col-span-3">
                    {extractedStudents && extractedStudents.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
                            <h4 className="font-semibold text-gray-800 dark:text-white">Alunos Detectados ({extractedStudents.length})</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                Processe um a um. O formulário abaixo foi preenchido com os dados do aluno destacado.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {extractedStudents.map((student, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentStudentIndex(index)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                            index === currentStudentIndex 
                                            ? 'bg-indigo-600 text-white font-semibold ring-2 ring-offset-2 ring-offset-gray-800 ring-indigo-500' 
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {student.studentName || `Aluno ${index + 1}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <EnrollmentForm
                        products={products}
                        onRegisterStudent={handleProcessAndMoveNext}
                        initialData={currentInitialData}
                    />
                </div>
            </div>
        </div>
    );
};

export default EnrollmentPage;