import React, { useState, useEffect, useCallback } from 'react';
import { Product, Student, View, ActivityLogEntry, CourseClass, Enrollment, EnrollmentStatus, CertificateStatus, PaymentStatus, Source, ActivityLogType, PaymentMethod, AttendanceSource, AttendanceRecord } from './types';
import { mockProducts, mockStudents, mockActivityLog } from './mockData';
import { generateInsights } from './services/geminiService';
import { sendEnrollmentConfirmation, sendCertificateNotification } from './services/emailService';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EnrollmentPage from './components/EnrollmentPage';
import ProductDetail from './components/ProductDetail';
import StudentProfile from './components/StudentProfile';
import TurmasPage from './components/TurmasPage';
import TurmaDetail from './components/TurmaDetail';
import FinancialsPage from './components/FinancialsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import StudentDashboard from './components/StudentDashboard';
import PublicHomePage from './components/PublicHomePage';
import InsightsModal from './components/InsightsModal';
import RegistrationPage from './components/RegistrationPage';
import WhatsAppChatbot from './components/WhatsAppChatbot';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(mockActivityLog);
    const [view, setView] = useState<View>({ type: 'home' });
    const [loggedInUser, setLoggedInUser] = useState<Student | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');

    const addActivityLog = useCallback((entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
        setActivityLog(prev => [...prev, { ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString() }]);
    }, []);

    const checkAndIssueCertificate = useCallback(async (studentId: string, enrollmentId: string, currentStudentsState: Student[]) => {
        const student = currentStudentsState.find(s => s.id === studentId);
        if (!student) return;

        const enrollment = student.enrollments.find(e => e.id === enrollmentId);
        if (!enrollment) return;

        const product = products.find(p => p.id === enrollment.productId);
        if (!product) return;

        const attendance = enrollment.attendance || [];
        const presenceCount = attendance.filter(att => att.status).length;
        const totalSessions = attendance.length;
        const presencePercentage = totalSessions > 0 ? (presenceCount / totalSessions) * 100 : 0;

        const isEligible = presencePercentage >= 80 && enrollment.enrollmentStatus === EnrollmentStatus.Completed;
        const needsIssuing = enrollment.certificateStatus !== CertificateStatus.Issued;

        if (isEligible && needsIssuing) {
            setStudents(prevStudents => prevStudents.map(s => {
                if (s.id === studentId) {
                    return {
                        ...s,
                        enrollments: s.enrollments.map(e => 
                            e.id === enrollmentId ? { ...e, certificateStatus: CertificateStatus.Issued } : e
                        )
                    };
                }
                return s;
            }));

            addActivityLog({
                type: ActivityLogType.CERTIFICATE_ISSUED,
                description: `Certificado emitido automaticamente para <strong>${student.name}</strong> no curso <strong>${product.name}</strong> por atingir ${presencePercentage.toFixed(0)}% de presença.`,
                studentId: student.id,
                studentName: student.name
            });

            const emailResult = await sendCertificateNotification(student, product);
            addActivityLog({
                type: ActivityLogType.EMAIL_NOTIFICATION,
                description: emailResult.success
                    ? `Email de notificação de certificado enviado para <strong>${student.name}</strong>.`
                    : `Falha ao enviar email de notificação de certificado para <strong>${student.name}</strong>. Motivo: ${emailResult.error}`,
                studentId: student.id,
                studentName: student.name
            });
        }
    }, [products, addActivityLog]);

    const handleUpdateAttendance = useCallback(async (studentId: string, enrollmentId: string, sessionIndex: number, newStatus: boolean, source: AttendanceSource) => {
        let updatedStudents: Student[] = [];
        setStudents(prevStudents => {
            updatedStudents = prevStudents.map(student => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        enrollments: student.enrollments.map(enrollment => {
                            if (enrollment.id === enrollmentId) {
                                const newAttendanceArray = [...enrollment.attendance];
                                newAttendanceArray[sessionIndex] = {
                                    status: newStatus,
                                    source: source,
                                    timestamp: new Date().toISOString(),
                                };
                                return { ...enrollment, attendance: newAttendanceArray };
                            }
                            return enrollment;
                        })
                    };
                }
                return student;
            });
            return updatedStudents;
        });
        await checkAndIssueCertificate(studentId, enrollmentId, updatedStudents);
    }, [checkAndIssueCertificate]);

    const handleUpdateEnrollmentStatus = useCallback(async (studentId: string, enrollmentId: string, newStatus: EnrollmentStatus) => {
        let studentName = '';
        let productName = '';
        let updatedStudents: Student[] = [];

        setStudents(prevStudents => {
            updatedStudents = prevStudents.map(student => {
                if (student.id === studentId) {
                    studentName = student.name;
                    return {
                        ...student,
                        enrollments: student.enrollments.map(enrollment => {
                            if (enrollment.id === enrollmentId) {
                                const product = products.find(p => p.id === enrollment.productId);
                                productName = product?.name || 'Curso desconhecido';
                                return { ...enrollment, enrollmentStatus: newStatus };
                            }
                            return enrollment;
                        })
                    };
                }
                return student;
            });
            return updatedStudents;
        });
        
        addActivityLog({
            type: ActivityLogType.STATUS_CHANGE,
            description: `Status de <strong>${studentName}</strong> em <strong>${productName}</strong> alterado para <strong>${newStatus}</strong>.`,
            studentId,
            studentName
        });
        
        if (newStatus === EnrollmentStatus.Completed) {
            await checkAndIssueCertificate(studentId, enrollmentId, updatedStudents);
        }
    }, [products, addActivityLog, checkAndIssueCertificate]);

    const handleIssueCertificate = useCallback(async (studentId: string, enrollmentId: string) => {
        let studentName = '';
        let productName = '';
        let studentForEmail: Student | undefined;
        let productForEmail: Product | undefined;

        setStudents(prevStudents => {
            const student = prevStudents.find(s => s.id === studentId);
            if (!student) return prevStudents;

            studentForEmail = student;
            const enrollment = student.enrollments.find(e => e.id === enrollmentId);
            if (!enrollment) return prevStudents;

            productForEmail = products.find(p => p.id === enrollment.productId);
            studentName = student.name;
            productName = productForEmail?.name || 'Curso';

            return prevStudents.map(s => {
                if (s.id === studentId) {
                    return {
                        ...s,
                        enrollments: s.enrollments.map(e => 
                            e.id === enrollmentId ? { ...e, certificateStatus: CertificateStatus.Issued } : e
                        )
                    };
                }
                return s;
            });
        });
        
        addActivityLog({
            type: ActivityLogType.CERTIFICATE_ISSUED,
            description: `Certificado emitido manualmente para <strong>${studentName}</strong> no curso <strong>${productName}</strong>.`,
            studentId, studentName
        });

        if (studentForEmail && productForEmail) {
            const emailResult = await sendCertificateNotification(studentForEmail, productForEmail);
            addActivityLog({
                type: ActivityLogType.EMAIL_NOTIFICATION,
                description: emailResult.success
                    ? `Email de notificação de certificado enviado para <strong>${studentName}</strong>.`
                    : `Falha ao enviar email de notificação de certificado para <strong>${studentName}</strong>. Motivo: ${emailResult.error}`,
                studentId, studentName
            });
        }
    }, [products, addActivityLog]);

    const handleBatchIssueCertificates = useCallback((classId: string, productId: string) => {
        let issuedCount = 0;
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        let currentStudentsState = students;
        setStudents(prevStudents => {
            currentStudentsState = prevStudents;
            return prevStudents;
        });
        
        const studentsInClass = currentStudentsState.filter(s => s.enrollments.some(e => e.classId === classId));
        
        studentsInClass.forEach(student => {
            const enrollment = student.enrollments.find(e => e.classId === classId);
            if (!enrollment) return;

            const presenceCount = enrollment.attendance.filter(att => att.status).length;
            const totalSessions = enrollment.attendance.length;
            const presencePercentage = totalSessions > 0 ? (presenceCount / totalSessions) * 100 : 0;
            const isEligible = presencePercentage >= 80 && enrollment.enrollmentStatus === EnrollmentStatus.Completed;

            if (isEligible && enrollment.certificateStatus !== CertificateStatus.Issued) {
                handleIssueCertificate(student.id, enrollment.id);
                issuedCount++;
            }
        });

        if (issuedCount > 0) {
            const courseClass = product.classes.find(c => c.id === classId);
            addActivityLog({
                type: ActivityLogType.BATCH_CERTIFICATE_ISSUED,
                description: `Emissão em lote: <strong>${issuedCount}</strong> certificado(s) emitido(s) para a turma <strong>${courseClass?.name || ''}</strong>.`
            });
        } else {
            alert("Nenhum aluno estava apto a receber o certificado nesta turma.");
        }
    }, [students, products, addActivityLog, handleIssueCertificate]);

    const handleRegisterStudent = useCallback(async (data: any) => {
        const existingStudent = students.find(s => s.email === data.email);
        const { enrollment, ...studentData } = data;

        const product = products.find(p => p.id === enrollment.productId);
        if (!product) return;
        const courseClass = product.classes.find(c => c.id === enrollment.classId);
        if (!courseClass) return;

        const newEnrollment: Enrollment = {
            id: `enroll_${crypto.randomUUID()}`,
            ...enrollment,
            attendance: Array.from({ length: courseClass.totalSessions }, () => ({ status: false, source: AttendanceSource.System })),
        };

        if (existingStudent) {
            setStudents(students.map(s => s.id === existingStudent.id ? { ...s, enrollments: [...s.enrollments, newEnrollment] } : s));
        } else {
            const newStudent: Student = {
                id: `student_${crypto.randomUUID()}`,
                ...studentData,
                role: 'student',
                enrollments: [newEnrollment],
            };
            setStudents(prev => [...prev, newStudent]);
        }
        
        addActivityLog({
            type: ActivityLogType.ENROLLMENT,
            description: `<strong>${data.name}</strong> se matriculou em <strong>${product.name}</strong>.`,
            studentId: existingStudent?.id,
            studentName: data.name
        });

        const emailResult = await sendEnrollmentConfirmation({ name: data.name, email: data.email }, product, courseClass);
        addActivityLog({
            type: ActivityLogType.EMAIL_NOTIFICATION,
            description: emailResult.success
                ? `Email de confirmação enviado para <strong>${data.name}</strong>.`
                : `Falha ao enviar email de confirmação para <strong>${data.name}</strong>. Motivo: ${emailResult.error}`,
            studentName: data.name
        });
    }, [students, products, addActivityLog]);

    const handleEnrollInNewCourse = useCallback((studentId: string, productId: string, classId: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const courseClass = product.classes.find(c => c.id === classId);
        if (!courseClass) return;

        const newEnrollment: Enrollment = {
            id: crypto.randomUUID(),
            productId,
            classId,
            enrollmentDate: new Date().toISOString(),
            source: Source.Site, // Assuming enrollment from student dashboard is 'Site'
            paymentMethod: PaymentMethod.CreditCard, // Default or could be asked
            paymentStatus: PaymentStatus.Paid, // Assuming immediate payment
            enrollmentStatus: EnrollmentStatus.Active,
            certificateStatus: CertificateStatus.NotIssued,
            isCorporatePurchase: false,
            attendance: Array.from({ length: courseClass.totalSessions }, () => ({ status: false, source: AttendanceSource.System })),
        };

        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                return { ...s, enrollments: [...s.enrollments, newEnrollment] };
            }
            return s;
        }));

        const student = students.find(s => s.id === studentId);
        if (student) {
            addActivityLog({
                type: ActivityLogType.ENROLLMENT,
                description: `<strong>${student.name}</strong> se matriculou no novo curso <strong>${product.name}</strong>.`,
                studentId,
                studentName: student.name
            });
            sendEnrollmentConfirmation(student, product, courseClass);
        }
    }, [products, students, addActivityLog]);

    const handleUpdateStudentProfile = useCallback((studentId: string, updatedData: Partial<Omit<Student, 'id' | 'enrollments'>>) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...updatedData } : s));
        const student = students.find(s => s.id === studentId);
        if (student) {
            addActivityLog({
                type: ActivityLogType.PROFILE_UPDATE,
                description: `Perfil de <strong>${student.name}</strong> foi atualizado.`,
                studentId,
                studentName: student.name
            });
        }
    }, [students, addActivityLog]);

    const handleCreateClass = useCallback((newClassData: Omit<CourseClass, 'id'>, productId: string) => {
        const newClass = { ...newClassData, id: `class_${crypto.randomUUID()}` };
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return { ...p, classes: [...p.classes, newClass] };
            }
            return p;
        }));
        const product = products.find(p => p.id === productId);
        addActivityLog({
            type: ActivityLogType.CLASS_CREATED,
            description: `Nova turma <strong>${newClass.name}</strong> criada para o curso <strong>${product?.name || ''}</strong>.`
        });
    }, [products, addActivityLog]);
    
    const handleUpdateClass = useCallback((updatedClass: CourseClass, productId: string) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    classes: p.classes.map(c => c.id === updatedClass.id ? updatedClass : c)
                };
            }
            return p;
        }));
         const product = products.find(p => p.id === productId);
         addActivityLog({
            type: ActivityLogType.CLASS_UPDATE,
            description: `Turma <strong>${updatedClass.name}</strong> do curso <strong>${product?.name || ''}</strong> foi atualizada.`
        });
    }, [products, addActivityLog]);

    const handleLogin = (email: string, pass: string): boolean => {
        const user = students.find(s => s.email.toLowerCase() === email.toLowerCase() && s.password === pass);
        if (user) {
            setLoggedInUser(user);
            if (user.role === 'admin') {
                setView({ type: 'dashboard' });
            } else {
                setView({ type: 'student-dashboard' });
            }
            return true;
        }
        return false;
    };
    
    const handleLogout = () => {
        setLoggedInUser(null);
        setView({ type: 'home' });
    };

    const handleCreateStudentAccount = (data: Omit<Student, 'id' | 'enrollments' | 'role'>) => {
        if (students.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
            return false;
        }
        const newStudent: Student = {
            ...data,
            id: `student_${crypto.randomUUID()}`,
            role: 'student',
            enrollments: [],
        };
        setStudents(prev => [...prev, newStudent]);
        setLoggedInUser(newStudent);
        setView({ type: 'student-dashboard' });
        addActivityLog({
            type: ActivityLogType.ACCOUNT_CREATED,
            description: `Nova conta de aluno criada para <strong>${data.name}</strong>.`,
            studentId: newStudent.id,
            studentName: newStudent.name
        });
        return true;
    };
    
    const handleGenerateInsights = async () => {
        setIsInsightsModalOpen(true);
        setInsights(''); // Clear previous insights
        try {
            const result = await generateInsights({ products, students });
            setInsights(result);
        } catch (error) {
            setInsights("Ocorreu um erro ao gerar os insights. Tente novamente.");
        }
    };
    
     useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash.startsWith('register/')) {
                const productId = hash.split('/')[1];
                if (products.some(p => p.id === productId)) {
                    setView({ type: 'register', id: productId });
                }
            } else if (!loggedInUser) {
                 setView({ type: 'home' });
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Check on initial load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [products, loggedInUser]);
    

    const renderContent = () => {
        if (!loggedInUser) {
            switch (view.type) {
                case 'login': return <LoginPage onLogin={handleLogin} setView={setView} />;
                case 'signup': return <SignupPage onSignup={handleCreateStudentAccount} setView={setView} />;
                case 'register':
                    const product = products.find(p => p.id === view.id);
                    return product ? <RegistrationPage product={product} onRegisterStudent={handleRegisterStudent} /> : <PublicHomePage products={products} setView={setView} onRegisterStudent={handleRegisterStudent}/>;
                default: return <PublicHomePage products={products} setView={setView} onRegisterStudent={handleRegisterStudent} />;
            }
        }

        if (loggedInUser.role === 'student') {
            return <StudentDashboard student={loggedInUser} products={products} onLogout={handleLogout} onEnrollInNewCourse={handleEnrollInNewCourse} />;
        }
        
        // Admin View
        return (
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
                <Sidebar setView={setView} onLogout={handleLogout} onGenerateInsights={handleGenerateInsights} />
                <main className="flex-1 p-8 overflow-y-auto">
                    {view.type === 'dashboard' && <Dashboard products={products} students={students} setView={setView} activityLog={activityLog} />}
                    {view.type === 'enrollment' && <EnrollmentPage products={products} onRegisterStudent={handleRegisterStudent} />}
                    {view.type === 'product-detail' && view.id &&
                        <ProductDetail
                            product={products.find(p => p.id === view.id)!}
                            students={students.filter(s => s.enrollments.some(e => e.productId === view.id))}
                            setView={setView}
                            onUpdateAttendance={handleUpdateAttendance}
                            onUpdateEnrollmentStatus={handleUpdateEnrollmentStatus}
                        />}
                    {view.type === 'student-profile' && view.id &&
                        <StudentProfile
                            student={students.find(s => s.id === view.id)!}
                            products={products}
                            setView={setView}
                            onUpdateStudentProfile={handleUpdateStudentProfile}
                            onEnrollInNewCourse={handleEnrollInNewCourse}
                            onIssueCertificate={handleIssueCertificate}
                        />}
                    {view.type === 'turmas' && <TurmasPage products={products} setView={setView} onCreateClass={handleCreateClass} />}
                    {view.type === 'turma-detail' && view.id &&
                        (() => {
                            const [productId, classId] = view.id.split('|');
                            const product = products.find(p => p.id === productId);
                            const courseClass = product?.classes.find(c => c.id === classId);
                            if (!product || !courseClass) return <div>Turma não encontrada.</div>;
                            return <TurmaDetail
                                product={product}
                                courseClass={courseClass}
                                students={students.filter(s => s.enrollments.some(e => e.classId === classId))}
                                setView={setView}
                                onUpdateClass={handleUpdateClass}
                                onBatchIssueCertificates={handleBatchIssueCertificates}
                            />;
                        })()}
                    {view.type === 'financials' && <FinancialsPage products={products} students={students} />}
                </main>
                {isInsightsModalOpen && <InsightsModal insights={insights} onClose={() => setIsInsightsModalOpen(false)} />}
                <WhatsAppChatbot phoneNumber="5511912345678" message="Olá! Preciso de ajuda no painel de gestão." />
            </div>
        );
    };

    return <div className="antialiased">{renderContent()}</div>;
};

export default App;