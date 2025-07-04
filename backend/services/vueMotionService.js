require ('dotenv').config();


const generateVueMotionUrl = async (patientId) => {
  const endpoint = process.env.VUE_ENDPOINT;
  const user = process.env.VUE_USERNAME;
  const pass = process.env.VUE_PASSWORD;

  const queryString = `user_name=${user}&password=${pass}&patient_id=${patientId}&hide_top=all`;

  const body = {
    AddTS: true,
    UseUTC: true,
    UserName: user,
    QueryString: queryString,
    TimeStampFormat: null,
    Password: pass,
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
    const token = raw.replace(/^"|"$/g, '');
    const redirectUrl = `https://medicos.imagenesmdq.com/portal?urltoken=${token}`;
    return redirectUrl;

  } catch (error) {
    console.error('Error generando token VueMotion:', error);
    throw new Error('No se pudo generar la URL segura');
  }
};

module.exports = { generateVueMotionUrl };
