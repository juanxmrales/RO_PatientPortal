const generateVueMotionUrl = async (patientId) => {
  const endpoint = 'https://medicos.imagenesmdq.com/portal/CSPublicQueryService/CSPublicQueryService.svc/json/EncryptQSSecure?embed_cred=1';

  const queryString = `user_name=administrator&password=kodakmdq200&patient_id=${patientId}&hide_top=all`;

  const body = {
    AddTS: true,
    UseUTC: true,
    UserName: 'administrator',
    QueryString: queryString,
    TimeStampFormat: null,
    Password: 'kodakmdq200',
    IsSSO: false
  };

  console.log('[Body enviado a Vue Motion]', body);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const raw = await response.text();
    const token = raw.replace(/^"|"$/g, ''); // quitar comillas dobles
    const redirectUrl = `https://medicos.imagenesmdq.com/portal?urltoken=${token}`;
    return redirectUrl;

  } catch (error) {
    console.error('Error generando token VueMotion:', error);
    throw new Error('No se pudo generar la URL segura');
  }
};

module.exports = { generateVueMotionUrl };
