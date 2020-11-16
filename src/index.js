const express = require('express');
const cors = require('cors');

const app = express();
var corsOptions = {
    origin: ['179.188.51.20', '187.95.162.30'],
    optionsSuccessStatus: 200
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", corsOptions);
    app.use(cors());
    next();
})

//HOME
app.get('/', cors(corsOptions), (req,res) => {
    res.sendFile(__dirname + '/view/index.html');
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
    const dividaBA = require('./controllers/divida/dividaBA');
    dividaBA(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch((err) => {
        console.log(err);
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

//ROTA DIVIDA RJ
app.get('/dividaAtiva/RJ/:placa/:renavam', cors(corsOptions), (req,res) => {
    const dividaRJ = require('./controllers/divida/dividaRJ');
    dividaRJ(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch((err) => {
        console.log(err);
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

//ROTA DETRAN DF
app.get('/detran/DF/:placa/:renavam', cors(corsOptions), (req,res) => {
    const detranDF = require('./controllers/detran/detranDF');
    detranDF(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch((err) => {
        console.log(err);
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

//ROTA DETRAN MS
app.get('/detran/MS/:placa/:renavam', cors(corsOptions), (req,res) => {
    const detranMS = require('./controllers/detran/detranMS');
    detranMS(req.params.placa, req.params.renavam).then((ret) => {
        res.json(ret);
    }).catch((err) => {
        console.log(err);
        res.json({'status': 0, 'Mensagem': 'Sem retorno'});
    })
});

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Conectado ao servidor com sucesso pela porta " + port);
});