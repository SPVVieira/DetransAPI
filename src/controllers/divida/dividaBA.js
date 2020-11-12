puppeteer = require('puppeteer');

const dividaBA = async (placa, renavam) => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('https://www.sefaz.ba.gov.br/scripts/ipva/ipva.asp', {waitUntil:'networkidle2'});
    await page.type('input.input', renavam);
    await page.evaluate(()=> {
        document.querySelectorAll('input')[1].className="botao";
    });
    await page.waitForSelector('input.botao');
    await page.click('input.botao',{
        button: "left"
    });
    await page.waitForSelector('table');
    await page.evaluate(() => {
        retornoConsulta = [];
        document.querySelectorAll('table > tbody > tr > td > font').forEach((element) => {
            retornoConsulta.push(element.innerText.trim());
        });
        return retornoConsulta;
    }).then((res) => {
        retorno = {'status': 1, 'mensagem': 'Retorno OK', 'retorno': res};
    }).catch((err) => {
        retorno = {'status': 0, 'mensagem': 'Sem retorno', 'retorno': err};
    });
    
    await page.waitForTimeout(1000);
    regexPlaca = /[A-z]{3}[\s\-]?[0-9]{1}[A-z0-9]{1}[0-9]{2}/;
    regexValor = /R[\$][\s]?[0-9\.]{1,10}[\,][0-9]{2}/;
    regexData = /[0-9]{2}[\/][0-9]{2}[\/][0-9]{2,4}/;
    retornoBA = {'status': retorno.status, 'retorno':{'placa': regexPlaca.exec(retorno.retorno[0])[0], 'marcaModelo': retorno.retorno[1], 'valorPrincipal': regexValor.exec(retorno.retorno[2])[0], 'acrescimo': regexValor.exec(retorno.retorno[3])[0], 'cotaUnica': regexValor.exec(retorno.retorno[4])[0], 'primeiraParcela': regexData.exec(retorno.retorno[5])[0], 'segundaParcela': regexData.exec(retorno.retorno[6])[0], 'terceiraParcela': regexData.exec(retorno.retorno[7])[0], 'cotaUnicaAnterior': regexValor.exec(retorno.retorno[8])[0]}};
    await page.close();
    await browser.close();
    return retornoBA;
}

module.exports = dividaBA;