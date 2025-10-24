import React, { useState } from 'react';
import { Product, Source, PaymentMethod, PaymentStatus, CertificateStatus, EnrollmentStatus } from '../types';

interface RegistrationPageProps {
    product: Product;
    onRegisterStudent: (data: any) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ product, onRegisterStudent }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        companyName: '',
        classId: product.classes[0]?.id || '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const enrollmentData = {
            productId: product.id,
            classId: formData.classId,
            enrollmentDate: new Date().toISOString(),
            source: Source.Link,
            paymentMethod: PaymentMethod.Pix, // Default for public link
            paymentStatus: PaymentStatus.Pending,
            enrollmentStatus: EnrollmentStatus.Active,
            certificateStatus: CertificateStatus.NotIssued,
            isCorporatePurchase: false,
        };

        const studentData = {
            name: formData.name,
            email: formData.email,
            companyName: formData.companyName,
            enrollment: enrollmentData
        };

        onRegisterStudent(studentData);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
             <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Inscrição Recebida!</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Obrigado por se inscrever em <strong>{product.name}</strong>. Em breve você receberá um email com a confirmação e os próximos passos.
                    </p>
                    <a href="#" onClick={() => window.location.hash = ''} className="w-full inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Voltar à Página Principal
                    </a>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{product.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empresa (Opcional)</label>
                        <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Escolha a Turma</label>
                        <select name="classId" id="classId" value={formData.classId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            {product.classes.map(c => <option key={c.id} value={c.id}>{c.name} - {new Date(c.date).toLocaleDateString('pt-BR')}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Confirmar Inscrição
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;