
import React, { useState, useEffect } from 'react';
// FIX: Import Source and PaymentMethod
import { Product, Student, Enrollment, CourseClass, ActivityLogEntry, EnrollmentStatus, ActivityLogType, CertificateStatus, PaymentStatus, View, Source, PaymentMethod } from './types';
import { mockProducts, mockStudents, mockActivityLog } from './mockData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EnrollmentPage from './components/EnrollmentPage';
import ProductDetail from './components/ProductDetail';
import StudentProfile from './components/StudentProfile';
import TurmasPage from './components/TurmasPage';
import TurmaDetail from './components/TurmaDetail';
import FinancialsPage from './components/FinancialsPage';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import { generateInsights } from './services/geminiService';
import InsightsModal from './components/InsightsModal';
import WhatsAppChatbot from './components/WhatsAppChatbot';
import RegistrationPage from './components/RegistrationPage';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [students, setStudents] = useState<Student[]>(mockStudents);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(mockActivityLog);
    const [view, setView] = useState<View>({ type: 'dashboard' });
    const [currentUser, setCurrentUser] = useState<Student | null>(null);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
    const [insights, setInsights] = useState('');
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash.startsWith('register/')) {
                const productId = hash.split('/')[1];
                setView({ type: 'register', id: productId });
            } else if (!currentUser) {
                 window.location.hash = '';
                 setView({ type: 'dashboard' }); // Reset view for login page
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [currentUser]);


    const addActivityLog = (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
        const newEntry: ActivityLogEntry = {
            ...entry,
            id: `log_${Date.now()}`,
            timestamp: new Date().toISOString(),
        };
        setActivityLog(prev => [newEntry, ...prev].slice(0, 50));
    };

    const handleRegisterStudent = (data: Omit<Student, 'id' | 'enrollments' | 'role'> & { enrollment: Omit<Enrollment, 'id' | 'attendance'> }) => {
        const existingStudent = students.find(s => s.email.toLowerCase() === data.email.toLowerCase());
        const product = products.find(p => p.id === data.enrollment.productId);
        const courseClass = product?.classes.find(c => c.id === data.enrollment.classId);

        const newEnrollment: Enrollment = {
            ...data.enrollment,
            id: `enroll_${Date.now()}`,
            attendance: Array(courseClass?.totalSessions || 1).fill(false),
        };

        if (existingStudent) {
            setStudents(students.map(s => {
                if (s.id === existingStudent.id) {
                    addActivityLog({ type: ActivityLogType.ENROLLMENT, description: `<strong>${s.name}</strong> se matriculou em <strong>${product?.name}</strong>.`, studentId: s.id, studentName: s.name });
                    const updatedStudent = {
                        ...s,
                        name: data.name || s.name,
                        companyName: data.companyName || s.companyName,
                        jobTitle: data.jobTitle || s.jobTitle,
                        phone: data.phone || s.phone,
                        address: data.address || s.address,
                        location: data.location || s.location,
                        enrollments: [...s.enrollments, newEnrollment]
                    };
                    return updatedStudent;
                }
                return s;
            }));
        } else {
            const newStudent: Student = {
                id: `student_${Date.now()}`,
                name: data.name,
                email: data.email,
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                phone: data.phone,
                address: data.address,
                location: data.location,
                role: 'student',
                enrollments: [newEnrollment],
            };
            addActivityLog({ type: ActivityLogType.ENROLLMENT, description: `Novo aluno <strong>${newStudent.name}</strong> matriculado em <strong>${product?.name}</strong>.`, studentId: newStudent.id, studentName: newStudent.name });
            setStudents(prev => [...prev, newStudent]);
        }
        alert('Matrícula registrada com sucesso!');
        setView({ type: 'dashboard' });
    };
    
    const handleEnrollInNewCourse = (studentId: string, productId: string, classId: string) => {
        const student = students.find(s => s.id === studentId);
        const product = products.find(p => p.id === productId);
        const courseClass = product?.classes.find(c => c.id === classId);

        if (!student || !product || !courseClass) {
            alert("Erro: Aluno, produto ou turma não encontrado.");
            return;
        }

        const newEnrollment: Enrollment = {
            id: `enroll_${Date.now()}`,
            productId,
            classId,
            enrollmentDate: new Date().toISOString(),
            source: Source.Site, // Default for internal enrollment
            paymentMethod: PaymentMethod.Pix, // Default
            paymentStatus: PaymentStatus.Pending,
            enrollmentStatus: EnrollmentStatus.Active,
            certificateStatus: CertificateStatus.NotIssued,
            isCorporatePurchase: false,
            attendance: Array(courseClass.totalSessions).fill(false),
        };
        
        setStudents(students.map(s => 
            s.id === studentId 
            ? { ...s, enrollments: [...s.enrollments, newEnrollment] } 
            : s
        ));

        addActivityLog({ type: ActivityLogType.ENROLLMENT, description: `<strong>${student.name}</strong> foi matriculado(a) no curso <strong>${product.name}</strong>.`, studentId: student.id, studentName: student.name });
        alert(`${student.name} matriculado(a) com sucesso!`);
    };

    const handleUpdateAttendance = (studentId: string, enrollmentId: string, sessionIndex: number, newAttendance: boolean) => {
        setStudents(students.map(s => {
            if (s.id === studentId) {
                return {
                    ...s,
                    enrollments: s.enrollments.map(e => {
                        if (e.id === enrollmentId) {
                            const updatedAttendance = [...e.attendance];
                            updatedAttendance[sessionIndex] = newAttendance;
                            return { ...e, attendance: updatedAttendance };
                        }
                        return e;
                    }),
                };
            }
            return s;
        }));
    };
    
    const handleUpdateEnrollmentStatus = (studentId: string, enrollmentId: string, newStatus: EnrollmentStatus) => {
        let student: Student | undefined;
        const updatedStudents = students.map(s => {
            if (s.id === studentId) {
                student = s;
                return {
                    ...s,
                    enrollments: s.enrollments.map(e => {
                        if (e.id === enrollmentId) {
                             if (e.enrollmentStatus !== newStatus) {
                                const product = products.find(p => p.id === e.productId);
                                addActivityLog({ type: ActivityLogType.STATUS_CHANGE, description: `Status de <strong>${s.name}</strong> em <strong>${product?.name}</strong> alterado para <strong>${newStatus}</strong>.`, studentId: s.id, studentName: s.name });
                            }
                            return { ...e, enrollmentStatus: newStatus };
                        }
                        return e;
                    }),
                };
            }
            return s;
        });
         setStudents(updatedStudents);
    };

     const handleCreateClass = (newClassData: Omit<CourseClass, 'id'>, productId: string) => {
        setProducts(products.map(p => {
            if (p.id === productId) {
                const newClass: CourseClass = { ...newClassData, id: `class_${Date.now()}` };
                addActivityLog({ type: ActivityLogType.CLASS_CREATED, description: `Nova turma "<strong>${newClass.name}</strong>" criada para o curso <strong>${p.name}</strong>.` });
                return { ...p, classes: [...p.classes, newClass] };
            }
            return p;
        }));
    };
    
     const handleUpdateClass = (updatedClass: CourseClass, productId: string) => {
        setProducts(products.map(p => {
            if (p.id === productId) {
                addActivityLog({ type: ActivityLogType.CLASS_UPDATE, description: `Turma "<strong>${updatedClass.name}</strong>" do curso <strong>${p.name}</strong> foi atualizada.` });
                return { ...p, classes: p.classes.map(c => c.id === updatedClass.id ? updatedClass : c) };
            }
            return p;
        }));
        sendNotification(`Turma Atualizada: ${updatedClass.name}`, `A turma do curso ${products.find(p=>p.id === productId)?.name} foi atualizada.`);
    };

    const handleUpdateStudentProfile = (studentId: string, updatedData: Partial<Omit<Student, 'id' | 'enrollments'>>) => {
        setStudents(students.map(s => {
            if (s.id === studentId) {
                addActivityLog({ type: ActivityLogType.PROFILE_UPDATE, description: `Perfil de <strong>${s.name}</strong> foi atualizado.`, studentId: s.id, studentName: s.name });
                return { ...s, ...updatedData };
            }
            return s;
        }));
    };
    
    const handleIssueCertificate = (studentId: string, enrollmentId: string) => {
        setStudents(students.map(s => {
            if (s.id === studentId) {
                return {
                    ...s,
                    enrollments: s.enrollments.map(e => {
                        if (e.id === enrollmentId) {
                            const product = products.find(p => p.id === e.productId);
                             addActivityLog({ type: ActivityLogType.CERTIFICATE_ISSUED, description: `Certificado emitido para <strong>${s.name}</strong> no curso <strong>${product?.name}</strong>.`, studentId: s.id, studentName: s.name });
                            return { ...e, certificateStatus: CertificateStatus.Issued };
                        }
                        return e;
                    }),
                };
            }
            return s;
        }));
    };

    const handleBatchIssueCertificates = (classId: string, productId: string) => {
        let issuedCount = 0;
        const product = products.find(p => p.id === productId);
        const courseClass = product?.classes.find(c => c.id === classId);

        if (!product || !courseClass) return;

        setStudents(prevStudents => prevStudents.map(student => {
            return {
                ...student,
                enrollments: student.enrollments.map(enrollment => {
                    if (enrollment.classId === classId && enrollment.enrollmentStatus === EnrollmentStatus.Completed && enrollment.certificateStatus !== CertificateStatus.Issued) {
                        const presenceCount = enrollment.attendance.filter(Boolean).length;
                        const requiredPresence = Math.ceil(enrollment.attendance.length * 0.8);
                        if (presenceCount >= requiredPresence) {
                            issuedCount++;
                            return { ...enrollment, certificateStatus: CertificateStatus.Issued };
                        }
                    }
                    return enrollment;
                })
            };
        }));
        
        if (issuedCount > 0) {
            addActivityLog({ type: ActivityLogType.BATCH_CERTIFICATE_ISSUED, description: `<strong>${issuedCount}</strong> certificados emitidos para a turma <strong>${courseClass.name}</strong>.` });
            alert(`${issuedCount} certificados foram emitidos com sucesso!`);
        } else {
            alert("Nenhum aluno estava apto a receber o certificado nesta turma (requer 80% de presença e status 'Concluído').");
        }
    };


    const handleLogin = (email: string, pass: string): boolean => {
        const user = students.find(s => s.email.toLowerCase() === email.toLowerCase());
        if (user && user.password && user.password === pass) {
             setCurrentUser(user);
             if(user.role !== 'student') {
                setView({ type: 'dashboard' });
             }
             return true;
        }
        return false;
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        window.location.hash = '';
    };

    const handleGenerateInsights = async () => {
        setIsGeneratingInsights(true);
        setIsInsightsModalOpen(true);
        setInsights('');
        try {
            const insightText = await generateInsights({ products, students });
            setInsights(insightText);
        } catch (error) {
            console.error(error);
            setInsights("Ocorreu um erro ao gerar os insights. Tente novamente.");
        } finally {
            setIsGeneratingInsights(false);
        }
    };
    
    // --- Push Notifications ---
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const sendNotification = (title: string, body: string) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body });
        }
    };


    const renderView = () => {
        if (view.type === 'register' && view.id) {
            const product = products.find(p => p.id === view.id);
            return product ? <RegistrationPage product={product} onRegisterStudent={handleRegisterStudent} /> : <div className="text-center p-8">Produto não encontrado.</div>;
        }

        if (!currentUser) {
            return <LoginPage onLogin={handleLogin} />;
        }
        
        if(currentUser.role === 'student') {
             return <StudentDashboard student={currentUser} products={products} onLogout={handleLogout} />;
        }
        
        const mainContent = () => {
            switch (view.type) {
                case 'dashboard':
                    return <Dashboard products={products} students={students} setView={setView} activityLog={activityLog} />;
                case 'enrollment':
                    return <EnrollmentPage products={products} onRegisterStudent={handleRegisterStudent} />;
                case 'product-detail': {
                    const product = products.find(p => p.id === view.id);
                    return product ? <ProductDetail product={product} students={students} setView={setView} onUpdateAttendance={handleUpdateAttendance} onUpdateEnrollmentStatus={handleUpdateEnrollmentStatus} /> : <div>Produto não encontrado.</div>;
                }
                case 'student-profile': {
                    const student = students.find(s => s.id === view.id);
                    return student ? <StudentProfile student={student} products={products} setView={setView} onUpdateStudentProfile={handleUpdateStudentProfile} onEnrollInNewCourse={handleEnrollInNewCourse} onIssueCertificate={handleIssueCertificate} /> : <div>Aluno não encontrado.</div>;
                }
                case 'turmas':
                    // FIX: Removed 'students' prop from TurmasPage as it is not part of its props.
                    return <TurmasPage products={products} setView={setView} onCreateClass={handleCreateClass} />;
                 case 'turma-detail': {
                    const [productId, classId] = view.id?.split('|') || [];
                    const product = products.find(p => p.id === productId);
                    const courseClass = product?.classes.find(c => c.id === classId);
                    const enrolledStudents = students.filter(s => s.enrollments.some(e => e.classId === classId));
                    return (product && courseClass) ? <TurmaDetail product={product} courseClass={courseClass} students={enrolledStudents} setView={setView} onBatchIssueCertificates={handleBatchIssueCertificates} onUpdateClass={handleUpdateClass} /> : <div>Turma não encontrada.</div>;
                }
                case 'financials':
                    return <FinancialsPage students={students} products={products} />;
                default:
                    return <Dashboard products={products} students={students} setView={setView} activityLog={activityLog} />;
            }
        };

        return (
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <Sidebar setView={setView} onLogout={handleLogout} onGenerateInsights={handleGenerateInsights} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {mainContent()}
                </main>
                 <WhatsAppChatbot phoneNumber="5511912345678" message="Olá! Tenho uma dúvida sobre os cursos." />
            </div>
        );
    };

    return (
        <>
            {renderView()}
            {isInsightsModalOpen && <InsightsModal insights={isGeneratingInsights ? "Gerando insights..." : insights} onClose={() => setIsInsightsModalOpen(false)} />}
        </>
    );
};

export default App;