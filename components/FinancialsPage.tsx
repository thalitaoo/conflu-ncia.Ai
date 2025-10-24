import React from 'react';
import { Product, Student, PaymentStatus } from '../types';

interface FinancialsPageProps {
    products: Product[];
    students: Student[];
}

const FinancialsPage: React.FC<FinancialsPageProps> = ({ products, students }) => {

    const allEnrollments = students.flatMap(s => s.enrollments.map(e => ({
        ...e,
        studentName: s.name,
        product: products.find(p => p.id === e.productId)
    })));

    const totalRevenue = allEnrollments
        .filter(e => e.paymentStatus === PaymentStatus.Paid && e.product)
        .reduce((sum, e) => sum + (e.product?.price || 0), 0);

    const pendingRevenue = allEnrollments
        .filter(e => e.paymentStatus === PaymentStatus.Pending && e.product)
        .reduce((sum, e) => sum + (e.product?.price || 0), 0);
        
    const billedRevenue = allEnrollments
        .filter(e => e.paymentStatus === PaymentStatus.Billed && e.product)
        .reduce((sum, e) => sum + (e.product?.price || 0), 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receita Total (Pago)</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receita Pendente</p>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {pendingRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receita Faturada (Corp.)</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {billedRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Detalhes de Transações</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Curso</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                            </tr>
                        </thead>
                         <tbody>
                            {allEnrollments.map(e => (
                                <tr key={e.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{e.studentName}</td>
                                    <td className="px-6 py-4">{e.product?.name}</td>
                                    <td className="px-6 py-4">{e.product?.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="px-6 py-4">{e.paymentStatus}</td>
                                    <td className="px-6 py-4">{new Date(e.enrollmentDate).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinancialsPage;