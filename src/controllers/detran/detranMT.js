const puppeteer = require('puppeteer');

const detranMT = async (placa, renavam) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-notifications', '--no-sandbox', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--mute-audio']
    });
    const page = await browser.newPage();
    await page.goto('https://www.detran.mt.gov.br/', {waitUntil:'networkidle2'});
    await page.waitForSelector('span#myPopup');
    await page.evaluate(() => {
        document.querySelectorAll('span#myPopup > span.closer')[0].click();
    });
    await page.type('input#input_placa', placa, { delay: 50 });
    await page.type('input#input_renavam', renavam, { delay: 50 });
    const pageTarget = page.target();
    await page.evaluate(() => {
        document.querySelectorAll('input.dtrn-frm-sub.dtrn-vin.text-size-acessibilidade')[1].click();
    });
    const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);
    const newPage = await newTarget.page();
    await newPage.waitForSelector("div#exibir_cabecalho");
    await newPage.evaluate(() => {
        //Dados veículo
        dadosVeic = [];

        document.querySelectorAll('div#exibir_cabecalho')[0].querySelectorAll('table.gridExtrato > tbody').forEach((a) => {
            dadosVeic.push({
                'placa': a.querySelectorAll('td')[0].innerText.split('\n')[1].trim(),
                'renavam': a.querySelectorAll('td')[1].innerText.split('\n')[1].trim(),
                'placaAnterior': a.querySelectorAll('td')[2].innerText.split('\n')[1].trim(),
                'tipo': a.querySelectorAll('td')[3].innerText.split('\n')[1].trim(),
                'categoria': a.querySelectorAll('td')[4].innerText.split('\n')[1].trim(),
                'especie': a.querySelectorAll('td')[5].innerText.split('\n')[1].trim(),
                'lugares': a.querySelectorAll('td')[6].innerText.split('\n')[1].trim(),
                'marcaModelo': a.querySelectorAll('td')[7].innerText.split('\n')[1].trim(),
                'anoFabMod': a.querySelectorAll('td')[8].innerText.split('\n')[1].trim(),
                'potencia': a.querySelectorAll('td')[9].innerText.split('\n')[1].trim(),
                'combustivel': a.querySelectorAll('td')[10].innerText.split('\n')[1].trim(),
                'cor': a.querySelectorAll('td')[11].innerText.split('\n')[1].trim(),
                'carreceria': a.querySelectorAll('td')[12].innerText.split('\n')[1].trim(),
                'nomeProprietario': a.querySelectorAll('td')[13].innerText.split('\n')[1].trim(),
                'situacaoLacre': a.querySelectorAll('td')[14].innerText.split('\n')[1].trim(),
                'proprietarioAnterior': a.querySelectorAll('td')[15].innerText.split('\n')[1].trim(),
                'origemDados': a.querySelectorAll('td')[16].innerText.split('\n')[1].trim(),
                'municipioEmplacamento': a.querySelectorAll('td')[17].innerText.split('\n')[1].trim(),
                'licenciadoAte': a.querySelectorAll('td')[18].innerText.split('\n')[1].trim(),
                'adquirido': a.querySelectorAll('td')[19].innerText.split('\n')[1].trim(),
                'situacao': a.querySelectorAll('td')[20].innerText.split('\n')[1].trim(),
                'restricaoVenda': a.querySelectorAll('td')[21].innerText.split('\n')[1].trim(),
                'SNG': a.querySelectorAll('td')[22].innerText.split('\n')[1].trim(),
                'impedimentos': a.querySelectorAll('td')[23].innerText.split('\n')[1].trim(),
                'dividaAtivaLic': a.querySelectorAll('td')[24].innerText.split('\n')[1].trim(),
            });
            
        });
        //Débitos veiculo
        if(document.querySelectorAll('div#div_servicos_Debitos')[0].innerText.trim() == 'Nenhum débito em aberto cadastrado para este veículo.') {
            debitosVeic = {'status': 0, 'mensagem': document.querySelectorAll('div#div_servicos_Debitos')[0].innerText.trim()};
        }else {
            arrayDebitos = [];
            document.querySelectorAll('div#div_servicos_Debitos')[0].querySelectorAll('table.gridExtrato')[0].querySelectorAll('form#integral')[0].querySelectorAll('table > tbody > tr').forEach((res) => {
                if(res.querySelectorAll('td')[7] && res.querySelectorAll('td')[0].innerText.trim() != 'Descrição') {
                    arrayDebitos.push({
                        'descricao': res.querySelectorAll('td')[0].innerText.trim(),
                        'vencimento': res.querySelectorAll('td')[1].innerText.trim(),
                        'nominal': res.querySelectorAll('td')[2].innerText.trim(),
                        'corrigido': res.querySelectorAll('td')[3].innerText.trim(),
                        'desconto': res.querySelectorAll('td')[4].innerText.trim(),
                        'juros': res.querySelectorAll('td')[5].innerText.trim(),
                        'multa': res.querySelectorAll('td')[6].innerText.trim(),
                        'atual': res.querySelectorAll('td')[7].innerText.trim(),
                    });
                }
            });
            debitosVeic = {'status': 1, 'mensagem': 'Constam débitos para o veículo', 'retorno': arrayDebitos};
        }

        //Autuações
        if(document.querySelectorAll('div#exibir_servicos_Autuacoes')[0].querySelectorAll('div')[0].innerText.trim() == 'Nenhuma Notificação de Autuação realizada para este veículo até o momento.') {
            autuacoes = {'status': 0, 'mensagem': document.querySelectorAll('div#exibir_servicos_Autuacoes')[0].querySelectorAll('div')[0].innerText.trim()};
        }else {
            arrayAutuacao = [];
            document.querySelectorAll('div#exibir_servicos_Autuacoes')[0].querySelectorAll('table.gridExtrato > tbody > tr').forEach((res) => {
                if(res.querySelectorAll('td')[4]) {
                    if(res.querySelectorAll('td')[12]) {
                        arrayAutuacao.push({
                            'numAutuacao': res.querySelectorAll('td')[1].innerText.trim(),
                            'renainf': res.querySelectorAll('td')[2].innerText.trim(),
                            'situacao': res.querySelectorAll('td')[3].innerText.trim(),
                            'descricao': res.querySelectorAll('td')[5].innerText.trim(),
                            'localHora': res.querySelectorAll('td')[6].innerText.trim(),
                            'local': res.querySelectorAll('td')[8].innerText.trim(),
                            'complemento': res.querySelectorAll('td')[9].innerText.trim(),
                            'valor': res.querySelectorAll('td')[11].innerText.trim(),
                            'outrosValores': res.querySelectorAll('td')[12].innerText.trim()
                        });
                    }else{
                        //Config
                    }

                }
            });
            autuacoes = {'status': 1, 'mensagem': 'Consta(m) infração(ões)', 'retorno': arrayAutuacao};

        }

        //Multas
        if(document.querySelectorAll('div#exibir_servicos_Multas')[0].querySelectorAll('div')[0].innerText.trim() == 'Nenhuma multa em aberto cadastrada para este veículo até o momento.') {
            multas = {'status': 0, 'mensagem': document.querySelectorAll('div#exibir_servicos_Multas')[0].querySelectorAll('div')[0].innerText.trim()};
        }else {
            arrayMultas = [];
            document.querySelectorAll('div#exibir_servicos_Multas')[0].querySelectorAll('table.gridExtrato > tbody > tr').forEach((res) => {

                if(res.querySelectorAll('td')[4]) {
                    if(res.querySelectorAll('td')[12]){
                        arrayMultas.push({
                            'numAutuacao': res.querySelectorAll('td')[1].innerText.trim(),
                            'renainf': res.querySelectorAll('td')[2].innerText.trim(),
                            'situacao': res.querySelectorAll('td')[3].innerText.trim(),
                            'descricao': res.querySelectorAll('td')[5].innerText.trim(),
                            'localHora': res.querySelectorAll('td')[6].innerText.trim(),
                            'local': res.querySelectorAll('td')[8].innerText.trim(),
                            'complemento': res.querySelectorAll('td')[9].innerText.trim(),
                            'valor': res.querySelectorAll('td')[11].innerText.trim(),
                            'outrosValores': res.querySelectorAll('td')[12].innerText.trim()
                        });
                    }else {
                        arrayMultas.push({
                            'numAutuacao': res.querySelectorAll('td')[1].innerText.trim(),
                            'renainf': '',
                            'situacao': res.querySelectorAll('td')[2].innerText.trim(),
                            'descricao': res.querySelectorAll('td')[4].innerText.trim(),
                            'localHora': res.querySelectorAll('td')[5].innerText.trim(),
                            'local': res.querySelectorAll('td')[7].innerText.trim(),
                            'complemento': res.querySelectorAll('td')[8].innerText.trim(),
                            'valor': res.querySelectorAll('td')[10].innerText.trim(),
                            'outrosValores': res.querySelectorAll('td')[11].innerText.trim()
                        });
                    }

                }
            });
            multas = {'status': 1, 'mensagem': 'Constam multas', 'retorno': arrayMultas};
        }

        //Multas conveniadas
        if(document.querySelectorAll('div#exibir_servicos_DebitosGestaoAutuador')[0].querySelectorAll('div')[0].innerText.trim() == 'Nenhum débito em aberto cadastrado para este veículo.') {
            multasConveniados = {'status': 0, 'mensagem': document.querySelectorAll('div#exibir_servicos_DebitosGestaoAutuador')[0].querySelectorAll('div')[0].innerText.trim(), 'total': ''};
        }else {
            arrayMultasConveniadas = [];

            document.querySelectorAll('div#exibir_servicos_DebitosGestaoAutuador')[0].querySelectorAll('table > tbody > tr > td > table')[1].querySelectorAll('tbody > tr').forEach((res) => {
                if(res.querySelectorAll('td')[0].innerText.trim() != 'Clique aqui para imprimir o boleto' && res.querySelectorAll('td')[0].innerText.trim() != 'Órgão Autuador') {
                    if(res.querySelectorAll('td')[5]) {
                        arrayMultasConveniadas.push({
                            'orgaoAutuador': res.querySelectorAll('td')[0].innerText.trim(),
                            'numAuto': res.querySelectorAll('td')[1].innerText.trim(),
                            'dataInfra': res.querySelectorAll('td')[2].innerText.trim(),
                            'vencimento': res.querySelectorAll('td')[3].innerText.trim(),
                            'valor': res.querySelectorAll('td')[4].innerText.trim(),
                            'dataInclusao': res.querySelectorAll('td')[5].innerText.trim(),
                        });
                    }else{
                        total = res.querySelectorAll('td')[0].innerText.trim();
                    }
                }
            });

            multasConveniados = {'status': 1, 'mensagem': 'Constam multas conveniadas', 'total': total, 'retorno': arrayMultasConveniadas};
        }

        //Recursos
        if(document.querySelectorAll('div#exibir_servicos_Recursos')[0].querySelectorAll('div')[0].innerText.trim() == 'Nenhuma Processo de Recurso de Infração cadastrado para este veículo até o momento.') {
            recursos = {'status': 0, 'mensagem': document.querySelectorAll('div#exibir_servicos_Recursos')[0].querySelectorAll('div')[0].innerText.trim()};
        }else {
            arrayRecursos = [];
            document.querySelectorAll('div#exibir_servicos_Recursos')[0].querySelectorAll('table.gridExtrato > tbody > tr').forEach((res) => {
                if(res.querySelectorAll('td')[17]) {
                    arrayRecursos.push({
                        'processo': res.querySelectorAll('td')[1].innerText.trim(),
                        'data': res.querySelectorAll('td')[2].innerText.trim(),
                        'situacao': res.querySelectorAll('td')[3].innerText.trim(),
                        'renainf': res.querySelectorAll('td')[5].innerText.trim(),
                        'numAutuacao': res.querySelectorAll('td')[9].innerText.trim(),
                        'detalheInfra': res.querySelectorAll('td')[13].innerText.trim(),
                        'localData': res.querySelectorAll('td')[14].innerText.trim(),
                        'detalheLocal': res.querySelectorAll('td')[15].innerText.trim(),
                        'resultado': res.querySelectorAll('td')[17].innerText.trim()
                    });
                }else{
                    //config
                }
            });
            recursos = {'status': 1, 'mensagem': 'Constam recursos', 'retorno': arrayRecursos};

        }

        //Ultimos processos
        if(document.querySelectorAll('div#div_servicos_UltimoProcesso')[0].querySelectorAll('table > tbody > tr > td') && document.querySelectorAll('div#div_servicos_UltimoProcesso')[0].querySelectorAll('table > tbody > tr > td').length > 4) {
            arrayProcessos = [];
            document.querySelectorAll('div#div_servicos_UltimoProcesso')[0].querySelectorAll('table > tbody > tr').forEach((res) => {
                if(res.querySelectorAll('td')[0].innerText.trim() != 'Processo'){
                    arrayProcessos.push({
                        'processo': res.querySelectorAll('td')[0].innerText.trim(),
                        'interessado': res.querySelectorAll('td')[1].innerText.trim(),
                        'servico': res.querySelectorAll('td')[2].innerText.trim(),
                        'operacao': res.querySelectorAll('td')[3].innerText.trim()
                    });
                }
            });
            ultimosProcessos = {'status': 1, 'mensagem': 'Constam ultimos processos', 'retorno': arrayProcessos};
        }else {
            ultimosProcessos = {'status': 0, 'mensagem': 'Não constam ultimos processos'};
        }

        //Recall
        if(document.querySelectorAll('div#exibir_servicos_Recall')[0].querySelectorAll('div')[0].innerText.trim() == 'Veículo não possui nenhum Recall.') {
            recall = {'status': 0, 'mensagem': document.querySelectorAll('div#exibir_servicos_Recall')[0].querySelectorAll('div')[0].innerText.trim()};
        }else {
            recall = [];
            document.querySelectorAll('div#exibir_servicos_Recall')[0].querySelectorAll('table.gridExtrato > tbody > tr').forEach((res) => { 
                if(res.querySelectorAll('td')[8] && res.querySelectorAll('td')[0].innerText != 'ID') {
                    recall.push({ 
                        'id': res.querySelectorAll('td')[0].innerText,
                        'nomeRecall': res.querySelectorAll('td')[1].innerText,
                        'defeito': res.querySelectorAll('td')[2].innerText,
                        'ataRegistro': res.querySelectorAll('td')[3].innerText,
                        'prazoServico': res.querySelectorAll('td')[4].innerText,
                        'situacao': res.querySelectorAll('td')[5].innerText,
                        'concessionaria': res.querySelectorAll('td')[6].innerText,
                        'realizadoEm': res.querySelectorAll('td')[7].innerText,
                        'dataInclusao': res.querySelectorAll('td')[8].innerText 
                    });
                }
            });
            recall = {'status': 1, 'mensagem': recall};
        }

        //Historico de impedimento
        if(document.querySelectorAll('div#exibir_servicos_historicoimpedimento')[0].querySelectorAll('div')[0].innerText.trim() == 'Nenhum impedimento cadastrado para este veículo.') {
            historicoImpedimentos = {'status': 0, 'mensagem': document.querySelectorAll('div#exibir_servicos_historicoimpedimento')[0].querySelectorAll('div')[0].innerText.trim()};
        }else {
            arrayHistorico = [];

            document.querySelectorAll('div#exibir_servicos_historicoimpedimento')[0].querySelectorAll('table.gridExtrato > tbody > tr').forEach((res) => {
                arrayHistorico.push({
                    'impedimento': res.querySelectorAll('td')[0].innerText.split('\n')[1].trim(),
                    'observacao': res.querySelectorAll('td')[1].innerText.split('\n')[1].trim(),
                    'tipoBloqueio': res.querySelectorAll('td')[2].innerText.split('\n')[1].trim(),
                    'dataInclusao': res.querySelectorAll('td')[3].innerText.split('\n')[1].trim(),
                });
            });

            historicoImpedimentos = {'status': 1, 'mensagem': 'Consta histórico de impedimento', 'retorno': arrayHistorico};
        }

        return {'dadosVeiculo': dadosVeic, 'debitosVeiculo': debitosVeic, 'autuacoes': autuacoes, 'multas': multas, 'multasConveniadas': multasConveniados, 'recursos': recursos, 'ultimoProcessos': ultimosProcessos, 'recall': recall, 'historicoImpedimento': historicoImpedimentos};
    }).then((ret) => {
        retornoConsulta = {'status': 1, 'retorno': ret};

    }).catch((err) => {
        retornoConsulta = {'status': 0, 'mensagem': err, 'retorno': 'Sem retorno'};
    });

    await page.close();
    await browser.close();
    return retornoConsulta;
}

module.exports = detranMT;