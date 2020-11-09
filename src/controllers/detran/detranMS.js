const puppeteer = require('puppeteer');

async function detranMS(placa, renavam) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-notifications', '--no-sandbox'],
        ignoreDefaultArgs: ['--mute-audio']
    });
    const page = await browser.newPage();
    await page.goto('https://www.meudetran.ms.gov.br/veiculo.php');
    await page.waitForTimeout(3000);
    await page.evaluate((placa , renavam) => {
        document.getElementById('id_sc_field_placa').value=placa;
        document.getElementById('id_sc_field_renavam').value=renavam;
        document.querySelectorAll('table > tbody > tr > td > a.scButton_default')[2].click();
    }, placa, renavam);

}

detranMS('hma0001', '00149177178');