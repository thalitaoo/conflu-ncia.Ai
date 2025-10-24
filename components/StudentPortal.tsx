import React from 'react';
import { Student, Product, EnrollmentStatus } from '../types';

interface StudentPortalProps {
    student: Student;
    products: Product[];
}

const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.523.074-.797.347-.272.272-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>

const handleWhatsAppClick = (studentName: string, productName: string) => {
    // TODO: Substitua pelo seu número de WhatsApp com código do país (ex: 5511912345678)
    const phoneNumber = "5511912345678"; 
    const message = encodeURIComponent(`Olá! Tenho interesse em matricular ${studentName} no curso "${productName}".`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};


const StudentPortal: React.FC<StudentPortalProps> = ({ student, products }) => {
    // Logic to find available courses (same as in StudentProfile)
    const enrolledProductIds = new Set(
        student.enrollments
        .filter(e => e.enrollmentStatus === EnrollmentStatus.Active || e.enrollmentStatus === EnrollmentStatus.Completed)
        .map(e => e.productId)
    );

    const reEnrollProductIds = new Set(
        student.enrollments
            .filter(e => e.enrollmentStatus === EnrollmentStatus.Cancelled || e.enrollmentStatus === EnrollmentStatus.NoShow)
            .map(e => e.productId)
    );
    
    const availableProducts = products.filter(p => !enrolledProductIds.has(p.id));
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
             <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portal de {student.name}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Bem-vindo(a) ao seu portal de cursos. Aqui você pode ver suas matrículas e descobrir novas oportunidades.</p>
                </header>

                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Minhas Matrículas</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-3">
                        {student.enrollments.length > 0 ? student.enrollments.map(enrollment => {
                             const product = products.find(p => p.id === enrollment.productId);
                             if (!product) return null;
                             return (
                                 <div key={enrollment.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                     <p className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</p>
                                     <p className="text-sm text-gray-600 dark:text-gray-400">Status: {enrollment.enrollmentStatus}</p>
                                 </div>
                             )
                        }) : (
                             <p className="text-center text-gray-500 dark:text-gray-400 py-4">Você ainda não possui matrículas.</p>
                        )}
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Cursos Disponíveis</h2>
                    <div className="space-y-4">
                        {availableProducts.length > 0 ? availableProducts.map(product => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 p-6 border dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center shadow-lg">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white flex items-center text-lg">
                                        {product.name}
                                        {reEnrollProductIds.has(product.id) && (
                                            <span className="ml-3 text-xs font-semibold bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full">
                                                Reinscrever
                                            </span>
                                        )}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-lg">{product.description}</p>
                                </div>
                                <button
                                    onClick={() => handleWhatsAppClick(student.name, product.name)}
                                    className="mt-4 sm:mt-0 sm:ml-4 px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 flex-shrink-0 inline-flex items-center"
                                >
                                    <WhatsAppIcon />
                                    <span className="ml-2">Estou Interessado</span>
                                </button>
                            </div>
                        )) : (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                                <p className="text-gray-500 dark:text-gray-400">Parabéns! Você já se matriculou em todos os nossos cursos. Fique de olho para novidades!</p>
                            </div>
                        )}
                    </div>
                </div>

             </div>
        </div>
    );
};

export default StudentPortal;