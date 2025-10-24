import React from 'react';

interface QRCodeModalProps {
    title: string;
    qrData: string;
    description: string;
    onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ title, qrData, description, onClose }) => {
    // In a real app, you'd use a library like 'qrcode.react' to generate a QR code
    // from the qrData string.
    let parsedData = null;
    try {
        parsedData = JSON.parse(qrData);
    } catch (e) {
        // ignore if not json
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md flex justify-center items-center h-48">
                    {/* Placeholder for QR Code image */}
                    <div className="w-40 h-40 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">QR Code Placeholder</p>
                    </div>
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {description}
                </p>
                {parsedData && (
                    <div className="mt-4 text-left text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-md">
                        <h4 className="font-bold mb-1">Dados Embutidos:</h4>
                        <pre className="whitespace-pre-wrap break-all"><code>{JSON.stringify(parsedData, null, 2)}</code></pre>
                    </div>
                )}
                 <button
                    onClick={onClose}
                    className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default QRCodeModal;