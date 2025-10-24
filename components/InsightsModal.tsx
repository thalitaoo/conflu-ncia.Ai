
import React from 'react';

interface InsightsModalProps {
    insights: string;
    onClose: () => void;
}

// A very simple markdown-to-HTML parser.
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
    const formatText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
            .replace(/^- (.*)/gm, '<li class="ml-4 list-disc">$1</li>'); // List items
    };

    const paragraphs = content.split('\n\n').map((p, i) => {
        const listItems = p.split('\n').map(item => item.trim()).filter(item => item.startsWith('- '));
        if (listItems.length > 0) {
            return <ul key={i} className="space-y-1" dangerouslySetInnerHTML={{ __html: p.split('\n').map(item => formatText(item)).join('') }}></ul>;
        }
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatText(p) }}></p>;
    });
    
    return <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">{paragraphs}</div>;
};


const InsightsModal: React.FC<InsightsModalProps> = ({ insights, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Insights Gerados por IA</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {insights ? <SimpleMarkdown content={insights} /> : <p>Gerando insights...</p>}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-right">
                     <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsightsModal;
