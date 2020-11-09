const nodemailer = require("nodemailer");

const mail = async function enviaEmail(arquivo, dados) {
    const user = process.env.USER_MAIL_LOCAL;
    const pass = process.env.PASS_MAIL_LOCAL;
    
    const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAIL_LOCAL,
        port: process.env.PORT_MAIL_LOCAL,
        auth: { user, pass }
    });

    await transporter.sendMail({
        from: user,
        to: 'financeiro@companyconferi.com.br',
        replyTo: user,
        subject: "Nota fiscal do Cliente " + dados.razaoSocial + " / código (" + dados.codigoCliente + ") boleto do mês corrente",
        html: '<p><h4>Segue em anexo a Nota Fiscal referente as consultas veiculares do código ' + dados.codigoCliente + '.</h4></p><p><h4>',
        attachments: [{
            filename: arquivo,
            path: './pdf/' + arquivo
        }]
    }).then((retornoOk) => {
        console.log("Email enviado interno");
        console.log(retornoOk);
    }).catch((err) => {
        console.log('Erro ao enviar email interno: ' + err);
    })
    
    await transporter.sendMail({
        from: user,
        to: dados.email,
        replyTo: user,
        subject: "Nota fiscal referente ao boleto do mês corrente",
        html: '<p>Prezado<h3><b> '+ dados.razaoSocial +'</b></h3></p><p><h4>Segue em anexo a Nota Fiscal referente as consultas veiculares.</h4></p><p><h4>Favor acusar o recebimento deste. Agradecemos o contato, estamos a disposição.</h4></p><p><h4><b>Atensiosamente <a href="https://www.companyconferi.com.br/">Financeiro Company Conferi</a></b></h4></p>',
        attachments: [{
            filename: arquivo,
            path: './pdf/' + arquivo
        }]
    }).then((info) => {
        retornoMail = info;
    }).catch((err) => {
        retornoMail = "ERRO!! " + err;
    });
    return await retornoMail;
}

module.exports = mail;