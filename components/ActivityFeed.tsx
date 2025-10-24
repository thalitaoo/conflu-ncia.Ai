
import React from 'react';
import { ActivityLogEntry } from '../types';

interface ActivityFeedProps {
    log: ActivityLogEntry[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ log }) => {
    const sortedLog = [...log].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Feed de Atividades</h3>
            <ul className="space-y-4">
                {sortedLog.slice(0, 15).map(entry => (
                    <li key={entry.id} className="flex items-start">
                        <div className="flex-shrink-0">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
                                {entry.studentName ? entry.studentName.charAt(0).toUpperCase() : 'S'}
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{__html: entry.description}}></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {new Date(entry.timestamp).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityFeed;
