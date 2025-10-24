import { Product, Student, PaymentMethod, PaymentStatus, CertificateStatus, Source, EnrollmentStatus, ActivityLogType, ActivityLogEntry } from './types';

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);
const twoWeeksAgo = new Date(today);
twoWeeksAgo.setDate(today.getDate() - 14);


export const mockProducts: Product[] = [
    {
        id: 'prod_1',
        name: 'IA na Prática',
        description: 'Aprenda a aplicar conceitos de Inteligência Artificial em projetos reais, do zero ao deploy.',
        price: 799.90,
        certificateTemplateUrl: 'https://i.imgur.com/BqemP62.png',
        classes: [
            { id: 'class_1a', name: 'Turma de Julho - Noite', date: nextWeek.toISOString(), totalSessions: 4, location: 'Online' },
            { id: 'class_1b', name: 'Turma de Agosto - Manhã', date: nextMonth.toISOString(), totalSessions: 4, location: 'Presencial - São Paulo' },
        ],
    },
    {
        id: 'prod_2',
        name: 'IA NA PRATICA 2.0',
        description: 'Uma imersão avançada em Machine Learning e Deep Learning para profissionais que buscam se destacar.',
        price: 1299.90,
        certificateTemplateUrl: 'https://i.imgur.com/BqemP62.png',
        classes: [
            { id: 'class_2a', name: 'Turma Intensiva FDS', date: tomorrow.toISOString(), totalSessions: 2, location: 'Online' },
        ],
    },
    {
        id: 'prod_3',
        name: 'PROGRAMA DE LIDERES',
        description: 'Desenvolva habilidades de liderança para gerir equipes de alta performance em ambientes de rápida mudança.',
        price: 1899.90,
        certificateTemplateUrl: 'https://i.imgur.com/BqemP62.png',
        classes: [
            { id: 'class_3a', name: 'Liderança Julho - Online', date: today.toISOString(), totalSessions: 6, location: 'Online' },
        ],
    },
    {
        id: 'prod_4',
        name: 'IN COMPANY',
        description: 'Soluções de treinamento customizadas para as necessidades de sua empresa, com foco em inovação e tecnologia.',
        price: 15000.00,
        certificateTemplateUrl: 'https://i.imgur.com/BqemP62.png',
        classes: [
            { id: 'class_4a', name: 'Treinamento InovaTech', date: nextWeek.toISOString(), totalSessions: 5, location: 'Presencial - Cliente' },
        ],
    }
];

export const mockStudents: Student[] = [
    {
        id: 'student_1',
        name: 'Ana Silva',
        email: 'ana.silva@example.com',
        phone: '11 98765-4321',
        address: 'Rua das Flores, 123, São Paulo, SP',
        location: 'São Paulo, SP',
        companyName: 'Tech Solutions',
        jobTitle: 'Desenvolvedora Frontend',
        role: 'student',
        password: '123',
        enrollments: [
            {
                id: 'enroll_1',
                productId: 'prod_1',
                classId: 'class_1a',
                enrollmentDate: twoWeeksAgo.toISOString(),
                source: Source.Instagram,
                paymentMethod: PaymentMethod.CreditCard,
                paymentStatus: PaymentStatus.Paid,
                enrollmentStatus: EnrollmentStatus.Active,
                certificateStatus: CertificateStatus.NotIssued,
                isCorporatePurchase: false,
                attendance: [true, false, true, false], // 50%
            },
        ],
    },
    {
        id: 'student_2',
        name: 'Bruno Costa',
        email: 'bruno.costa@example.com',
        phone: '21 99999-8888',
        address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ',
        location: 'Rio de Janeiro, RJ',
        companyName: 'Creative Minds',
        jobTitle: 'Designer UX',
        role: 'student',
        password: '123',
        enrollments: [
            {
                id: 'enroll_2',
                productId: 'prod_2',
                classId: 'class_2a',
                enrollmentDate: new Date().toISOString(),
                source: Source.WhatsApp,
                paymentMethod: PaymentMethod.Pix,
                paymentStatus: PaymentStatus.Pending,
                enrollmentStatus: EnrollmentStatus.Active,
                certificateStatus: CertificateStatus.NotIssued,
                isCorporatePurchase: false,
                attendance: [false, false],
            },
            {
                id: 'enroll_3',
                productId: 'prod_3',
                classId: 'class_3a',
                enrollmentDate: lastWeek.toISOString(),
                source: Source.Site,
                paymentMethod: PaymentMethod.CreditCard,
                paymentStatus: PaymentStatus.Paid,
                enrollmentStatus: EnrollmentStatus.Completed,
                certificateStatus: CertificateStatus.Issued,
                isCorporatePurchase: false,
                attendance: [true, true, true, true, true, true], // 100%
            },
        ],
    },
     {
        id: 'student_3',
        name: 'Carla Dias',
        email: 'carla.dias@example.com',
        phone: '31 98888-7777',
        address: 'Praça da Liberdade, 789, Belo Horizonte, MG',
        location: 'Belo Horizonte, MG',
        companyName: 'InovaTech',
        jobTitle: 'Gerente de Projetos',
        role: 'student',
        password: '123',
        enrollments: [
            {
                id: 'enroll_4',
                productId: 'prod_4',
                classId: 'class_4a',
                enrollmentDate: new Date().toISOString(),
                source: Source.InCompany,
                paymentMethod: PaymentMethod.BankTransfer,
                paymentStatus: PaymentStatus.Billed,
                enrollmentStatus: EnrollmentStatus.Active,
                certificateStatus: CertificateStatus.NotIssued,
                isCorporatePurchase: true,
                attendance: [true, true, true, true, true], // 100%
            },
        ],
    },
    {
        id: 'student_4',
        name: 'Daniel Furtado',
        email: 'daniel.furtado@example.com',
        role: 'student',
        password: '123',
        enrollments: [
             {
                id: 'enroll_5',
                productId: 'prod_1',
                classId: 'class_1b',
                enrollmentDate: lastWeek.toISOString(),
                source: Source.Link,
                paymentMethod: PaymentMethod.Pix,
                paymentStatus: PaymentStatus.Paid,
                enrollmentStatus: EnrollmentStatus.NoShow,
                certificateStatus: CertificateStatus.NotIssued,
                isCorporatePurchase: false,
                attendance: [false, false, false, false],
            },
        ],
    },
    {
        id: 'admin_1',
        name: 'Gestor Oliveira',
        email: 'oliveirat1310@gmail.com',
        role: 'admin',
        password: '123',
        enrollments: [],
    }
];


export const mockActivityLog: ActivityLogEntry[] = [
    { id: 'log_1', timestamp: new Date().toISOString(), type: ActivityLogType.ENROLLMENT, description: '<strong>Ana Silva</strong> se matriculou em <strong>IA na Prática</strong>.', studentId: 'student_1', studentName: 'Ana Silva' },
    { id: 'log_2', timestamp: new Date(Date.now() - 3600000).toISOString(), type: ActivityLogType.PAYMENT, description: 'Pagamento de R$ 799,90 recebido de <strong>Ana Silva</strong>.', studentId: 'student_1', studentName: 'Ana Silva' },
    { id: 'log_3', timestamp: new Date(Date.now() - 7200000).toISOString(), type: ActivityLogType.ENROLLMENT, description: '<strong>Bruno Costa</strong> se matriculou em <strong>IA NA PRATICA 2.0</strong>.', studentId: 'student_2', studentName: 'Bruno Costa' },
    { id: 'log_4', timestamp: new Date(Date.now() - 86400000).toISOString(), type: ActivityLogType.STATUS_CHANGE, description: "Status de <strong>Bruno Costa</strong> em <strong>PROGRAMA DE LIDERES</strong> alterado para <strong>Concluído</strong>.", studentId: 'student_2', studentName: 'Bruno Costa' },
    { id: 'log_5', timestamp: new Date(Date.now() - 172800000).toISOString(), type: ActivityLogType.CERTIFICATE_ISSUED, description: "Certificado emitido para <strong>Bruno Costa</strong> no curso <strong>PROGRAMA DE LIDERES</strong>.", studentId: 'student_2', studentName: 'Bruno Costa' },

];