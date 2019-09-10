const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); //estilos lineales
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
  });

  // send mail with defined transport object
  let mailOptions =  
  {
    from: '"Gsoft Administrador de Proyectos" <no-reply@gsoft.com>', // sender address
    to: 'prueba@gmail.com', // list of receivers
    subject: 'Cambio de Password', // Subject line
    text: 'Prueba', // plain text body
    html: '<b>Esto es una prueba</b>' // html body
}

transport.sendMail(mailOptions);