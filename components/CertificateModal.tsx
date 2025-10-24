import React from 'react';
import { Student, Product } from '../types';

interface CertificateModalProps {
    student: Student;
    product: Product;
    onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ student, product, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Certificado de Conclusão</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                </div>
                <div className="p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex-1">
                    <div 
                        className="w-full aspect-[1.414] bg-cover bg-center bg-no-repeat relative flex flex-col items-center justify-center text-center p-8 shadow-lg"
                        style={{ backgroundImage: `url(${product.certificateTemplateUrl || 'https://i.imgur.com/BqemP62.png'})` }}
                    >
                       {/* The content is overlaid on the background image. The template image should have blank space for this text. */}
                       <div className="text-gray-800" style={{ textShadow: '0px 0px 5px rgba(255,255,255,0.7)'}}>
                           <p className="text-xl md:text-2xl lg:text-3xl">Certificamos que</p>
                           <p className="text-3xl md:text-4xl lg:text-5xl font-bold my-4 md:my-8">{student.name}</p>
                           <p className="text-xl md:text-2xl lg:text-3xl">concluiu com sucesso o curso</p>
                           <p className="text-2xl md:text-3xl lg:text-4xl font-semibold my-4 md:my-8">{product.name}</p>
                           <p className="absolute bottom-8 right-8 text-xs md:text-sm">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                       </div>
                    </div>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-right">
                     <button
                        onClick={onClose}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;