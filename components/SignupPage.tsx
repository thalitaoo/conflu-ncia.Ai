import React, { useState } from 'react';
import { View } from '../types';

interface SignupPageProps {
    onSignup: (data: any) => boolean; // returns success status
    setView: (view: View) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, setView }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 3) {
            setError('A senha deve ter pelo menos 3 caracteres.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        
        const { confirmPassword, ...signupData } = formData;
        const success = onSignup(signupData);
        
        if (!success) {
            setError('Este email já está em uso. Tente fazer login.');
        }
        // On success, App.tsx handles the view change by setting the current user
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";
    
    return (
         <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg relative">
                <button onClick={() => setView({ type: 'home' })} className="absolute top-4 left-4 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    &larr; Voltar
                </button>
                <div className="text-center mb-8 mt-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Conflu</h1>
                    <h2 className="mt-2 text-xl text-gray-600 dark:text-gray-300">Crie sua Conta de Aluno</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className={labelStyle}>Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
                    </div>
                     <div>
                        <label htmlFor="email" className={labelStyle}>Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputStyle} />
                    </div>
                     <div>
                        <label htmlFor="password" className={labelStyle}>Senha</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className={labelStyle}>Confirmar Senha</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={inputStyle} />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Criar Conta
                    </button>

                    <div className="text-center mt-4">
                         <p className="text-sm text-gray-600 dark:text-gray-400">
                            Já tem uma conta?{' '}
                            <button onClick={() => setView({ type: 'login' })} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                Faça login
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;