import { Student, Product, CourseClass } from '../types';

/**
 * Simulates sending an email. In a real application, this would use an email
 * service provider like SendGrid, Mailgun, or Resend.
 * @param to The recipient's email address.
 * @param subject The email subject.
 * @param body The email body (can be HTML).
 * @returns An object indicating success or failure.
 */
const sendEmail = async (to: string, subject: string, body: string): Promise<{ success: boolean; error?: string }> => {
    console.log("--- SIMULATING EMAIL SEND ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log("---------------------------");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate a random failure (e.g., 10% chance of failure) to test error handling
    if (Math.random() < 0.1) {
        const errorMsg = "Simulated API error: Could not connect to email server.";
        console.error("Email simulation failed:", errorMsg);
        return { success: false, error: errorMsg };
    }
    
    // In a real scenario, you'd handle potential errors from the API call.
    console.log("--- EMAIL SENT SUCCESSFULLY ---");
    return { success: true };
};

/**
 * Sends a confirmation email to a student upon successful enrollment.
 * @param student The student who enrolled.
 * @param product The product (course) they enrolled in.
 * @param courseClass The specific class they enrolled in.
 * @returns An object indicating success or failure.
 */
export const sendEnrollmentConfirmation = async (
    student: Pick<Student, 'name' | 'email'>,
    product: Pick<Product, 'name'>,
    courseClass: Pick<CourseClass, 'name' | 'date'>
): Promise<{ success: boolean; error?: string }> => {
    const subject = `Confirmação de Matrícula: ${product.name}`;
    const formattedDate = new Date(courseClass.date).toLocaleString('pt-BR', {
        dateStyle: 'long',
        timeStyle: 'short'
    });
    const body = `
        <h1>Olá, ${student.name}!</h1>
        <p>Sua matrícula no curso <strong>${product.name}</strong> foi confirmada com sucesso.</p>
        <p><strong>Detalhes da Turma:</strong></p>
        <ul>
            <li>Turma: ${courseClass.name}</li>
            <li>Data de Início: ${formattedDate}</li>
        </ul>
        <p>Estamos ansiosos para vê-lo(a) em aula!</p>
        <br/>
        <p>Atenciosamente,</p>
        <p>Equipe Conflu</p>
    `;

    return await sendEmail(student.email, subject, body);
};

/**
 * Sends a notification email when a student's certificate is issued.
 * @param student The student receiving the certificate.
 * @param product The product (course) for which the certificate was issued.
 * @returns An object indicating success or failure.
 */
export const sendCertificateNotification = async (
    student: Pick<Student, 'name' | 'email'>,
    product: Pick<Product, 'name'>
): Promise<{ success: boolean; error?: string }> => {
    const subject = `Seu Certificado do Curso ${product.name} está Disponível!`;
    const body = `
        <h1>Parabéns, ${student.name}!</h1>
        <p>Temos o prazer de informar que seu certificado de conclusão para o curso <strong>${product.name}</strong> foi emitido.</p>
        <p>Você pode visualizá-lo acessando o portal do aluno.</p>
        <p>Esta é uma grande conquista e esperamos que o conhecimento adquirido impulsione sua carreira.</p>
        <br/>
        <p>Atenciosamente,</p>
        <p>Equipe Conflu</p>
    `;
    
    return await sendEmail(student.email, subject, body);
};