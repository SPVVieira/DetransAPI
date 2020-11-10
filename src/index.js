const express = require('express');
const cors = require('cors');

const dividaBA = require('./controllers/divida/dividaBA');
const detranDF = require('./controllers/detran/detranDF');
const detranMS = require('./controllers/detran/detranMS');

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

//ROTA DETRAN MS
app.get('/detran/MS/:placa/:renavam', (req,res) => {
    detranMS(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'retorno': 0, 'Mensagem': 'Sem retorno'});
    })
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Conectado ao servidor com sucesso pela porta " + port);
});