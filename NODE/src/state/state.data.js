//!  creación del "test" para saber si se ha enviado el mail, es un util.

let testEmailSend = false;
//!! importante siempre que se consuma el estado tenemos que volver en el controlador al final a su estado incial

const setTestEmailSend = (data) => {
  testEmailSend = data;
};

const getTestEmailSend = () => {
  return testEmailSend;
};

module.exports = { setTestEmailSend, getTestEmailSend };

//! ahora lo llevamos a un util, para que después lo pueda pillar el controller.
