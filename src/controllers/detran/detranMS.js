const puppeteer = require('puppeteer');

const detranMS = async (placa, renavam) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--mute-audio']
    });
    const page = await browser.newPage();
    await page.goto('https://www.meudetran.ms.gov.br/veiculo_debito_frm/index.php?where_ssn=Ativo%20=%201%20AND%20Placa=%27' + placa + '%27', {waitUntil:'networkidle2'});
    await page.waitForSelector('td#hidden_field_data_placa_dumb').then( async ()=> {
        await page.evaluate(() => {
            placa = document.querySelectorAll('table > tbody > tr > td > span')[10].innerText;
            renavam = document.querySelectorAll('table > tbody > tr > td > span')[12].innerText;
            chassi = document.querySelectorAll('table > tbody > tr > td > span')[14].innerText;
            cor = document.querySelectorAll('table > tbody > tr > td > span')[16].innerText;
            categoria = document.querySelectorAll('table > tbody > tr > td > span')[18].innerText;
            motor = document.querySelectorAll('table > tbody > tr > td > span')[20].innerText;
            anoFabMod = document.querySelectorAll('table > tbody > tr > td > span')[22].innerText;
            dataExpedicao = document.querySelectorAll('table > tbody > tr > td > span')[24].innerText;
            licenciadoAte = document.querySelectorAll('table > tbody > tr > td > span')[26].innerText;
            marca = document.querySelectorAll('table > tbody > tr > td > span')[28].innerText;
            municipio = document.querySelectorAll('table > tbody > tr > td > span')[30].innerText;
            licenciamentoDigital = document.querySelectorAll('table > tbody > tr > td > span')[32].innerText;
            if(document.querySelectorAll('table > tbody > tr > td > span')[34].innerText == "NAO HA DEBITOS PARA ESTE VEICULO") {
                observacoes = document.querySelectorAll('table > tbody > tr > td > span')[34].innerText;
            }else {
                boxObservacoes = document.querySelectorAll('table > tbody > tr > td')[76];
                observacoes = [];
                boxObservacoes.querySelectorAll('table > tbody > tr > td > span > li').forEach(element => {
                    observacoes.push(element.innerText);
                });
            }
    
            objDadosVeiculo = {
                'placa': placa,
                'renavam': renavam,
                'chassi': chassi,
                'cor': cor,
                'categoria': categoria,
                'motor': motor,
                'anoFabMod': anoFabMod,
                'dataExpedicao': dataExpedicao,
                'licenciadoAte': licenciadoAte,
                'marca': marca,
                'municipio': municipio,
                'licenciamentoDigital': licenciamentoDigital,
                'observacoes': observacoes
                
            };
    
            debitosGerais = document.querySelectorAll('table > tbody > tr > td >table > tbody > tr > td')[43].innerText;
            retornoDebitos = [];
            retornoLinhas = debitosGerais.split("Valor (R$)")[1].trim().split("\n").forEach(debitos => {
                if(debitos.trim() != ''){
                    retornoDebitos.push(debitos.trim());
                }
            });
            totalGeral = debitosGerais.split('TOTAL GERAL')[1].trim();
    
            objDebitos = {
                'totalGeral': totalGeral,
                'debitos': retornoDebitos
            };
    
            return {
                'status' : 1,
                'mensagem': 'Retorno ok',
                'dadosVeiculo': objDadosVeiculo,
                'debitosVeiculo': objDebitos
            }
        }).then((retornoVeiculo) => {
            retornoMS = retornoVeiculo;
        }).catch((err) => {
            console.log('ERRO ' + err);
            retornoMS = {
                'status' : 0,
                'mensagem': 'Sem retorno'
            }
        });
    }).catch(() => {
        retornoMS = {
            'status' : 0,
            'mensagem': 'Sem retorno'
        }
    })
    
    await page.waitForTimeout(500);
    await page.close();
    await browser.close();
    return retornoMS;
}

module.exports = detranMS;