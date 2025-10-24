
import React, { useState } from 'react';
// FIX: Import View from types.ts and remove the local definition.
import { Product, Student, EnrollmentStatus, CourseClass, View } from '../types';
import QRCodeModal from './QRCodeModal';
import ShareModal from './ShareModal';

interface ProductDetailProps {
    product: Product;
    students: Student[];
    setView: (view: View) => void;
    // FIX: Update prop signature to match the handler in App.tsx.
    onUpdateAttendance: (studentId: string, enrollmentId: string, sessionIndex: number, newAttendance: boolean) => void;
    onUpdateEnrollmentStatus: (studentId: string, enrollmentId: string, newStatus: EnrollmentStatus) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, students, setView, onUpdateAttendance, onUpdateEnrollmentStatus }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    
    const productEnrollments = students.flatMap(s =>
        s.enrollments
            .filter(e => e.productId === product.id)
            .map(e => ({ ...e, studentName: s.name, studentId: s.id }))
    );

    const shareUrl = `${window.location.origin}${window.location.pathname}#product/${product.id}`;

    const getStatusColor = (status: EnrollmentStatus) => {
        switch(status) {
            case EnrollmentStatus.Active: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case EnrollmentStatus.Completed: return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case EnrollmentStatus.Cancelled: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            case EnrollmentStatus.NoShow: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6">
            <button onClick={() => setView({ type: 'dashboard' })} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">&larr; Voltar ao Dashboard</button>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{product.description}</p>
                    </div>
                    <button 
                        onClick={() => setShowShareModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        Compartilhar Link Público
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Alunos Matriculados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Turma</th>
                                <th scope="col" className="px-6 py-3">Status da Matrícula</th>
                                <th scope="col" className="px-6 py-3">Presença</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productEnrollments.map(enrollment => {
                                const courseClass = product.classes.find(c => c.id === enrollment.classId);
                                return (
                                <tr key={enrollment.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ type: 'student-profile', id: enrollment.studentId })}} className="text-indigo-600 hover:underline">{enrollment.studentName}</a>
                                    </td>
                                    <td className="px-6 py-4">{courseClass?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(enrollment.enrollmentStatus)}`}>
                                            {enrollment.enrollmentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {enrollment.attendance.map((attended, i) => (
                                                <button 
                                                    key={i} 
                                                    // FIX: Pass the new attendance status (toggling the current one).
                                                    onClick={() => onUpdateAttendance(enrollment.studentId, enrollment.id, i, !attended)}
                                                    className={`w-5 h-5 rounded-full border-2 ${attended ? 'bg-green-500 border-green-600' : 'bg-gray-200 border-gray-400 dark:bg-gray-600 dark:border-gray-500'}`}
                                                    title={`Sessão ${i + 1}: ${attended ? 'Presente' : 'Ausente'}`}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={enrollment.enrollmentStatus} 
                                            onChange={(e) => onUpdateEnrollmentStatus(enrollment.studentId, enrollment.id, e.target.value as EnrollmentStatus)}
                                            className="text-xs p-1 rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {Object.values(EnrollmentStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                 {productEnrollments.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Nenhum aluno matriculado neste produto ainda.</p>}
            </div>

            {showShareModal && <ShareModal shareUrl={shareUrl} onClose={() => setShowShareModal(false)} />}
        </div>
    );
};

export default ProductDetail;
