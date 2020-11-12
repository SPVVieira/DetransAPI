const express = require('express');
const cors = require('cors');

const dividaBA = require('./controllers/divida/dividaBA');
const dividaRJ = require('./controllers/divida/dividaRJ');
const detranDF = require('./controllers/detran/detranDF');
const detranMS = require('./controllers/detran/detranMS');

const app = express();
var corsOptions = {
    origin: ['179.188.51.20', '187.95.162.30'],
    optionsSuccessStatus: 200
}

//HOME
app.get('/', cors(corsOptions), (req,res) => {
    res.sendFile(__dirname + '/view/index.html');
});

//EXPLICAÇÃO NOTA 
app.get('/notaFiscal', cors(corsOptions), (req,res) => {
    res.sendFile(__dirname + '/view/notaFiscal.html');
});

//EXPLICAÇÃO DETRAN
app.get('/detran', cors(corsOptions), (req,res) => {
    res.sendFile(__dirname + '/view/detran.html');
});

//EXPLICAÇÃO DIVIDA
app.get('/dividaAtiva', cors(corsOptions), (req,res) => {
    res.sendFile(__dirname + '/view/dividaAtiva.html');
});

//ROTA DIVIDA BA
app.get('/dividaAtiva/BA/:placa/:renavam', cors(corsOptions), (req,res) => {
    dividaBA(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

//ROTA DIVIDA RJ
app.get('/dividaAtiva/RJ/:placa/:renavam', cors(corsOptions), (req,res) => {
    dividaRJ(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

//ROTA DETRAN DF
app.get('/detran/DF/:placa/:renavam', cors(corsOptions), (req,res) => {
    detranDF(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

//ROTA DETRAN MS
app.get('/detran/MS/:placa/:renavam', cors(corsOptions), (req,res) => {
    detranMS(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch(() => {
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Conectado ao servidor com sucesso pela porta " + port);
});