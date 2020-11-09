const puppeteer = require('puppeteer');
const nota = async function notaFiscal(res){
    //Cria um navegador do tipo Chromium
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox']
    });
    //Cria uma nova aba com tamanho especificado se quiser fazer por imagem
    const page = await browser.newPage();

    //Redireciona ao site:
    await page.goto('http://guararema.ginfes.com.br/', {waitUntil:'networkidle2'});
    //Espera o seletor específico para iniciar a aplicação, para evitar erros
    await page.waitForSelector('tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td');
    //Clica no prestador de serviços
    await page.click('tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td',{
        button: "left",
        delay: 500
    });
    //Espera o seletor carregar (Até o login são fixos)
    await page.waitForSelector('input#ext-gen29');
    //Digita o login
    await page.type('input#ext-gen29', '25135879000100');
    //Digita a senha
    await page.type('input#ext-gen33', '11121VUP11847');
    //Clica no botão de login
    await page.click('button.x-btn-text#ext-gen51',{
        button: "left",
        delay: 500
    });
    //Aguarda o primeiro seletor fixo aparecer
    await page.waitForSelector('table > tbody > tr > td > div > img.gwt-Image');
    //Aguarda o segundo seletor
    await page.waitForSelector('div.linkLateral');
    //Clica na emissão de notas
    await page.click('div.linkLateral',{
        button: "left",
        delay: 500
    });
    //Aguarda o seletor para a página carregar
    await page.waitForSelector('input.x-form-text');
    //função que criei para buscar tags específicas e retornar o ID para eu poder aplicar scraping
    await page.evaluate(() => {
        return document.querySelectorAll('img.x-form-trigger')[1].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Função de espera (1 segundo) ** Esta função está para ser descontinuada lembrar de buscar outra solução 

    //Se for CNPJ usa a seta para cima para indicar no combobox
    if(res.tipoDocumento == "CNPJ"){
        await page.waitForTimeout(500);

        //Clica no sletor do tipo de cliente
        await page.click('img#' + tagId,{
            button: "left",
            delay: 500
        });

        await page.keyboard.press('ArrowUp');
        await page.keyboard.press('Enter');
    }

    //Função de espera (0,5 segundo) **
    await page.waitForTimeout(500);
    //Aqui temos variações nos inputs pelo tipo de cliente então fiz duas configurações
    if(res.tipoDocumento == "CNPJ"){
        //Mesma função para pegar ID
        await page.evaluate(() => {
            return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[0].id;
        }).then((ret)=> {
            tagId = ret;
        }).catch((err) => {
            console.log("Erro: " + err);
        });
        //Digita a razão social
        await page.type('input#' + tagId, res.razaoSocial);

        //Mesma função para pegar ID
        await page.evaluate(() => {
            return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[1].id;
        }).then((ret)=> {
            tagId = ret;
        }).catch((err) => {
            console.log("Erro: " + err);
        });
        //Digita o documento
        await page.type('input#' + tagId, res.documento);
        if(res.inscricao != ''){
            //Mesma função para pegar ID
            await page.evaluate(() => {
                return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[2].id;
            }).then((ret)=> {
                tagId = ret;
            }).catch((err) => {
                console.log("Erro: " + err);
            });
            //Digita a inscricao municipal
            await page.type('input#' + tagId, res.inscricao);
        }

    }else if (res.tipoDocumento == "CPF"){
        //Mesma função para pegar ID
        await page.evaluate(() => {
            return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[3].id;
        }).then((ret)=> {
            tagId = ret;
        }).catch((err) => {
            console.log("Erro: " + err);
        });
        //Digita o documento
        await page.type('input#' + tagId, res.documento);

        //Mesma função para pegar ID
        await page.evaluate(() => {
            return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[4].id;
        }).then((ret)=> {
            tagId = ret;
        }).catch((err) => {
            console.log("Erro: " + err);
        });
        //Digita o documento
        await page.type('input#' + tagId, res.razaoSocial);
    }

    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[5].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Digita o CEP
    await page.type('input#' + tagId, res.cep);
    //Clica em pesquisar
    await page.click('table > tbody > tr > td > div > img',{
        button: "left",
        delay: 500
    });
    await page.waitForTimeout(500);
    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[6].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Clica no campo do logradouro para dar CTRL+A e apagar o logradouro gerado
    await page.click('input#' + tagId, {
        button: "left",
        delay: 500
    });
    //Dá CTRL + A e apaga o campo
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyA');
    await page.keyboard.press('Backspace');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyA');
    //Digita o logradouro
    await page.type('input#' + tagId, res.logradouro);

    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[7].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Clica no campo do número para dar CTRL+A e apagar o número gerado
    await page.click('input#' + tagId, {
        button: "left",
        delay: 500
    });
    //Dá CTRL + A e apaga o campo
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyA');
    await page.keyboard.press('Backspace');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyA');
    //Digita o número
    await page.type('input#' + tagId, res.numeroEnd);
    
    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[8].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Clica no campo do bairro para dar CTRL+A e apagar o bairro gerado
    await page.click('input#' + tagId, {
        button: "left",
        delay: 500
    });
    //Dá CTRL + A e apaga o campo
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyA');
    await page.keyboard.press('Backspace');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyA');
    //Digita o bairro
    await page.type('input#' + tagId, res.bairro);
    
    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[9].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Clica no campo do complemento para dar CTRL+A e apagar o complemento gerado
    await page.click('input#' + tagId, {
        button: "left",
        delay: 500
    });
    //Dá CTRL + A e apaga o campo
    await page.keyboard.down('Control');
    await page.keyboard.down('KeyA');
    await page.keyboard.press('Backspace');
    await page.keyboard.up('Control');
    await page.keyboard.up('KeyA');
    //Digita o complemento
    await page.type('input#' + tagId, res.complemento);
    
    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[10].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });

    //Digita o email
    await page.type('input#' + tagId, res.email);
    
    //Mesma função para pegar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[11].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });

    //Digita o telefone
    await page.type('input#' + tagId, res.telefone);

    //Função para retornar ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > input')[1].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //clica no botão de cadastrar
    await page.click('input#' + tagId, {
        button: "left",
        delay: 500
    });
    
    //Função para retornar ID
    await page.evaluate(() => {
        return document.querySelectorAll('table > tbody > tr > td  > em > button')[8].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //clica no botão para ir ao proximo passo
    await page.click('button#' + tagId, {
        button: "left",
        delay: 500
    });
    
    //Aguarda o carregamento
    await page.waitForSelector('div > div > div > div > div > div > div > div > div > div > textarea')

    await page.waitForTimeout(500);
    //Retorna o ID
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > div > img')[7].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Clica no dropbox
    await page.click('img#' + tagId, {
        button: "left",
        delay: 500
    });

    await page.waitForTimeout(500);
    
    //Da enter para selecionar o serviço
    await page.keyboard.press('Enter');

    await page.waitForTimeout(500);
    //Retorna id do campo
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[12].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Digita a aliquota no campo
    await page.type('input#' + tagId, res.aliquota);

    await page.waitForTimeout(500);
    //Digita texto padrão
    textoPadrao = 'Prestação de serviços; Informações de crédito e veicular \nNOTA FISCAL DE SERVIÇOS NO VALOR DE R$ ' + res.valor + ' \nValor aproximado dos tributos R$ ' + res.valorTributado + ' FONTE IBPT';

    await page.type('div > div > div > div > div > div > div > div > div > div > textarea', textoPadrao);

    await page.waitForTimeout(500);
    //Função para retornar id
    await page.evaluate(() => {
        return document.querySelectorAll('fieldset > div > div > div > div > div > div > div > div > div > div > div > input')[15].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    //Digita o valor no campo
    await page.type('input#' + tagId, res.valor);

    await page.waitForTimeout(500);
    //Função para retornar id
    await page.evaluate(() => {
        return document.querySelectorAll('table > tbody > tr > td > em > button')[10].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });
    
    //Clica para avançar
    await page.click('button#' + tagId, {
        button: "left",
        delay: 500
    });

    //Espera carregar
    await page.waitForTimeout(1000);
    //Função para pegar id do botão
    await page.evaluate(() => {
        return document.querySelectorAll('table > tbody > tr > td > em > button')[12].id;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });

    // Clica para emitir a nota
    await page.click('button#' + tagId, {
        button: "left",
        delay: 500
    });

    //tempo para abrir o modal
    await page.waitForTimeout(2000);

    //Aqui vem um enter pra avançar
    await page.keyboard.press('Enter');
    //Tempo para abrir outro modal
    await page.waitForTimeout(2000);
    //salva a página de referência
    const pageTarget = page.target();
    //Dá enter para avançar e abrir o pdf
    await page.keyboard.press('Enter');
    //Tempo para carregar o pdf
    await page.waitForTimeout(2000);
    //verifica se abriu a página
    const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
    //atribui nova página
    const newPage = await newTarget.page();
    //espera carregamento da página
    await newPage.waitForSelector("table.corpo"); //wait for page to be loaded
    //espera o pdf carregar por inteiro antes de salvar
    await newPage.waitForSelector('table.corpo > tbody > tr > td > table > tbody > tr > td > a.titulo');

    await newPage.evaluate(() => {
        return document.querySelectorAll('table > tbody > tr > td > div > span > span')[51].innerText;
    }).then((ret)=> {
        tagId = ret;
    }).catch((err) => {
        console.log("Erro: " + err);
    });

    //nome do pdf
    var pdfNota = 'nf' + tagId + '-' + res.codigoCliente +'.pdf';
    //salva o pdf
    await newPage.pdf({path: './pdf/'+ pdfNota, format: 'A4'});
    //fecha as páginas
    await newPage.close();
    await page.close();
    //fecha o navegador
    await browser.close();

    return pdfNota;
}

module.exports = nota;