const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); //estilos lineales
const htmlToText = require('html-to-text');
const util = require('util'); //para hacer que sendmail acepte async y await
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  });

  //generar html
  const generarHTML = (archivo,opciones ={}) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);

  }

exports.enviar = async (opciones) => {
    // send mail with defined transport object
    const html = generarHTML(opciones.archivo, opciones);
    const text =  htmlToText.fromString(html);
    
    let opcionesEmail =  
    {
      from: '"Gsoft Administrador de Proyectos" <no-reply@gsoft.com>', // sender address
      to: opciones.usuario.email, // list of receivers
      subject: opciones.subject, // Subject line
      text,
      html 
  }
  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport,opcionesEmail);
}

