import React from 'react';
import { View } from '../types';

interface SidebarProps {
    setView: (view: View) => void;
    onLogout: () => void;
    onGenerateInsights: () => void;
}

const NavItem: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
    >
        {children}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ setView, onLogout, onGenerateInsights }) => {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col shadow-lg">
            <div className="flex-shrink-0 mb-8">
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">conflua.ai</h1>
            </div>
            <nav className="flex-1 space-y-2">
                <NavItem onClick={() => setView({ type: 'dashboard' })}>Dashboard</NavItem>
                <NavItem onClick={() => setView({ type: 'enrollment' })}>Nova Matrícula</NavItem>
                <NavItem onClick={() => setView({ type: 'turmas' })}>Turmas</NavItem>
                <NavItem onClick={() => setView({ type: 'financials' })}>Financeiro</NavItem>
                 <button
                    onClick={onGenerateInsights}
                    className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Gerar Insights com IA
                </button>
            </nav>
            <div className="mt-auto">
                <NavItem onClick={onLogout}>Sair</NavItem>
            </div>
        </aside>
    );
};

export default Sidebar;