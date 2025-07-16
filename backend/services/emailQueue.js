const queue = [];
let isSending = false;

async function processQueue() {
    if (isSending || queue.length === 0) return;

    const { user, logEmailSent } = queue.shift();
    console.log(`📬 Procesando envío de correo para: ${user.firstName} ${user.lastName} (${user.email})`);

    isSending = true;

    try {
        await logEmailSent(user);
        console.log(`✅ Correo enviado con éxito a ${user.email}`);
    } catch (err) {
        console.error(`❌ Error al enviar correo a ${user.email}:`, err);
    } finally {
        isSending = false;
        setImmediate(processQueue); // continúa con el siguiente
    }
}

function enqueueEmail(user, logEmailSent) {
    console.log(`⏳ Encolando correo para: ${user.email}`);
    queue.push({ user, logEmailSent });
    processQueue();
}

module.exports = { enqueueEmail };
