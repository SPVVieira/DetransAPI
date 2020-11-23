const puppeteer = require('puppeteer');

const dividaRJ = async (placa, renavam) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://www.consultadividaativa.rj.gov.br/RDGWEBLNX/servlet/StartCISPage?PAGEURL=/cisnatural/NatLogon.html&xciParameters.natsession=Consulta_Debitos_DA', {waitUntil:'networkidle2'});
    await page.waitForTimeout(2000);
    await page.waitForSelector('iframe#WA1');
    const buscaFrames = await page.frames();
    const frame1 = buscaFrames.find(f => f.name() === 'WA1');
    const botaoAvancar = await frame1.$('img#ICONIMG47');
    await botaoAvancar.click();
    await page.waitForTimeout(2000);
    const buscaFrames2 = await page.frames();
    const frame2 = buscaFrames2.find(f => f.name() === 'WA2');
    const selectParam = await frame2.$('select#CDYN_37');
    await selectParam.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    const campoRenavam = await frame2.$('input#F_93');
    await campoRenavam.type(renavam, {delay: 50});
    await page.waitForTimeout(1500);
    const BotaoPesquisar = await frame2.$('img#ICONIMG112');
    await BotaoPesquisar.click({
        button:'left'
    });
    await page.waitForTimeout(3000);
    const status = await frame2.$('td.STATUSBARCell');
    await status.evaluate(() => {
        if(document.querySelectorAll('a.STATUSBARCell')[0] && document.querySelectorAll('a.STATUSBARCell')[0].innerText.trim() == 'RENAVAM não inscrito em Dívida Ativa'){
            return {'status': 2, 'mensagem': document.querySelectorAll('a.STATUSBARCell')[0].innerText.trim()};
        }else{
            return {'status': 1, 'mensagem': "Consta inscrição em dívida ativa"};
        }
    }).then((resp) => {
        retornostatus = resp;
    }).catch(() => {
        retornostatus = {'status': 0, 'mensagem': "ERRO, ENTRAR EM CONTATO COM TI"};
    });
    if(retornostatus && retornostatus.status == 0) {
        retornoFinal = retornostatus;
    }else if (retornostatus && retornostatus.status == 1) {
        const frame3 = await buscaFrames2.find(f => f.name() === 'WA0');
        await frame3.evaluate(() => {
            retornoDebitos = [];
            if(document.querySelectorAll('tr#ITR54')[0]){
                document.querySelectorAll('tr#ITR54')[0].querySelectorAll('span#TEXTGRID55 > table > tbody > tr > td').forEach(element => {
                    retornoDebitos.push(element.innerText.trim());
                });
            }
            return retornoDebitos;
        }).then((resp) => {
            i = 6;      
            retornaDetalDeb = [];
            while(i < resp.length) {
                retornaDetalDeb.push({'certidao': resp[i], 'situacao': resp[i + 1], 'natureza': resp[i + 2], 'debitos': resp[i + 3], 'honorarios': resp[i + 4], 'total': resp[i + 5]});
                i = i + 6;
            }
            if(retornaDetalDeb[0].certidao){
                retornoFinal = {'status': 1, 'mensagem': "Retorno ok", 'retorno': retornaDetalDeb};
            }else{
                retornoFinal = {'status': 0, 'mensagem': "Retorno ok", 'retorno': 'Puxar novamente'};
            }
        }).catch(() => {
            retornoFinal = {'status': 0, 'mensagem': "ERRO, ENTRAR EM CONTATO COM TI"};
        });
    }else if (retornostatus && retornostatus.status == 2) {
        retornoFinal = { 'status': 1, 'mensagem': 'Retorno ok', 'retorno': retornostatus };
    }
    await page.close(); 
    await browser.close();
    return retornoFinal;
}

module.exports = dividaRJ;