const nodemailer = require("nodemailer");
const { pool } = require("../config/database");

const transporter = nodemailer.createTransport({
    host: "mail.radoeste.com",
    port: 465,                  // o 587 para STARTTLS
    secure: true,               // true para 465, false para 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function logEmail({ userId, email, status, type, error }) {
    await pool.execute(
        `INSERT INTO email_logs (userId, email, status, type, error, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [userId, email, status, type, error]
    );
}

async function sendPatientCreatedEmail(patient) {
    const mailOptions = {
        from: '"RO Patient Portal" <' + process.env.MAIL_USER + '>',
        to: patient.email,
        subject: "Registro exitoso en el Portal de Pacientes",
        text: `Hola ${patient.firstName}, tu usuario ha sido creado correctamente. Pronto recibirás acceso al portal.`,
        html: `<p>Hola <strong>${patient.firstName} ${patient.lastName}</strong>,</p>
      <p>Tu cuenta en el Portal de Pacientes fue creada exitosamente.</p>
      <p>Podés acceder en: <a href="http://localhost:3000/">RO_PatientPortal.com/login</a></p>
      <p>Tu usuario es: <strong>${patient.dni}</strong></p>
      <p>Saludos,<br/>Radiográfica Oeste</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);

        await logEmail({
            userId: patient.id,
            email: patient.email,
            status: 'sent',
            type: 'patient-welcome',
            error: null,
        });
    } catch (error) {
        console.error("❌ Error al enviar correo:", error);

        await logEmail({
            userId: patient.id,
            email: patient.email,
            status: 'failed',
            type: 'patient-welcome',
            error: error.message.slice(0, 500),
        });
    }
}

module.exports = { sendPatientCreatedEmail };
