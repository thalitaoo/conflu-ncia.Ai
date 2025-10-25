import React, { useState } from 'react';
import { Student, Product, EnrollmentStatus, CertificateStatus, Enrollment, AttendanceRecord } from '../types';
import CertificateModal from './CertificateModal';
import NewEnrollmentModal from './NewEnrollmentModal';

interface StudentDashboardProps {
    student: Student;
    products: Product[];
    onLogout: () => void;
    onEnrollInNewCourse: (studentId: string, productId: string, classId: string) => void;
}

const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.523.074-.797.347-.272.272-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>;

const handleWhatsAppClick = (studentName: string, productName: string) => {
    const phoneNumber = "5511912345678"; 
    const message = encodeURIComponent(`Olá! Como aluno(a), tenho interesse no curso "${productName}".`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, products, onLogout, onEnrollInNewCourse }) => {
    const [enrollModal, setEnrollModal] = useState<{ isOpen: boolean, product: Product | null }>({ isOpen: false, product: null });
    const [certModal, setCertModal] = useState<{ isOpen: boolean, enrollment: Enrollment | null }>({ isOpen: false, enrollment: null });
    
    const getProductById = (id: string) => products.find(p => p.id === id);

    const calculatePresence = (attendance: AttendanceRecord[]) => {
        if (!attendance || attendance.length === 0) return { percentage: 0, text: '0/0' };
        const attended = attendance.filter(att => att.status).length;
        const total = attendance.length;
        return {
            percentage: total > 0 ? (attended / total) * 100 : 0,
            text: `${attended}/${total}`
        };
    };

    const enrolledProductIds = new Set(student.enrollments.map(e => e.productId));
    const availableProducts = products.filter(p => !enrolledProductIds.has(p.id));

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Portal do Aluno</h1>
                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bem-vindo(a), {student.name}!</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Acompanhe seu progresso e explore novas oportunidades de aprendizado.</p>
                </div>
                
                <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Minhas Matrículas</h3>
                    <div className="space-y-4">
                        {student.enrollments.length > 0 ? student.enrollments.map(enrollment => {
                            const product = getProductById(enrollment.productId);
                            if (!product) return null;
                            const presence = calculatePresence(enrollment.attendance);
                            const isEligibleForCert = presence.percentage >= 80 && enrollment.enrollmentStatus === EnrollmentStatus.Completed;

                            const renderCertificateAction = () => {
                                if (enrollment.certificateStatus === CertificateStatus.Issued) {
                                    return (
                                        <button 
                                            onClick={() => setCertModal({ isOpen: true, enrollment })}
                                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 w-full sm:w-auto"
                                        >
                                            Ver Certificado
                                        </button>
                                    );
                                }
                                if (isEligibleForCert) {
                                    return (
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Parabéns! Você está apto(a) a receber o certificado.</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">O certificado será emitido em breve.</p>
                                        </div>
                                    );
                                }
                                return null;
                            };

                            let sessionInfo: { label: string; date: Date } | null = null;
                            if (enrollment.enrollmentStatus === EnrollmentStatus.Active) {
                                const courseClass = product.classes.find(c => c.id === enrollment.classId);
                                if (courseClass) {
                                    const now = new Date();
                                    const startDate = new Date(courseClass.date);
                                    const sessionDates = Array.from({ length: courseClass.totalSessions }, (_, i) => {
                                        const date = new Date(startDate);
                                        date.setDate(date.getDate() + 7 * i); // Assuming weekly classes
                                        return date;
                                    });

                                    const nextSession = sessionDates.find(d => d > now);
                                    if (nextSession) {
                                        sessionInfo = { label: 'Próxima Aula', date: nextSession };
                                    } else if (sessionDates.length > 0) {
                                        const lastSession = sessionDates[sessionDates.length - 1];
                                        sessionInfo = { label: 'Última Aula', date: lastSession };
                                    }
                                }
                            }

                            return (
                                <div key={enrollment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <span>Status: <span className="font-semibold">{enrollment.enrollmentStatus}</span></span>
                                                <span>|</span>
                                                <span>Certificado: <span className="font-semibold">{enrollment.certificateStatus}</span></span>
                                            </div>
                                        </div>
                                        {renderCertificateAction()}
                                    </div>

                                    {sessionInfo && (
                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">{sessionInfo.label}:</span> {sessionInfo.date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Presença ({presence.text})</span>
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{presence.percentage.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${presence.percentage}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                                <p className="text-gray-500 dark:text-gray-400">Você ainda não está matriculado em nenhum curso.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Cursos Disponíveis</h3>
                    <div className="space-y-4">
                        {availableProducts.length > 0 ? availableProducts.map(product => (
                            <div key={product.id} className="bg-white dark:bg-gray-800 p-6 border dark:border-gray-700 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center shadow-lg gap-4">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white text-lg">{product.name}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-lg">{product.description}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => setEnrollModal({ isOpen: true, product })}
                                        className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 flex-shrink-0"
                                    >
                                        Inscrever-se Agora
                                    </button>
                                    <button
                                        onClick={() => handleWhatsAppClick(student.name, product.name)}
                                        className="px-5 py-2.5 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 flex-shrink-0 inline-flex items-center justify-center"
                                    >
                                        <WhatsAppIcon />
                                        <span className="ml-2">Tenho Interesse</span>
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                                <p className="text-gray-500 dark:text-gray-400">Parabéns! Você já se matriculou em todos os nossos cursos disponíveis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {enrollModal.isOpen && enrollModal.product && 
                <NewEnrollmentModal 
                    student={student} 
                    product={enrollModal.product} 
                    onClose={() => setEnrollModal({ isOpen: false, product: null })} 
                    onEnroll={(studentId, productId, classId) => {
                        onEnrollInNewCourse(studentId, productId, classId);
                        setEnrollModal({isOpen: false, product: null});
                    }} 
                />
            }
            {certModal.isOpen && certModal.enrollment && 
                <CertificateModal 
                    student={student} 
                    product={getProductById(certModal.enrollment.productId)!} 
                    onClose={() => setCertModal({ isOpen: false, enrollment: null })} 
                />
            }
        </div>
    );
};

export default StudentDashboard;