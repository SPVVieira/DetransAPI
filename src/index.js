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

app.get('/:consulta/:uf', cors(corsOptions), async (req,res) => {
    const { consulta, uf } = req.params;
    const { placa, renavam } = req.query;

    if(consulta == 'detran') {
        if(uf == 'MS') {
            navega = require('./controllers/detran/detranMS');
        }else if(uf == 'DF') {
            navega = require('./controllers/detran/detranDF');
        }
    }else if(consulta == 'dividaAtiva') {
        if(uf == 'BA') {
            navega = require('./controllers/divida/dividaBA');
        }else if(uf == 'RJ') {
            navega = require('./controllers/divida/dividaRJ');
        }
    }

    if(!placa && !renavam) {
        return res.json({'status': 0, 'mensagem': 'falta parâmetro placa ou renavam'});
    }else if(!placa) {
        return res.json({'status': 0, 'mensagem': 'falta parâmetro placa'});
    }else if(!renavam) {
        return res.json({'status': 0, 'mensagem': 'falta parâmetro renavam'});
    }else{
        const retorno = await navega(placa, renavam);
        return res.json(retorno);
    }
});

var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Conectado ao servidor com sucesso pela porta " + port);
});