
import React, { useState } from 'react';
// FIX: Import View from types.ts and remove the local definition.
import { Student, Product, EnrollmentStatus, CertificateStatus, View } from '../types';
import CertificateModal from './CertificateModal';
import NewEnrollmentModal from './NewEnrollmentModal';
import EditStudentModal from './EditStudentModal';

interface StudentProfileProps {
    student: Student;
    products: Product[];
    setView: (view: View) => void;
    onUpdateStudentProfile: (studentId: string, updatedData: Partial<Omit<Student, 'id' | 'enrollments'>>) => void;
    onEnrollInNewCourse: (studentId: string, productId: string, classId: string) => void;
    onIssueCertificate: (studentId: string, enrollmentId: string) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, products, setView, onUpdateStudentProfile, onEnrollInNewCourse, onIssueCertificate }) => {
    const [certModal, setCertModal] = useState<{ isOpen: boolean, enrollment: any | null }>({ isOpen: false, enrollment: null });
    const [enrollModal, setEnrollModal] = useState<{ isOpen: boolean, product: Product | null }>({ isOpen: false, product: null });
    const [editModalOpen, setEditModalOpen] = useState(false);

    const completedEnrolledProductIds = new Set(
        student.enrollments
        .filter(e => e.enrollmentStatus === EnrollmentStatus.Completed)
        .map(e => e.productId)
    );
    const otherEnrolledProductIds = new Set(
         student.enrollments
        .filter(e => e.enrollmentStatus !== EnrollmentStatus.Completed)
        .map(e => e.productId)
    );

    const availableProducts = products.filter(p => !completedEnrolledProductIds.has(p.id) && !otherEnrolledProductIds.has(p.id));

    const reEnrollableProducts = products.filter(p => 
        !completedEnrolledProductIds.has(p.id) && 
        student.enrollments.some(e => e.productId === p.id && (e.enrollmentStatus === EnrollmentStatus.Cancelled || e.enrollmentStatus === EnrollmentStatus.NoShow))
    );
    
    const getStatusColor = (status: EnrollmentStatus) => {
        switch(status) {
            case EnrollmentStatus.Active: return 'border-blue-500';
            case EnrollmentStatus.Completed: return 'border-green-500';
            case EnrollmentStatus.Cancelled: return 'border-red-500';
            case EnrollmentStatus.NoShow: return 'border-yellow-500';
            default: return 'border-gray-500';
        }
    };

    const calculatePresence = (attendance: boolean[]) => {
        if (!attendance || attendance.length === 0) return 0;
        const attended = attendance.filter(Boolean).length;
        return (attended / attendance.length) * 100;
    };
    
    return (
        <div className="space-y-6">
            <button onClick={() => setView({ type: 'dashboard' })} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">&larr; Voltar</button>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                            {student.name.charAt(0)}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">{student.email}</p>
                        <button onClick={() => setEditModalOpen(true)} className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Editar Perfil</button>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Detalhes Pessoais e Profissionais</h2>
                        <div className="space-y-3 text-sm">
                            <p><strong className="text-gray-600 dark:text-gray-400 font-medium">Telefone:</strong> {student.phone || 'N/A'}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400 font-medium">Empresa:</strong> {student.companyName || 'N/A'}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400 font-medium">Cargo:</strong> {student.jobTitle || 'N/A'}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400 font-medium">Localidade:</strong> {student.location || 'N/A'}</p>
                            <p><strong className="text-gray-600 dark:text-gray-400 font-medium">Endereço:</strong> {student.address || 'N/A'}</p>
                        </div>
                    </div>
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Notas Internas</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{student.notes || 'Nenhuma nota.'}</p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Histórico de Matrículas</h2>
                        <div className="space-y-4">
                            {student.enrollments.map(enrollment => {
                                const product = products.find(p => p.id === enrollment.productId);
                                if (!product) return null;
                                const presencePercentage = calculatePresence(enrollment.attendance);
                                const isEligibleForCert = presencePercentage >= 80 && enrollment.enrollmentStatus === EnrollmentStatus.Completed;

                                return (
                                    <div key={enrollment.id} className={`p-4 rounded-lg border-l-4 ${getStatusColor(enrollment.enrollmentStatus)} bg-gray-50 dark:bg-gray-700/50`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800 dark:text-gray-200">{product.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Status: {enrollment.enrollmentStatus} | Pagamento: {enrollment.paymentStatus}</p>
                                            </div>
                                            <div>
                                                {isEligibleForCert && enrollment.certificateStatus !== CertificateStatus.Issued && (
                                                     <button onClick={() => onIssueCertificate(student.id, enrollment.id)} className="text-xs text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded-md">Emitir Certificado</button>
                                                )}
                                                {enrollment.certificateStatus === CertificateStatus.Issued && (
                                                     <button onClick={() => setCertModal({ isOpen: true, enrollment })} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">Ver Certificado</button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Presença ({presencePercentage.toFixed(0)}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${presencePercentage}%` }}></div>
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                {enrollment.attendance.map((att, i) => <div key={i} className={`w-4 h-4 rounded-sm ${att ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-500'}`} title={`Sessão ${i+1}: ${att ? 'Presente' : 'Ausente'}`}></div>)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                             {student.enrollments.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma matrícula encontrada.</p>}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Cursos Disponíveis para Matrícula</h2>
                         <div className="space-y-3">
                            {[...availableProducts, ...reEnrollableProducts].map(product => (
                                <div key={product.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                                            {product.name}
                                            {reEnrollableProducts.some(p => p.id === product.id) && (
                                                <span className="ml-2 text-xs font-semibold bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full">Reinscrever</span>
                                            )}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.description}</p>
                                    </div>
                                    <button onClick={() => setEnrollModal({ isOpen: true, product })} className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md flex-shrink-0">Matricular</button>
                                </div>
                            ))}
                            {availableProducts.length === 0 && reEnrollableProducts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Nenhum curso disponível no momento.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {certModal.isOpen && certModal.enrollment && <CertificateModal student={student} product={products.find(p=>p.id === certModal.enrollment.productId)!} onClose={() => setCertModal({ isOpen: false, enrollment: null })} />}
            {enrollModal.isOpen && enrollModal.product && <NewEnrollmentModal student={student} product={enrollModal.product} onClose={() => setEnrollModal({ isOpen: false, product: null })} onEnroll={onEnrollInNewCourse} />}
            {editModalOpen && <EditStudentModal student={student} onClose={() => setEditModalOpen(false)} onUpdateStudent={onUpdateStudentProfile} />}
        </div>
    );
};

export default StudentProfile;
