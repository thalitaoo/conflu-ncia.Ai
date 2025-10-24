import React, { useState } from 'react';
import { Student, Product, EnrollmentStatus, CertificateStatus } from '../types';
import CertificateModal from './CertificateModal';

interface StudentDashboardProps {
    student: Student;
    products: Product[];
    onLogout: () => void;
}

const WhatsAppIcon = () => <svg xmlns="http://www.w.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.523.074-.797.347-.272.272-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>;

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, products, onLogout }) => {
    const [view, setView] = useState<'main' | 'certificates'>('main');
    const [certModal, setCertModal] = useState<{ isOpen: boolean, product: Product | null }>({ isOpen: false, product: null });

    const issuedCertificates = student.enrollments.filter(e => e.certificateStatus === CertificateStatus.Issued);
    
    const handleWhatsAppClick = (productName: string) => {
        const phoneNumber = "5511912345678"; 
        const message = encodeURIComponent(`Olá! Tenho interesse no curso "${productName}".`);
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };
    
    const enrolledProductIds = new Set(student.enrollments.map(e => e.productId));
    const availableProducts = products.filter(p => !enrolledProductIds.has(p.id));

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portal de {student.name}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">Bem-vindo(a)! Gerencie seus cursos e certificados.</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        Sair
                    </button>
                </header>

                {view === 'main' && (
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                             <button onClick={() => setView('certificates')} className="flex-1 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Visualizar Certificados</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Veja todas as suas conquistas.</p>
                            </button>
                             {/* Add more dashboard cards here if needed */}
                        </div>

                         <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Minhas Matrículas</h2>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-3">
                                {student.enrollments.length > 0 ? student.enrollments.map(enrollment => {
                                     const product = products.find(p => p.id === enrollment.productId);
                                     if (!product) return null;
                                     return (
                                         <div key={enrollment.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                             <p className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</p>
                                             <p className="text-sm text-gray-600 dark:text-gray-400">Status: {enrollment.enrollmentStatus} | Pagamento: {enrollment.paymentStatus}</p>
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
                                {availableProducts.map(product => (
                                    <div key={product.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center shadow-lg">
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-white text-lg">{product.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-lg">{product.description}</p>
                                        </div>
                                        <button onClick={() => handleWhatsAppClick(product.name)} className="mt-4 sm:mt-0 sm:ml-4 px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 flex-shrink-0 inline-flex items-center">
                                            <WhatsAppIcon /> <span className="ml-2">Estou Interessado</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {view === 'certificates' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <button onClick={() => setView('main')} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-4">&larr; Voltar</button>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Meus Certificados</h2>
                        <div className="space-y-3">
                            {issuedCertificates.length > 0 ? issuedCertificates.map(enrollment => {
                                 const product = products.find(p => p.id === enrollment.productId);
                                 if (!product) return null;
                                 return (
                                    <div key={enrollment.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center">
                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</p>
                                        <button onClick={() => setCertModal({ isOpen: true, product })} className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md">Visualizar</button>
                                    </div>
                                 );
                            }) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">Você ainda não possui certificados.</p>}
                        </div>
                    </div>
                )}

            </div>
            {certModal.isOpen && certModal.product && <CertificateModal student={student} product={certModal.product} onClose={() => setCertModal({ isOpen: false, product: null })} />}
        </div>
    );
};

export default StudentDashboard;