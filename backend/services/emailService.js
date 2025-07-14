const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "mail.radoeste.com",
    port: 465,                  // o 587 si usás STARTTLS
    secure: true,               // true para 465, false para 587
    auth: {
        user: process.env.MAIL_USER, // ej: info@tudominio.com
        pass: process.env.MAIL_PASS, // contraseña real o de app
    },
});


async function sendPatientCreatedEmail(patient) {
    const mailOptions = {
        from: '"RO Patient Portal" <' + process.env.MAIL_USER + '>',
        to: patient.email,
        subject: "Registro exitoso en el Portal de Pacientes",
        text: `Hola ${patient.firstName}, tu usuario ha sido creado correctamente. Pronto recibirás acceso al portal.`,
        html: `
      <p>Hola <strong>${patient.firstName} ${patient.lastName}</strong>,</p>
      <p>Tu cuenta en el Portal de Pacientes fue creada exitosamente.</p>
      <p>Podés acceder en: <a href="http://localhost:3000/">RO_PatientPortal.com/login</a></p>
      <p>Tu usuario es: <strong>${patient.dni}</strong></p>
      <p>Saludos,<br/>Radiográfica Oeste</p>
    `,
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendPatientCreatedEmail };
