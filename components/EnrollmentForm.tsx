
import React, { useState, useEffect } from 'react';
import { Product, Source, PaymentMethod, PaymentStatus, CertificateStatus, EnrollmentStatus } from '../types';

interface EnrollmentFormProps {
    products: Product[];
    onRegisterStudent: (data: any) => void;
    initialData?: any | null;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ products, onRegisterStudent, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        location: '',
        companyName: '',
        jobTitle: '',
        productId: products[0]?.id || '',
        classId: products[0]?.classes[0]?.id || '',
        source: Source.WhatsApp,
        paymentMethod: PaymentMethod.Pix,
        isCorporatePurchase: false,
    });
    const [availableClasses, setAvailableClasses] = useState(products[0]?.classes || []);

    useEffect(() => {
        if (initialData) {
            const productName = (initialData.productName as string) ?? '';
            const paymentMethodName = (initialData.paymentMethod as string) ?? '';

            const product = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
            const paymentMethod = Object.values(PaymentMethod).find(pm => pm.toLowerCase() === paymentMethodName.toLowerCase()) || PaymentMethod.Pix;

            setFormData(prev => ({
                ...prev,
                name: (initialData.studentName as string) || '',
                email: (initialData.studentEmail as string) || '',
                phone: (initialData.phone as string) || '',
                address: (initialData.address as string) || '',
                location: (initialData.location as string) || '',
                companyName: (initialData.companyName as string) || '',
                jobTitle: (initialData.jobTitle as string) || '',
                productId: product?.id || prev.productId,
                paymentMethod: paymentMethod,
            }));
        }
    }, [initialData, products]);

    useEffect(() => {
        const selectedProduct = products.find(p => p.id === formData.productId);
        const classes = selectedProduct?.classes || [];
        setAvailableClasses(classes);
        if (classes.length > 0 && !classes.some(c => c.id === formData.classId)) {
            setFormData(prev => ({ ...prev, classId: classes[0].id }));
        }
    }, [formData.productId, products, formData.classId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
             setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, email, phone, address, location, companyName, jobTitle, ...enrollmentData } = formData;
        
        const newEnrollment = {
            productId: enrollmentData.productId,
            classId: enrollmentData.classId,
            enrollmentDate: new Date().toISOString(),
            source: enrollmentData.source,
            paymentMethod: enrollmentData.paymentMethod,
            paymentStatus: enrollmentData.isCorporatePurchase ? PaymentStatus.Billed : PaymentStatus.Pending,
            enrollmentStatus: EnrollmentStatus.Active,
            certificateStatus: CertificateStatus.NotIssued,
            isCorporatePurchase: enrollmentData.isCorporatePurchase,
        };
        
        onRegisterStudent({
            name, email, phone, address, location, companyName, jobTitle,
            enrollment: newEnrollment,
        });

        // Reset form
        setFormData({
            name: '', email: '', phone: '', address: '', location: '', companyName: '', jobTitle: '',
            productId: products[0]?.id || '',
            classId: products[0]?.classes[0]?.id || '',
            source: Source.WhatsApp,
            paymentMethod: PaymentMethod.Pix,
            isCorporatePurchase: false,
        });
    };
    
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Formulário de Matrícula</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className={labelStyle}>Nome do Aluno</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
                    </div>
                     <div>
                        <label htmlFor="email" className={labelStyle}>Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={inputStyle} />
                    </div>
                </div>
                
                <div>
                    <label htmlFor="phone" className={labelStyle}>Telefone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputStyle} />
                </div>

                <div>
                    <label htmlFor="address" className={labelStyle}>Endereço</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className={inputStyle} />
                </div>
                
                <div>
                    <label htmlFor="location" className={labelStyle}>Localidade (Cidade/UF)</label>
                    <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className={inputStyle} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="companyName" className={labelStyle}>Empresa (opcional)</label>
                        <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="jobTitle" className={labelStyle}>Cargo (opcional)</label>
                        <input type="text" name="jobTitle" id="jobTitle" value={formData.jobTitle} onChange={handleChange} className={inputStyle} />
                    </div>
                </div>

                <hr className="dark:border-gray-600"/>

                 <div>
                    <label htmlFor="productId" className={labelStyle}>Curso</label>
                    <select name="productId" id="productId" value={formData.productId} onChange={handleChange} className={inputStyle}>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="classId" className={labelStyle}>Turma</label>
                    <select name="classId" id="classId" value={formData.classId} onChange={handleChange} className={inputStyle} disabled={availableClasses.length === 0}>
                        {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name} - {new Date(c.date).toLocaleDateString()}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="source" className={labelStyle}>Fonte</label>
                        <select name="source" id="source" value={formData.source} onChange={handleChange} className={inputStyle}>
                            {Object.values(Source).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="paymentMethod" className={labelStyle}>Pagamento</label>
                        <select name="paymentMethod" id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputStyle}>
                            {Object.values(PaymentMethod).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex items-center">
                    <input id="isCorporatePurchase" name="isCorporatePurchase" type="checkbox" checked={formData.isCorporatePurchase} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    <label htmlFor="isCorporatePurchase" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Compra corporativa?</label>
                </div>

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Matricular Aluno
                </button>
            </form>
        </div>
    );
};

export default EnrollmentForm;
