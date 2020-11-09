const express = require('express');
const cors = require('cors');
const mail = require('./controllers/nfs/mail');
const nota = require('./controllers/nfs/nota');

const dividaBA = require('./controllers/divida/dividaBA');
const detranDF = require('./controllers/detran/detranDF');

const app = express();

app.use(cors({origin: 'https://www.companyconferi.com.br/'}));
//HOME
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/view/index.html');
});
//EXPLICAÇÃO NOTA 
app.get('/notaFiscal', (req,res) => {
    res.sendFile(__dirname + '/view/notaFiscal.html');
});
//EXPLICAÇÃO DETRAN
app.get('/detran', (req,res) => {
    res.sendFile(__dirname + '/view/detran.html');
});
//EXPLICAÇÃO DIVIDA
app.get('/dividaAtiva', (req,res) => {
    res.sendFile(__dirname + '/view/dividaAtiva.html');
});
//ROTA DIVIDA BA
app.get('/dividaAtiva/BA/:placa/:renavam', (req,res) => {
    dividaBA(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'retorno': 0, 'Mensagem': 'Sem retorno'});
    })
});
//ROTA DETRAN DF
app.get('/detran/DF/:placa/:renavam', (req,res) => {
    detranDF(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'retorno': 0, 'Mensagem': 'Sem retorno'});
    })
});
//ROTA NOTA FISCAL
app.get('/notaFiscal/emissao', (req,res) => {
        retornoDados = {
            'codigoCliente': '123',
            'empresaCadastro': 'CREDCOMPANY',
            'tipoDocumento': 'CPF',
            'documento': '46219956850',
            'razaoSocial': 'Victor Hugo de Paula Vieira',
            'inscricao': '',
            'cep': '08900000',
            'cidade': 'GUARAREMA',
            'estado': 'SÃO PAULO',
            'bairro': 'Centro',
            'logradouro': 'Rua peixoto',
            'numeroEnd': '371',
            'complemento': 'Casa 02',
            'telefone': '11942415211',
            'email': 'victor10jb@hotmail.com',
            'valor': '100,00',
            'valorTributado': '18,45',
            'aliquota': '3,34'
        };
        nota(retornoDados).then((result)=>{
            mail(result, retornoDados).then((respostaEmail) => {
                if(respostaEmail.accepted == retornoDados.email){
                    res.send({"retorno": 1, "Resposta": "Email enviado"});
                }else if(respostaEmail.rejected == retornoDados.email){
                    res.send({"retorno": 0, "Resposta": "Falha no envio do email"});
                }else{
                    res.send(respostaEmail);
                }
            }).catch((err) => {
                console.log("ERRO EMAIL: " + err);
                res.send({"retorno": 0, "Resposta": "Falha no envio do email"});
            });
        }).catch((err) => {
            console.log("ERRO EMISSÃO NOTA: " + err);
            res.send({"retorno": 0, "Resposta": "Falha na emissao da nota"});
        });
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Conectado ao servidor com sucesso pela porta " + port);
});