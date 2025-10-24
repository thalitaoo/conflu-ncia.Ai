import React, { useState } from 'react';
import { Product, CourseClass, Student, View } from '../types';
import EditClassModal from './EditClassModal';
import QRCodeModal from './QRCodeModal';

interface TurmaDetailProps {
    product: Product;
    courseClass: CourseClass;
    students: Student[];
    setView: (view: View) => void;
    onUpdateClass: (updatedClass: CourseClass, productId: string) => void;
    onBatchIssueCertificates: (classId: string, productId: string) => void;
}

const TurmaDetail: React.FC<TurmaDetailProps> = ({ product, courseClass, students, setView, onUpdateClass, onBatchIssueCertificates }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const isCourseFinished = new Date(courseClass.date) < new Date();
    
    const qrData = JSON.stringify({
        productId: product.id,
        classId: courseClass.id,
        sessionDate: new Date().toISOString().split('T')[0], // Just the date
    });

    return (
        <div className="space-y-6">
            <button onClick={() => setView({ type: 'turmas' })} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">&larr; Voltar para Turmas</button>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{courseClass.name}</h1>
                        <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">{product.name}</p>
                        <p className="mt-2 text-gray-500 dark:text-gray-300">
                            Início: {new Date(courseClass.date).toLocaleString('pt-BR')} | Sessões: {courseClass.totalSessions} | Local: {courseClass.location || 'N/A'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-shrink-0">
                         <button 
                            onClick={() => setIsQRModalOpen(true)}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                        >
                            Gerar QR de Presença
                        </button>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                        >
                            Editar Turma
                        </button>
                        {isCourseFinished && (
                             <button 
                                onClick={() => onBatchIssueCertificates(courseClass.id, product.id)}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                            >
                                Emitir Certificados para Aptos
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Alunos Inscritos ({students.length})</h2>
                <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Status do Pagamento</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => {
                                const enrollment = student.enrollments.find(e => e.classId === courseClass.id);
                                return (
                                <tr key={student.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4">{student.email}</td>
                                    <td className="px-6 py-4">{enrollment?.paymentStatus}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setView({ type: 'student-profile', id: student.id })} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Ver Perfil</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                 {students.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">Nenhum aluno inscrito nesta turma.</p>}
            </div>

            {isEditModalOpen && <EditClassModal product={product} courseClass={courseClass} onClose={() => setIsEditModalOpen(false)} onEditClass={onUpdateClass} />}
            {isQRModalOpen && <QRCodeModal title="QR Code de Presença da Turma" qrData={qrData} description="Alunos devem escanear este código para registrar a presença na sessão de hoje." onClose={() => setIsQRModalOpen(false)} />}
        </div>
    );
};

export default TurmaDetail;