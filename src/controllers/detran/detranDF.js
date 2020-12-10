const puppeteer = require('puppeteer');

const detranDF = async (placa, renavam) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--mute-audio']
    });
    const page = await browser.newPage();
    await page.goto('http://getran.detran.df.gov.br/site/veiculos/consultas/filtroplacarenavam-consultaveiculo.jsp');
    await page.waitForSelector('input#PLACA');

    await page.type('input#PLACA', placa);
    await page.type('input#RENAVAM', renavam);
    await page.click('a#CONSULTAR', {
        button: "left"
    });
    await page.waitForTimeout(1000);
    await page.waitForSelector('label#pergunta');
    await page.evaluate(() => {
        valor = document.querySelectorAll('label#pergunta')[0].innerText;
        retorno = /([0-9]{1,3})[\s]([\+\-\*\/])[\s]([0-9]{1,3})/g.exec(valor);
        num1 = parseInt(retorno[1]);
        num2 = parseInt(retorno[3]);

        if(retorno[2] == "+"){
            conta = num1 + num2;
        }else if(retorno[2] == "-") {
            conta = num1 - num2;
        }else if(retorno[2] == "*") {
            conta = num1 * num2;
        }else if(retorno[2] == "/") {
            conta = num1 / num2;
        }
        return conta;
    }).then((ret) => {
        conta = ret;
    }).catch(() => {
        fechaPageBrowser();
    })
    await page.type('input#CODSEG', conta.toString());
    await page.click('a.btn-orange', {
        button: "left"
    });
    await page.waitForSelector('input#Placa', {
        timeout: 5000
    }).catch(()=>{
        fechaPageBrowser();
    });
    await page.evaluate(async () => {
        /////////////////////////////////////Informações do veículo
        let placa = await document.querySelectorAll('input#Placa')[0].value;
        let renavam = await  document.querySelectorAll('input#Renavam')[0].value;
        let chassi = await  document.querySelectorAll('input#Chassi')[0].value;
        let marcaMod = await document.querySelectorAll('input#MarcaModelo')[0].value;
        let cor = await document.querySelectorAll('input#Cor')[0].value;
        let anoFabMod = await document.querySelectorAll('input#AnoGabModelo')[0].value;
        let tipo = await document.querySelectorAll('input#Tipo')[0].value;
        let combustivel = await document.querySelectorAll('input#Combustivel')[0].value;
        let potCilind = await document.querySelectorAll('input#PotenciaCilindradas')[0].value;
        let categoria = await document.querySelectorAll('input#Categoria')[0].value;
        let capacidade = await document.querySelectorAll('input#CapacidadePassageiros')[0].value;
        let especie = await document.querySelectorAll('input#Especie')[0].value;
        let nacionalidade = await document.querySelectorAll('input#Nacionalidade')[0].value;
        let municipio = await document.querySelectorAll('input#Municipio')[0].value;
        let rouboFurto = await document.querySelectorAll('input#RouboFurto')[0].value;
        let situacao = await document.querySelectorAll('input#SituacaoVeiculo')[0].value;
        let anoUltLic = await document.querySelectorAll('input#AnoUltimoLicenciamento')[0].value;
        let restricoes = [];
        if(document.querySelectorAll('input#AnoUltimoLicenciamento')[0] && document.querySelectorAll('input#AnoUltimoLicenciamento')[0].value != '') {
            restricoes.push(document.querySelectorAll('input#restricoes')[0].value);
        }
        let anoUltLic = await document.querySelectorAll('input#AnoUltimoLicenciamento')[0].value;

        let dadosVeiculo = {'placa': placa, 'renavam': renavam, 'chassi': chassi, 'marcaMod': marcaMod, 'cor': cor, 'anoFabMod': anoFabMod, 'tipo': tipo, 'combustivel': combustivel, 'potCilind': potCilind, 'categoria': categoria, 'capacidade': capacidade, 'especie': especie, 'nacionalidade': nacionalidade, 'municipio': municipio, 'rouboFurto': rouboFurto, 'situacao': situacao, 'anoUltLic': anoUltLic, 'restricoes': restricoes};

        ////////////////////////////////////////////Informações licenciamento
        let dataMovimentacao = await document.querySelectorAll('input#DataMovimentacao')[0].value;
        let tipoEntrega = await document.querySelectorAll('input#TipoEntrega')[0].value;

        let informacoesUltLicenc = {'dataMovimentacao': dataMovimentacao, 'tipoEntrega': tipoEntrega};

    ////////////////////////////////////////////////debitos do veiculo

        let paineis = document.querySelectorAll('div#collapseThree > div > div.panel-success');
        paineis.forEach(element => {1
            if(element.querySelector('div.panel-heading').innerText.trim() == 'Licenciamento'){
                if(element.querySelector('div.panel-body').innerText.trim() == 'Não existe(m) débito(s) de Licenciamento até o presente momento.'){
                    statusLic = 0;
                    licRet = [];
                }else{
                    let tabelaLic = element.querySelectorAll('div > div > table')[0];
            
                    linhaLic = tabelaLic.querySelectorAll('tbody > tr');
                    statusLic = 1;
                    licRet = [];
                    i = 1;
                    while (i < linhaLic.length) {
                        celulaLic = linhaLic[i].querySelectorAll('td > div');
                        licRet.push({'ano': celulaLic[0].innerText.trim(), 'vencimento': celulaLic[1].innerText.trim(), 'valor': celulaLic[2].innerText.trim(), 'multa': celulaLic[3].innerText.trim(), 'mora': celulaLic[4].innerText.trim(), 'outros': celulaLic[5].innerText.trim(), 'pago': celulaLic[6].innerText.trim(), 'total': celulaLic[7].innerText.trim()});
                        i++;
                    }
                }

                retornoLicenciamento = {'status': statusLic, 'retornoLic': licRet};

            }else if(element.querySelector('div.panel-heading').innerText.trim() == 'Licença de Utilização Anual'){
                if(element.querySelector('div.panel-body').innerText.trim() == 'Não existe(m) débito(s) de Licença de Utilização Anual até o presente momento.') {
                    statusLicAnual = 0;
                    licAnualRet = [];
                }else {
                    statusLicAnual = 1;
                    licAnualRet = [];
                    console.log("FALTA LICENCA DE UTILIZACAO ANUAL");
                }//AQUI

                retornoLicAnual = {'status': statusLicAnual, 'retornoLicAnual': licAnualRet};

            } else if(element.querySelector('div.panel-heading').innerText.trim() == "IPVA"){

            } else if(element.querySelector('div.panel-heading').innerText.trim() == "Seguro Obrigatório (DPVAT)"){
                if(element.querySelector('div.panel-body').innerText.trim() == 'Não existe(m) débito(s) de Seguro Obrigatório até o presente momento.') {
                    statusDPVAT = 0;
                    DPVATRet = [];
                }else {
                    statusDPVAT = 1;
                    DPVATRet = [];

                    linhasDpvat = element.querySelectorAll('table > tbody > tr');
                    i = 1;
                    while (i < linhasDpvat.length) {
                        celulaDPVAT = linhasDpvat[i].querySelectorAll('td > div');
                        DPVATRet.push({'ano': celulaDPVAT[0].innerText.trim(), 'vencimento': celulaDPVAT[1].innerText.trim(), 'valor': celulaDPVAT[2].innerText.trim()});
                        i++;
                    }
                }

                retornoDPVAT = {'status': statusDPVAT, 'retornoDPVAT': DPVATRet};

            } else if(element.querySelector('div.panel-heading').innerText.trim() == "Serviços do DETRAN"){
                if(element.querySelector('div.panel-body').innerText.trim() == 'Não existe(m) débito(s) de Serviço(s) até o presente momento.') {
                    statusServ = 0;
                    servRet = [];
                }else {
                    statusServ = 1;
                    servRetorno = [];
                    servRet= [];
                    linhasServ = element.querySelectorAll('div.panel-body > div > table > tbody > tr');
                    contServ = 1;

                    while(contServ < (linhasServ.length - 1)){
                        colunasServ = linhasServ[contServ].querySelectorAll('td');
                        servRetorno.push({'atendimento': colunasServ[1].innerText.trim(), 'codServico': colunasServ[2].innerText.trim(), 'descricao': colunasServ[3].innerText.trim(), 'valorLancado': colunasServ[4].innerText.trim(), 'valorPago': colunasServ[5].innerText.trim()});
                        contServ++;
                    }
                    totalServ = linhasServ[linhasServ.length - 1].querySelectorAll('td');
                    servRet = {'totalLancado': totalServ[1].innerText.trim(), 'totalPago': totalServ[2].innerText.trim(), 'servicos': servRetorno};
                }

                retornoServicos = {'status': statusServ, 'retornoServicos': servRet};

            } else if(element.querySelector('div.panel-heading').innerText.trim() == "Parcelamento de Serviços do DETRAN"){
                if(element.querySelector('div.panel-body').innerText.trim() == 'Não existe(m) débito(s) de Parcelamento de Serviço(s) até o presente momento.') {
                    statusParc = 0;
                    parcRet = [];
                }else {
                    statusParc = 1;
                    parcRet = [];
                    console.log("FALTA PARCELAMENTO SERVICO");
                }//AQUI

                retornoParcelamento = {'status': statusParc, 'retornoParcelamento': parcRet};
            }
        });
        
        let retornoDebitosVeiculo = {'licenciamento': retornoLicenciamento, 'licencaAnual': retornoLicAnual, 'DPVAT': retornoDPVAT, 'servicosDetran': retornoServicos, 'parcelamentoServicos': retornoParcelamento};
    //////////////////////////////////////////////////////////////infrações
        let pegaInfracoes = await document.querySelectorAll('div#collapseFive > div > div > div > div > table > tbody > tr > td');

        if(pegaInfracoes[0]){
            statusInfra = 1;
            infracoes = {
                'total': pegaInfracoes[36].innerText.replace(['\n', '\t'], '').trim(),
                'valorTotal': pegaInfracoes[37].innerText.replace(['\n', '\t'], '').trim(), 
                'infracoes': {
                    'vencidas': {'identificacao': pegaInfracoes[0].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[1].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[2].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[3].innerText.replace(['\n', '\t'], '').trim()},
                    'aVencer': {'identificacao': pegaInfracoes[5].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[6].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[7].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[8].innerText.replace(['\n', '\t'], '').trim()},
                    'recursoJari': {'identificacao': pegaInfracoes[10].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[11].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[12].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[13].innerText.replace(['\n', '\t'], '').trim()},
                    'efeitoSuspensivo': {'identificacao': pegaInfracoes[15].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[16].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[17].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[18].innerText.replace(['\n', '\t'], '').trim()},
                    'subJudice': {'identificacao': pegaInfracoes[20].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[21].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[22].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[23].innerText.replace(['\n', '\t'], '').trim()},
                    'parcelas': {'identificacao': pegaInfracoes[25].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[26].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[27].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[28].innerText.replace(['\n', '\t'], '').trim()},
                    'notificacaoAutuacao': {'identificacao': pegaInfracoes[30].innerText.replace(['\n', '\t'], '').trim(), 'quantidade': pegaInfracoes[31].innerText.replace(['\n', '\t'], '').trim(), 'valor': pegaInfracoes[32].innerText.replace(['\n', '\t'], '').trim(), 'valorDesconto': pegaInfracoes[33].innerText.replace(['\n', '\t'], '').trim()}
                }
            }
        }else{
            statusInfra = 0;
            infracoes = {
                'total': 0, 
                'valorTotal': 0,
                'infracoes' : {}
            }
        }

        retornoInfracoes = {'status': statusInfra, 'retorno': infracoes};

        /////////////////////////////////////////////Recursos de infração
        validaRecurso = document.querySelector('div#collapseSix > div > div > div.panel-body');
  
        if(validaRecurso.innerText.trim() == 'Não existem recursos de multas até o presente momento.'){
            recursoStatus = 0;
            retRecurso = [];
        }else{
            recursoStatus = 1;
            retRecurso = [];
            linhasRec = validaRecurso.querySelectorAll('table > tbody > tr');
            contRec = 1;
            while(contRec < linhasRec.length){
                colunaRec = linhasRec[contRec].querySelectorAll('td');
                retRecurso.push({'processo': colunaRec[0].innerText.trim(), 'tipo': colunaRec[1].innerText.trim(), 'dataAbertura': colunaRec[2].innerText.trim(), 'situacao': colunaRec[3].innerText.trim()});
                contRec++;
            }
        }
        retornoRecurso = {'status': recursoStatus, 'retorno': retRecurso};
        
        return {'status': 1, 'mensagem': 'Retorno ok', 'dadosVeiculo': dadosVeiculo, 'infoUltimoLicenciamento': informacoesUltLicenc, 'debitosVeiculo': retornoDebitosVeiculo, 'infracoes': retornoInfracoes, 'recursosInfracao': retornoRecurso};
         
    }).then((retorno1) => {
        fechaPageBrowser();
        retorno = (retorno1);
    }).catch(() => {
        fechaPageBrowser();
        retorno = {'status': 0, 'mensagem': 'Sem retorno'};
    });

    function fechaPageBrowser(){
        page.close();
        browser.close();
    }

    return retorno;
}

module.exports = detranDF;