
import React, { useState } from 'react';
import { Product, Student, Enrollment } from '../types';
import AIEnrollmentAssistant from './AIEnrollmentAssistant';
import EnrollmentForm from './EnrollmentForm';

interface EnrollmentPageProps {
    products: Product[];
    onRegisterStudent: (data: Omit<Student, 'id' | 'enrollments'> & { enrollment: Omit<Enrollment, 'id' | 'attendance'> }) => void;
}

const EnrollmentPage: React.FC<EnrollmentPageProps> = ({ products, onRegisterStudent }) => {
    const [extractedData, setExtractedData] = useState<any | null>(null);

    const handleEnrollmentDataExtracted = (data: any) => {
        setExtractedData(data);
    };
    
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
                    <EnrollmentForm
                        products={products}
                        onRegisterStudent={onRegisterStudent}
                        initialData={extractedData}
                    />
                </div>
            </div>
        </div>
    );
};

export default EnrollmentPage;
