
import React from 'react';
import { Student, Product } from '../types';

interface CourseBarChartProps {
    students: Student[];
    products: Product[];
}

const courseColors = ['#4F46E5', '#10B981', '#EC4899', '#3B82F6', '#F59E0B', '#8B5CF6'];

const CourseBarChart: React.FC<CourseBarChartProps> = ({ students, products }) => {
    const courseEnrollments = products.map(product => {
        const count = students.flatMap(s => s.enrollments).filter(e => e.productId === product.id).length;
        return { name: product.name, count };
    });

    const maxEnrollments = Math.max(...courseEnrollments.map(c => c.count), 0);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Matrículas por Produto</h3>
            {maxEnrollments > 0 ? (
                <div className="space-y-4">
                    {courseEnrollments.map((course, index) => (
                        <div key={course.name} className="flex items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-1/3 truncate">{course.name}</span>
                            <div className="w-2/3 bg-gray-200 rounded-full h-5 dark:bg-gray-700">
                                <div
                                    className="h-5 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold"
                                    style={{
                                        width: `${maxEnrollments > 0 ? (course.count / maxEnrollments) * 100 : 0}%`,
                                        backgroundColor: courseColors[index % courseColors.length],
                                        minWidth: '20px'
                                    }}
                                >
                                    {course.count}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">Sem matrículas para exibir.</p>
            )}
        </div>
    );
};

export default CourseBarChart;
