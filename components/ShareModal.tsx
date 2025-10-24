
import React from 'react';

interface ShareModalProps {
    shareUrl: string;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ shareUrl, onClose }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Compartilhar Link de Inscrição</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Copie e compartilhe o link abaixo para que outras pessoas possam se inscrever.
                </p>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <button
                        onClick={handleCopy}
                        className="w-28 flex-shrink-0 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
                 <button
                    onClick={onClose}
                    className="mt-8 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default ShareModal;
