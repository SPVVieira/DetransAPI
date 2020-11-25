const puppeteer = require('puppeteer');

const detranMS = async (placa, renavam) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--mute-audio']
    });
    const page = await browser.newPage();
    await page.goto('https://www.meudetran.ms.gov.br/veiculo.php#', {waitUntil:'networkidle2'});
    await page.waitForSelector('iframe#ifrm-pdr-portal', {timeout: 5000}).then(async() => {
        const buscaFrames = await page.frames();
        const frame1 = buscaFrames.find(f => f.name() === 'ifrm-pdr-portal');
        await frame1.type('span#id_read_off_placa > input.scFormObjectOddWm', placa, {delay: 50});
        await frame1.type('input#id_sc_field_renavam', renavam, {delay: 50});
        await frame1.click('a#sub_form_b', {
            button: 'left'
        });
        const buscaFrames2 = await page.frames();
        const frame2 = buscaFrames2.find(f => f.name() === 'ifrm-pdr-portal');
        await frame2.waitForSelector('td#hidden_field_data_placa_dumb', {timeout: 5000}).then( async ()=> {
            await frame2.evaluate(() => {
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
        
                debitosGerais = document.querySelectorAll('table > tbody > tr > td >table > tbody > tr > td')[43];
                retornoDebitos = [];
                document.querySelectorAll('table > tbody > tr > td >table > tbody > tr > td')[43].querySelectorAll('table')[1].querySelectorAll('tr').forEach((res) => {
                    retornoDebitos.push({
                        "descricao": res.querySelectorAll('td')[0].innerText,
                        "valor": res.querySelectorAll('td')[1].innerText
                    });
                });
                totalGeral = debitosGerais.querySelectorAll('table')[2].innerText.split('TOTAL GERAL')[1].trim();
        
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
            }).then((ret) => {
                retornoMS = ret.debitosVeiculo;
            }).catch(() => {
                retornoMS = {
                    'status' : 0,
                    'mensagem': 'Sem retorno',
                }
            })
        }).catch(() => {
            retornoMS = {
                'status' : 0,
                'mensagem': 'Sem retorno',
            }
        });
    }).catch(()=>{
        retornoMS = {
            'status' : 0,
            'mensagem': 'Sem retorno',
        }
    });
    await page.close();
    await browser.close();
    return retornoMS;
}

module.exports = detranMS;