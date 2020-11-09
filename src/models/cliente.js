module.exports = class Cliente  {
    constructor(codigoCliente) {
        this.codigoCliente = codigoCliente;
    }

    validaEstadoUF(estado) {
        var arrayEstado = [];
        arrayEstado  = {
            'RO': 'RONDÔNIA',
            'AC': 'ACRE',
            'AM': 'AMAZONAS',
            'RR': 'RORAIMA',
            'PA': 'PARÁ',
            'AP': 'AMAPÁ',
            'TO': 'TOCANTINS',
            'MA': 'MARANHÃO',
            'PI': 'PIAUÍ',
            'CE': 'CEARÁ',
            'RN': 'RIO GRANDE DO NORTE',
            'PB': 'PARAÍBA',
            'PE': 'PERNAMBUCO',
            'AL': 'ALAGOAS',
            'SE': 'SERGIPE',
            'BA': 'BAHIA',
            'MG': 'MINAS GERAIS',
            'ES': 'ESPÍRITO SANTO',
            'RJ': 'RIO DE JANEIRO',
            'SP': 'SÃO PAULO',
            'PR': 'PARANÁ',
            'SC': 'SANTA CATARINA',
            'RS': 'RIO GRANDE DO SUL',
            'MS': 'MATO GROSSO DO SUL',
            'MT': 'MATO GROSSO',
            'GO': 'GOIÁS',
            'DF': 'DISTRITO FEDERAL'
        };
        if(estado.length == 2) {
            this.estado = arrayEstado[estado.toUpperCase()];
        }else if(estado == null){
            this.estado = '';
        }else{
            this.estado = estado.toUpperCase();
        }
    }

    validaTipoDocumento(documento) {
        if(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(documento) == true){
            this.tipoDocumento = "CPF";
        }else if(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(documento) == true){
            this.tipoDocumento = "CNPJ";
        }else {
            this.tipoDocumento = null;
        }
    }

    setEmpresaCadastro(empresaCadastro) {
        if(empresaCadastro == 'CREDCOMPANY'){
            this.aliquota = '3,34';
        }else if(empresaCadastro == 'SOLUCOES'){
            this.aliquota = '2,01';
        }
        this.empresaCadastro = empresaCadastro.toUpperCase();
    }

    getEmpresaCadastro() {
        return this.empresaCadastro;
    }

    setRazaoSocial(razaoSocial) {
        this.razaoSocial = razaoSocial.toUpperCase();
    }

    getRazaoSocial() {
        return this.razaoSocial;
    }
    
    setDocumento(documento) {
        this.documento = documento.replace(/\D/g,'');
    }

    getTipoDocumento() {
        return this.tipoDocumento;
    }

    getDocumento() {
        return this.documento;
    }

    setInscricao(inscricao) {
        if(inscricao == undefined) {
            inscricao = '';
        }else if(inscricao == null) {
            inscricao = '';
        }

        this.inscricao = inscricao;
    }

    getInscricao() {
        return this.inscricao;
    }

    setCep(cep) {
        this.cep = cep.replace(/\D/g,'');
    }

    getCep() {
        return this.cep;
    }

    setCidade(cidade) {
        this.cidade = cidade.toUpperCase();
    }

    getCidade() {
        return this.cidade;
    }

    getEstado() {
        return this.estado;
    }

    setLogradouro(logradouro) {
        if(logradouro == null) {
            this.logradouro = '';
        }else if(logradouro == undefined) {
            this.logradouro = '';
        }else{
            this.logradouro = logradouro.toUpperCase();
        }
    }

    getLogradouro() {
        return this.logradouro;
    }

    setNumeroEnd(numero) {
        this.numeroEnd = numero;
    }

    getNumeroEnd() {
        return this.numeroEnd;
    }

    setComplemento(complemento) {
        if(complemento == null) {
            this.complemento = '';
        }else if(complemento == undefined) {
            this.complemento = '';
        }else{
            this.complemento = complemento.toUpperCase();
        }
    }

    getComplemento() {
        return this.complemento;
    }

    setBairro(bairro) {
        if(bairro == null) {
            this.bairro = '';
        }else if(bairro == undefined) {
            this.bairro = '';
        }else{
            this.bairro = bairro.toUpperCase();
        }
    }

    getBairro() {
        return this.bairro;
    }

    setTelefone(telefone) {
        if(telefone.length > 8){
            this.telefone = telefone.replace(/\D/g,'');
        }else {
            this.telefone = '';
        }
    }

    getTelefone() {
        return this.telefone;
    }

    setEmail(email) {
        if(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i.test(email) == true) {
            this.email = email;
        } else {
            this.email = '';
        }
    }

    getEmail() {
        return this.email;
    }

    setValor(valor) {
        this.valor = valor;
        this.valorTributado = (((parseFloat((this.valor.replace(",", "."))) * 0.1845).toFixed(2)).toString()).replace(".", ",");
    }

    getValor() {
        return this.valor;
    }
    

    getValorTributado() {
        return this.valorTributado;
    }

    getAliquota() {
        return this.aliquota;
    }

    getDadosCliente() {
        return {
            'codigoCliente': this.codigoCliente,
            'empresaCadastro': this.empresaCadastro,
            'tipoDocumento': this.tipoDocumento,
            'documento': this.documento,
            'razaoSocial': this.razaoSocial,
            'inscricao': this.inscricao,
            'cep': this.cep,
            'cidade': this.cidade,
            'estado': this.estado,
            'bairro': this.bairro,
            'logradouro': this.logradouro,
            'numeroEnd': this.numeroEnd,
            'complemento': this.complemento,
            'telefone': this.telefone,
            'email': this.email,
            'valor': this.valor,
            'valorTributado': this.valorTributado,
            'aliquota': this.aliquota
        }
    }
}
