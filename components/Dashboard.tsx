
import React, { useState, useMemo } from 'react';
import { Product, Student, View, ActivityLogEntry, EnrollmentStatus, PaymentStatus, Enrollment } from '../types';
import MetricCard from './MetricCard';
import CourseBarChart from './CourseBarChart';
import EnrollmentStatusPieChart from './EnrollmentStatusPieChart';
import ActivityFeed from './ActivityFeed';
import AllStudentsModal from './AllStudentsModal';
import OpenClassesModal from './OpenClassesModal';
import StudentsToReEnrollModal from './StudentsToReEnrollModal';
import PromotionalWhatsAppButton from './PromotionalWhatsAppButton';

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;


interface DashboardProps {
    products: Product[];
    students: Student[];
    setView: (view: View) => void;
    activityLog: ActivityLogEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, students, setView, activityLog }) => {
    const [isAllStudentsModalOpen, setAllStudentsModalOpen] = useState(false);
    const [isOpenClassesModalOpen, setOpenClassesModalOpen] = useState(false);
    const [isReEnrollModalOpen, setReEnrollModalOpen] = useState(false);
    
    const totalStudents = students.length;
    const totalCourses = products.length;
    
    const pendingRevenue = students
        .flatMap(s => s.enrollments)
        .filter(e => e.paymentStatus === PaymentStatus.Pending)
        .map(e => products.find(p => p.id === e.productId)?.price || 0)
        .reduce((sum, price) => sum + price, 0);

    const studentsToReEnroll = useMemo(() => {
        const result: { student: Student; enrollment: Enrollment; product: Product | undefined }[] = [];
        students.forEach(student => {
            student.enrollments.forEach(enrollment => {
                if (enrollment.paymentStatus === PaymentStatus.Paid && enrollment.enrollmentStatus === EnrollmentStatus.NoShow) {
                    const product = products.find(p => p.id === enrollment.productId);
                    result.push({ student, enrollment, product });
                }
            });
        });
        return result;
    }, [students, products]);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Bem-vindo(a) ao painel de controle da conflua.ai.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Total de Alunos" value={totalStudents.toString()} icon={<UsersIcon />} />
                <MetricCard title="Cursos Ativos" value={totalCourses.toString()} icon={<BookOpenIcon />} />
                <MetricCard title="Receita Pendente" value={pendingRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} icon={<ClockIcon />} />
                {studentsToReEnroll.length > 0 && (
                    <button onClick={() => setReEnrollModalOpen(true)} className="bg-amber-100 dark:bg-amber-900/50 p-6 rounded-lg shadow-lg flex items-center space-x-4 text-left">
                        <div className="bg-amber-200 dark:bg-amber-800/50 p-3 rounded-full text-amber-600 dark:text-amber-300">
                             <AlertTriangleIcon />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Re-matrículas Pendentes</p>
                            <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">{studentsToReEnroll.length}</p>
                        </div>
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-4">
                 <button onClick={() => setAllStudentsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Ver Todos os Alunos</button>
                 <button onClick={() => setOpenClassesModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Ver Turmas Abertas</button>
                 <PromotionalWhatsAppButton products={products} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CourseBarChart products={products} students={students} />
                <EnrollmentStatusPieChart students={students} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <ActivityFeed log={activityLog} />
            </div>

            {isAllStudentsModalOpen && <AllStudentsModal students={students} onClose={() => setAllStudentsModalOpen(false)} setView={setView} />}
            {isOpenClassesModalOpen && <OpenClassesModal products={products} onClose={() => setOpenClassesModalOpen(false)} setView={setView} />}
            {isReEnrollModalOpen && <StudentsToReEnrollModal studentsToReEnroll={studentsToReEnroll} onClose={() => setReEnrollModalOpen(false)} setView={setView} />}
        </div>
    );
};

export default Dashboard;
