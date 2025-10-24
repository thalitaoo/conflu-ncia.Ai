
import React from 'react';
import { Product } from '../types';
import RegistrationPage from './RegistrationPage';

interface PublicProductPageProps {
    product: Product;
    // FIX: Rename prop to match RegistrationPage and update signature.
    onRegisterStudent: (data: any) => void;
}

// This component is essentially a wrapper for RegistrationPage
// in a public context.
// FIX: Use the corrected prop name.
const PublicProductPage: React.FC<PublicProductPageProps> = ({ product, onRegisterStudent }) => {
    return <RegistrationPage product={product} onRegisterStudent={onRegisterStudent} />;
};

export default PublicProductPage;
