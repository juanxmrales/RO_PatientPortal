const queue = [];
let isSending = false;

async function processQueue() {
    if (isSending || queue.length === 0) return;

    const { user, logEmailSent } = queue.shift();
    console.log(`📬 Procesando envío de correo para: ${user.firstName} ${user.lastName} (${user.email})`);

    isSending = true;

    try {
        await logEmailSent(user);
        console.log(`✅ Correo a ${user.email} procesado exitosamente`);
    } catch (err) {
        console.error(`❌ Error al enviar correo a ${user.email}:`, err);
    } finally {
        isSending = false;
        setImmediate(processQueue);
    }
}

function enqueueEmail(user, logEmailSent) {
    console.log(`⏳ Encolando correo para: ${user.email}`);
    queue.push({ user, logEmailSent });
    processQueue();
}

module.exports = { enqueueEmail };
