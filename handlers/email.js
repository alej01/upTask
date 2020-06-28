const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require ('util');
const mailerConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: mailerConfig.host,
    port: mailerConfig.port,
    auth: {
        user: mailerConfig.user,
        pass: mailerConfig.password
    }
});

exports.generarHTML = (arc, opc = {}) =>{
    const html = pug.renderFile(`${__dirname}/../views/emails/${arc}.pug`, opc);
    return juice(html);
}

exports.enviarEmail = async (op) =>{
    const html = this.generarHTML(op.archivo, op);
    const text = htmlToText.fromString(html);
    
    //this.sendEmail(op, html);
    let info = {
        from: '"UpTask" <no-reply@uptask.com>', // sender address
        to: op.usuario.email, // list of receivers
        subject: op.subject, // Subject line
        text, // plain text body
        html
    };
    const envioEmail = util.promisify(transport.sendMail, transport)
    return envioEmail.call(transport, info);
    
}

exports.sendEmail = async (op) =>{
    const request = require("request-promise");
    men = op.reseturl;
    if (op.archivo == 'resetPassword') {
        RUTA = `http://localhost:32424/SGP/webservice/personas/pass/${op.usuario.email}/${men}`;
    }else{
        RUTA = `http://localhost:32424/SGP/webservice/personas/con/${op.usuario.email}/${men}`;
    }
    request({
        uri: RUTA,
        json: true, // Para que lo decodifique automáticamente 
    }).then(res => {
            console.log(res);
    });
}