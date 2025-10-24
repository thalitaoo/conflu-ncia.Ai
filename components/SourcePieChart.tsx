
import React from 'react';
import { Student, Source } from '../types';

interface SourcePieChartProps {
    students: Student[];
}

const sourceColors: { [key in Source]: string } = {
    [Source.Site]: '#4F46E5',
    [Source.WhatsApp]: '#10B981',
    [Source.Instagram]: '#EC4899',
    [Source.Link]: '#3B82F6',
    [Source.Formulario]: '#F59E0B',
    [Source.InCompany]: '#8B5CF6',
};

const PieChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-48">
                <p className="text-gray-500 dark:text-gray-400">Sem dados para exibir.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <svg viewBox="-1 -1 2 2" className="w-48 h-48 transform -rotate-90">
                {data.map(item => {
                    const percent = item.value / total;
                    const [startX, startY] = getCoordinatesForPercent(cumulative);
                    cumulative += percent;
                    const [endX, endY] = getCoordinatesForPercent(cumulative);
                    const largeArcFlag = percent > 0.5 ? 1 : 0;

                    return (
                        <path
                            key={item.name}
                            d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`}
                            fill={item.color}
                        />
                    );
                })}
            </svg>
            <div className="flex-1 space-y-2 w-full">
                {data.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">{item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const SourcePieChart: React.FC<SourcePieChartProps> = ({ students }) => {
    // FIX: Explicitly type the accumulator's initial value to ensure `acc` is a Record<Source, number>
    const sourceCounts = students.flatMap(s => s.enrollments).reduce((acc: Record<Source, number>, enrollment) => {
        acc[enrollment.source] = (acc[enrollment.source] || 0) + 1;
        return acc;
    }, {} as Record<Source, number>);

    const chartData = Object.entries(sourceCounts).map(([source, count]) => ({
        name: source,
        value: count,
        color: sourceColors[source as Source],
    })).sort((a,b) => b.value - a.value);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Fonte de Matrículas</h3>
            <PieChart data={chartData} />
        </div>
    );
};

export default SourcePieChart;
