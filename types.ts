export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    classes: CourseClass[];
    certificateTemplateUrl?: string;
}

export interface CourseClass {
    id: string;
    name: string;
    date: string; // ISO string
    totalSessions: number;
    location?: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    enrollments: Enrollment[];
    companyName?: string;
    jobTitle?: string;
    phone?: string;
    address?: string;
    location?: string;
    notes?: string;
    role: 'student' | 'admin';
    password?: string; // Added for authentication
}

export interface Enrollment {
    id: string;
    productId: string;
    classId: string;
    enrollmentDate: string; // ISO string
    source: Source;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    enrollmentStatus: EnrollmentStatus;
    certificateStatus: CertificateStatus;
    isCorporatePurchase: boolean;
    attendance: boolean[];
}

export enum Source {
    Site = 'Site',
    WhatsApp = 'WhatsApp',
    Instagram = 'Instagram',
    Link = 'Link de Inscrição',
    Formulario = 'Formulário',
    InCompany = 'In-Company',
}

export enum PaymentMethod {
    Pix = 'PIX',
    CreditCard = 'Cartão de Crédito',
    BankTransfer = 'Transferência Bancária',
}

export enum PaymentStatus {
    Paid = 'Pago',
    Pending = 'Pendente',
    Overdue = 'Vencido',
    Billed = 'Faturado',
}

export enum EnrollmentStatus {
    Active = 'Ativo',
    Completed = 'Concluído',
    Cancelled = 'Cancelado',
    NoShow = 'Não Compareceu',
}

export enum CertificateStatus {
    Issued = 'Emitido',
    NotIssued = 'Não Emitido',
    Pending = 'Pendente de Emissão',
}

export enum ActivityLogType {
    ENROLLMENT = 'enrollment',
    STATUS_CHANGE = 'status_change',
    PAYMENT = 'payment',
    NOTE = 'note',
    CLASS_CREATED = 'class_created',
    PROFILE_UPDATE = 'profile_update',
    CERTIFICATE_ISSUED = 'certificate_issued',
    CLASS_UPDATE = 'class_update',
    BATCH_CERTIFICATE_ISSUED = 'batch_certificate_issued',
}


export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO string
  type: ActivityLogType;
  description: string;
  studentId?: string;
  studentName?: string;
}

export type View = {
    type: 'dashboard' | 'enrollment' | 'product-detail' | 'student-profile' | 'turmas' | 'turma-detail' | 'financials' | 'register' | 'student-dashboard';
    id?: string;
};