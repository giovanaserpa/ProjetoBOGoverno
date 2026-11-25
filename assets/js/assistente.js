/* ============================================================
   assistente.js — CAPI, assistente do portal

   Responde com NÚMERO, não com link. Lê tudo de dados.js, então
   nunca inventa valor e nunca fica desatualizado em relação ao
   resto do site.

   Sem modelo de linguagem, sem chave de API, sem rede: funciona
   offline e o comportamento é o mesmo em toda apresentação.

   Para ensinar uma resposta nova, acrescente um item em INTENCOES.
   ============================================================ */

(function () {
  var NOME = "CAPI";

  /* ---------- utilidades ---------- */

  function normalizar(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function etapa(nome) {
    var alvo = normalizar(nome);
    var achou = null;
    DADOS.execucao.etapas.forEach(function (et) {
      if (normalizar(et.rotulo).indexOf(alvo) === 0) achou = et;
    });
    return achou;
  }

  function fonte() {
    return "Fonte: " + DADOS.execucao.fonte + ", consulta em " + DADOS.execucao.consultaEm + ".";
  }

  // Quais municípios a frase realmente cita.
  // Nomes se contêm: "Santa Cruz do Capibaribe" também casa com
  // "Santa Cruz", e "Bom Jardim" com "Jardim". Sem descartar o
  // nome curto, uma pergunta sobre UM município parece citar dois
  // e vira pedido de comparação.
  function municipiosCitados(texto) {
    var achados = DADOS.ranking.itens.filter(function (i) {
      return texto.indexOf(normalizar(i.nome)) !== -1;
    });
    return achados.filter(function (a) {
      var na = normalizar(a.nome);
      return !achados.some(function (b) {
        var nb = normalizar(b.nome);
        return nb !== na && nb.indexOf(na) !== -1;
      });
    });
  }

  var AVISO_ILUSTRATIVO =
    "Atenção: este número ainda é ilustrativo no protótipo, não é dado oficial.";

  // selo de procedência para os blocos que passaram a ser reais
  var FONTE_OFICIAL =
    "Fonte: Portal da Transparência de PE (painéis do E-Fisco), consulta em " +
    DADOS.execucao.consultaEm + ".";

  var FONTE_MUNICIPIO =
    "População: IBGE, Censo 2022. Transferência: painel estadual de transferências a municípios, " +
    "consulta em " + DADOS.municipios.consultaEm + ".\n\n" +
    "Ressalva do dado: nesse painel as colunas de ICMS e IPI estão zeradas em todos os anos — " +
    "só o IPVA tem valor. Então isto é o que o Estado publica, não o repasse total.";

  /* ---------- intenções ----------
     termos:     palavras que puxam a intenção
     exige:      pelo menos uma destas também precisa aparecer (opcional)
     prioridade: multiplica o peso. Use acima de 1 para intenções
                 específicas que precisam ganhar das genéricas.
     resposta:   devolve o texto, ou null para passar a vez
                 para a próxima intenção mais bem pontuada.
  --------------------------------- */

  var INTENCOES = [
    {
      id: "saudacao",
      termos: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "e ai"],
      resposta: function () {
        return "Oi. Eu respondo sobre as despesas do Estado de Pernambuco com os números que estão neste portal. Pode perguntar à vontade.";
      }
    },
    {
      id: "ajuda",
      termos: ["ajuda", "o que voce sabe", "o que voce faz", "como funciona", "pode fazer", "menu"],
      resposta: function () {
        return "Eu sei responder sobre:\n\n• quanto o Estado fixou, empenhou, liquidou e pagou em " +
          DADOS.execucao.exercicio + "\n• quanto o Estado arrecadou, e de onde\n• quanto foi para cada uma das " +
          DADOS.funcoes.itens.length + " funções do orçamento\n• qualquer um dos 185 municípios: população, região e quanto recebeu\n• comparar dois municípios, inclusive por habitante\n• os números de uma região inteira\n• a diferença entre custo e despesa\n\nEscolha uma das sugestões aqui embaixo ou escreva a sua pergunta.";
      }
    },
    {
      id: "pago",
      termos: ["pago", "pagou", "saiu do caixa", "desembolso"],
      resposta: function () {
        var e = etapa("paga");
        return "O Estado pagou " + DADOS.moeda(e.valor) + " em " + DADOS.execucao.exercicio +
          ", o que equivale a " + DADOS.pct(e.share) + " do orçamento fixado.\n\n" + fonte();
      }
    },
    {
      id: "empenhado",
      termos: ["empenhado", "empenhou", "empenho"],
      resposta: function () {
        var e = etapa("empenhada");
        return "Foram empenhados " + DADOS.moeda(e.valor) + " em " + DADOS.execucao.exercicio +
          ", ou " + DADOS.pct(e.share) + " do fixado.\n\nEmpenhar é reservar o dinheiro para um contrato. O recurso fica comprometido, mas ainda não saiu do caixa.\n\n" + fonte();
      }
    },
    {
      id: "liquidado",
      termos: ["liquidado", "liquidou", "liquidacao"],
      resposta: function () {
        var e = etapa("liquidada");
        return "Foram liquidados " + DADOS.moeda(e.valor) + " em " + DADOS.execucao.exercicio +
          ", ou " + DADOS.pct(e.share) + " do fixado.\n\nLiquidar é atestar que o serviço foi entregue e conferido. É o passo antes do pagamento.\n\n" + fonte();
      }
    },
    {
      id: "fixado",
      termos: ["fixado", "fixada", "orcamento total", "orcamento do estado", "quanto o estado tem", "loa"],
      resposta: function () {
        var e = etapa("fixada");
        return "O orçamento fixado atualizado do Estado para " + DADOS.execucao.exercicio +
          " é de " + DADOS.moeda(e.valor) + ".\n\nÉ o teto autorizado para o ano, já com os ajustes feitos ao longo do exercício.\n\n" + fonte();
      }
    },
    {
      id: "execucao",
      termos: ["execucao", "orcamento", "quanto gastou", "quanto o estado gastou", "gasto total", "despesa total", "resumo"],
      resposta: function () {
        var et = DADOS.execucao.etapas;
        var linhas = et.map(function (e) {
          return "• " + e.rotulo + ": " + DADOS.moeda(e.valor) + " (" + DADOS.pct(e.share) + ")";
        }).join("\n");
        var naoPago = et[0].valor - et[3].valor;
        return "Execução orçamentária do Estado em " + DADOS.execucao.exercicio + ":\n\n" + linhas +
          "\n\nSobraram " + DADOS.moeda(naoPago) + " entre o que foi fixado e o que foi efetivamente pago.\n\n" + fonte();
      }
    },
    {
      id: "diferenca_etapas",
      termos: ["diferenca entre", "o que e empenho", "o que significa", "etapas", "empenhado e pago", "empenhado e liquidado"],
      exige: ["empenh", "liquid", "pag", "fixad", "etapa"],
      resposta: function () {
        return "São quatro estágios do mesmo dinheiro ao longo do ano:\n\n" +
          "1. Fixado — o teto autorizado no orçamento\n" +
          "2. Empenhado — reservado para um contrato\n" +
          "3. Liquidado — serviço entregue e conferido\n" +
          "4. Pago — saiu do caixa\n\n" +
          "Cada etapa é menor que a anterior. A distância entre empenhado e pago mostra contratos firmados cujo serviço ainda não foi entregue ou conferido.";
      }
    },
    {
      id: "por_habitante",
      termos: ["por habitante", "por pessoa", "per capita", "cada pernambucano", "por cabeca", "populacao"],
      prioridade: 4,
      resposta: function (texto) {
        var total = DADOS.execucao.etapas[0].valor;
        var pago = DADOS.execucao.etapas[3].valor;
        var liquidado = DADOS.areas.total;

        // se a pergunta cita uma área, responde o per capita dela
        var achada = null;
        DADOS.areas.itens.forEach(function (a) {
          if (texto.indexOf(normalizar(a.nome)) !== -1 && !achada) achada = a;
        });
        if (achada) {
          var v = liquidado * (achada.share / 100);
          return achada.nome + " custa " + DADOS.porHabitante(v) +
            " por pernambucano em " + DADOS.execucao.exercicio + ", o equivalente a " +
            DADOS.moeda(v) + " liquidados, ou " + DADOS.pct(achada.share) +
            " da despesa do Estado.\n\n" + FONTE_OFICIAL;
        }

        return "O orçamento do Estado para " + DADOS.execucao.exercicio + " equivale a " +
          DADOS.porHabitante(total) + " por pernambucano. Do que já foi pago, são " +
          DADOS.porHabitante(pago) + " por pessoa.\n\nO cálculo usa " +
          (DADOS.populacao.valor / 1e6).toFixed(2).replace(".", ",") +
          " milhões de habitantes do Censo 2022 do IBGE.\n\n" + fonte();
      }
    },
    {
      id: "custo_despesa",
      termos: ["custo", "custos", "custo e despesa", "diferenca custo"],
      resposta: function () {
        return "Despesa é quanto saiu do caixa. Custo é quanto consome manter um serviço, um órgão ou uma política funcionando.\n\n" +
          "A diferença importa: o portal do Estado publica despesa paga, mas não apura custo. Saber que uma secretaria pagou X não diz quanto custa atender um aluno, manter um leito ou conservar um quilômetro de estrada.\n\n" +
          "Apurar custo é o que a NBC TSP 34, em vigor desde 2024, pede do setor público — e é o que este projeto se propõe a resolver.";
      }
    },
    {
      id: "ranking",
      termos: ["ranking", "maior", "quem mais", "lista de municipios", "primeiro lugar", "top"],
      resposta: function () {
        var itens = DADOS.ranking.itens;
        var linhas = itens.slice(0, 10).map(function (i, n) {
          return (n + 1) + ". " + i.nome + " — " + DADOS.moeda(i.valor);
        }).join("\n");
        return "Transferência do Estado por município, " + DADOS.execucao.exercicio +
          " (10 primeiros de " + DADOS.inteiro(itens.length) + "):\n\n" + linhas +
          "\n\n" + FONTE_MUNICIPIO;
      }
    },
    {
      id: "menor_ranking",
      termos: ["menor", "quem menos", "ultimo lugar", "ultimos", "menores"],
      prioridade: 3,
      resposta: function () {
        var itens = DADOS.ranking.itens;
        var fim = itens.slice(-5).reverse();
        var linhas = fim.map(function (i) {
          return i.nome + " — " + DADOS.moeda(i.valor) + " (" + DADOS.inteiro(i.pop) + " hab)";
        }).join("\n");
        return "Os cinco municípios que recebem menos:\n\n" + linhas + "\n\n" + FONTE_MUNICIPIO;
      }
    },
    {
      id: "regiao",
      termos: ["regiao", "sertao", "agreste", "zona da mata", "mata", "sao francisco", "rmr",
               "regiao metropolitana", "interior"],
      prioridade: 3,
      resposta: function (texto) {
        var alvo = null;
        DADOS.regioes.forEach(function (nome) {
          if (texto.indexOf(normalizar(nome)) !== -1 && !alvo) alvo = nome;
        });
        if (!alvo && texto.indexOf("metropolitana") !== -1) alvo = "RMR";
        if (!alvo && texto.indexOf("mata") !== -1) alvo = "Zona da Mata";

        if (!alvo) {
          var resumo = DADOS.regioes.map(function (nome) {
            var g = DADOS.municipiosDaRegiao(nome);
            var pop = g.reduce(function (s, m) { return s + m.p; }, 0);
            return "• " + nome + ": " + g.length + " municípios, " +
              DADOS.inteiro(pop) + " habitantes";
          }).join("\n");
          return "Pernambuco tem 185 municípios, divididos assim:\n\n" + resumo +
            "\n\nPergunte por uma região para ver os números dela.";
        }

        var g = DADOS.municipiosDaRegiao(alvo);
        var pop = g.reduce(function (s, m) { return s + m.p; }, 0);
        var val = g.reduce(function (s, m) { return s + m.t; }, 0);
        var maior = g.reduce(function (m, x) { return x.p > m.p ? x : m; });

        return alvo + ": " + g.length + " municípios e " + DADOS.inteiro(pop) +
          " habitantes, " + DADOS.pct(100 * pop / DADOS.municipios.populacaoTotal) +
          " da população do Estado.\n\n" +
          "Receberam " + DADOS.moeda(val) + " do Estado em " + DADOS.execucao.exercicio +
          ", o que dá " + DADOS.porHabitante(val, pop) + " por habitante.\n\n" +
          "Maior município da região: " + maior.n + ", com " + DADOS.inteiro(maior.p) +
          " habitantes.\n\n" + FONTE_MUNICIPIO;
      }
    },
    {
      id: "receita",
      // "de onde vem" sozinho fica de fora: numa pergunta como
      // "de onde vêm esses números" quem responde é fonte_dados.
      termos: ["receita", "arrecad", "de onde vem o dinheiro", "quanto entrou",
               "imposto", "icms", "quanto o estado ganha", "quanto arrecada"],
      prioridade: 4,
      resposta: function () {
        var r = DADOS.receita;
        var pago = DADOS.execucao.etapas[3].valor;
        return "Em " + r.exercicio + " o Estado previu arrecadar " + DADOS.moeda(r.prevista) +
          " e já arrecadou " + DADOS.moeda(r.arrecadada) + ", ou " + DADOS.pct(r.share) +
          " do previsto.\n\n" +
          "No mesmo período pagou " + DADOS.moeda(pago) + " em despesa. A diferença entre " +
          "o que entrou e o que saiu é de " + DADOS.moeda(Math.abs(r.arrecadada - pago)) + ".\n\n" +
          "Abertura:\n" +
          r.categorias.filter(function (c) { return c.arrecadada !== 0; }).map(function (c) {
            return "• " + c.nome + ": " + DADOS.moeda(c.arrecadada);
          }).join("\n") +
          "\n\n" + FONTE_OFICIAL;
      }
    },
    {
      id: "comparar",
      termos: ["compar", "versus", " vs ", "contra"],
      prioridade: 4,
      resposta: function (texto) {
        var itens = DADOS.ranking.itens;
        var achados = municipiosCitados(texto);

        if (achados.length >= 2) {
          var a = achados[0], b = achados[1];
          var d = ((a.valor - b.valor) / b.valor) * 100;
          var texto2 =
            a.nome + ": " + DADOS.moeda(a.valor) +
              (a.pop ? " · " + DADOS.porHabitante(a.valor, a.pop) + " por habitante" : "") + "\n" +
            b.nome + ": " + DADOS.moeda(b.valor) +
              (b.pop ? " · " + DADOS.porHabitante(b.valor, b.pop) + " por habitante" : "") + "\n\n" +
            "Em valor total, " + a.nome + " recebe " +
            Math.abs(d).toFixed(1).replace(".", ",") + "% " +
            (d >= 0 ? "a mais" : "a menos") + " que " + b.nome + ".";

          // a virada per capita é o que o valor total esconde
          if (a.pop && b.pop) {
            var pa = a.valor / a.pop, pb = b.valor / b.pop;
            var razao = (Math.max(pa, pb) / Math.min(pa, pb)).toFixed(1).replace(".", ",");
            var lider = pa >= pb ? a.nome : b.nome;
            var liderTotal = a.valor >= b.valor ? a.nome : b.nome;
            texto2 += lider !== liderTotal
              ? "\n\nMas por habitante a ordem inverte: " + lider + " recebe " + razao +
                " vezes mais por pessoa."
              : "\n\nPor habitante " + lider + " também fica à frente, " + razao + " vezes.";
          }
          return texto2 + "\n\n" + FONTE_MUNICIPIO;
        }
        return "Me diga quais dois municípios comparar — tenho os " +
          DADOS.inteiro(itens.length) + " de Pernambuco. Por exemplo: " +
          "\"compare Recife com Petrolina\".";
      }
    },
    {
      id: "municipio",
      // os termos são os 185 nomes, gerados do próprio dado. antes
      // eram cinco nomes escritos à mão, e qualquer município fora
      // da lista caía no fallback.
      termos: DADOS.ranking.itens.map(function (i) { return normalizar(i.nome); }),
      prioridade: 3,
      resposta: function (texto) {
        var itens = DADOS.ranking.itens;

        // dois municípios citados é pedido de comparação: passa a vez
        var citados = municipiosCitados(texto);
        if (citados.length >= 2) return null;
        if (!citados.length) return null;

        var achado = citados[0];
        var pos = itens.indexOf(achado) + 1;

        var m = DADOS.acharMunicipio(achado.nome);
        var vizinhos = DADOS.municipiosDaRegiao(achado.regiao);
        var popReg = vizinhos.reduce(function (s, x) { return s + x.p; }, 0);

        return achado.nome + " tem " + DADOS.inteiro(achado.pop) + " habitantes (Censo 2022) " +
          "e fica no " + achado.regiao + ".\n\n" +
          "Recebeu " + DADOS.moeda(achado.valor) + " do Estado em " + DADOS.execucao.exercicio +
          ", ou " + DADOS.porHabitante(achado.valor, achado.pop) + " por habitante. " +
          "É o " + pos + "º de " + DADOS.inteiro(itens.length) + " em valor recebido" +
          (m && m.t25 ? ", contra " + DADOS.moeda(m.t25) + " em 2025" : "") + ".\n\n" +
          "Para dar escala: o " + achado.regiao + " tem " + vizinhos.length +
          " municípios e " + DADOS.inteiro(popReg) + " habitantes.\n\n" + FONTE_MUNICIPIO;
      }
    },
    {
      id: "setores",
      termos: ["educacao", "saude", "seguranca", "cultura", "politica", "gestao", "previdencia",
               "area", "setor", "funcao"],
      prioridade: 3,
      resposta: function (texto) {
        var mapa = {
          educacao:    ["Educação", "educacao.html"],
          saude:       ["Saúde", "saude.html"],
          seguranca:   ["Segurança", "seguranca.html"],
          cultura:     ["Cultura", "cultura.html"],
          politica:    ["Gestão", "politica.html"],
          previdencia: ["Previdência", null]
        };
        if (texto.indexOf("gestao") !== -1) texto += " politica";

        var chave = null;
        Object.keys(mapa).forEach(function (k) {
          if (texto.indexOf(k) !== -1 && !chave) chave = k;
        });
        if (!chave) {
          var maiores = DADOS.funcoes.itens.slice(0, 6).map(function (f) {
            return "• " + f.nome + ": " + DADOS.moeda(f.liquidada);
          }).join("\n");
          return "As seis maiores funções do orçamento de " + DADOS.execucao.exercicio +
            ", por despesa liquidada:\n\n" + maiores +
            "\n\nSão " + DADOS.funcoes.itens.length + " funções no total. " +
            "Pergunte por uma delas.\n\n" + FONTE_OFICIAL;
        }

        var serie = DADOS.serie.setores[chave];
        var anos = DADOS.serie.anos;
        var cresc = ((serie[serie.length - 1] / serie[0] - 1) * 100).toFixed(0);
        var area = null;
        DADOS.areas.itens.forEach(function (a) { if (a.chave === chave) area = a; });

        return mapa[chave][0] + " liquidou " + DADOS.moeda(serie[serie.length - 1]) +
          " em " + anos[anos.length - 1] +
          (area ? ", ou " + DADOS.pct(area.share) + " da despesa do Estado" : "") + ".\n\n" +
          "Em " + anos[0] + " eram " + DADOS.moeda(serie[0]) +
          " — uma variação de " + cresc + "% em " + (anos.length - 1) + " anos.\n\n" +
          "Por habitante, dá " +
          DADOS.porHabitante(serie[serie.length - 1]) + " por pernambucano.\n\n" +
          FONTE_OFICIAL +
          (mapa[chave][1] ? "\n\nAbrir: " + mapa[chave][1] : "");
      }
    },
    {
      id: "fonte_dados",
      termos: ["fonte", "de onde vem", "confiavel", "atualizado", "quando foi atualizado", "e fisco", "efisco"],
      resposta: function () {
        return "Execução orçamentária, receita, repartição por função e a série de " +
          DADOS.serie.anos[0] + " a " + DADOS.serie.anos[DADOS.serie.anos.length - 1] +
          ": painéis do Portal da Transparência de Pernambuco, que puxa do E-Fisco da SEFAZ. " +
          "Consulta em " + DADOS.execucao.consultaEm + ".\n\n" +
          "População e região dos 185 municípios: IBGE, Censo 2022.\n\n" +
          "Transferência por município: painel estadual de transferências. Nesse painel as " +
          "colunas de ICMS e IPI estão zeradas em todos os anos de 2008 a 2026 — só o IPVA " +
          "tem valor. Mantenho o número como o Estado publica e aviso disso junto.\n\n" +
          "O único bloco ainda ilustrativo é o ranking por órgão, que está marcado como tal. " +
          "Nada aqui é apresentado como oficial sem ser.";
      }
    },
    {
      id: "lai",
      termos: ["lai", "acesso a informacao", "pedido", "ouvidoria", "transparencia passiva"],
      resposta: function () {
        return "A Lei de Acesso à Informação (Lei 12.527/2011) garante a qualquer pessoa pedir informação pública sem justificar o motivo. Em Pernambuco ela foi regulamentada pela Lei Estadual 14.804/2012.\n\n" +
          "Um portal bem feito reduz esses pedidos: se o dado já está publicado e compreensível, ninguém precisa pedir.";
      }
    },
    {
      id: "sobre",
      termos: ["o que e esse site", "sobre o portal", "quem fez", "projeto", "datavix", "para que serve"],
      resposta: function () {
        return "Este é o protótipo do Portal de Custos e Transparência de Pernambuco, feito pela squad Datavix para o desafio da SEFAZ-PE publicado no Desafios.Day.\n\n" +
          "A proposta é reunir os gastos do Estado num lugar só, com visualização clara e comparação entre órgãos e períodos — e apresentar custo, não apenas despesa paga.";
      }
    }
  ];

  var SUGESTOES = [
    "Quanto o Estado pagou em 2026?",
    "Quanto o Estado arrecadou?",
    "Quanto foi para a saúde?",
    "Compare Recife com Petrolina",
    "Quanto recebeu Serra Talhada?",
    "Quantos municípios tem o Sertão?",
    "O que é custo e o que é despesa?",
    "De onde vêm esses números?"
  ];

  /* ---------- motor ---------- */

  function responder(textoBruto) {
    var t = normalizar(textoBruto);
    if (!t) return "Pode escrever a pergunta que eu respondo.";

    var candidatas = [];

    INTENCOES.forEach(function (intencao) {
      var peso = 0;
      intencao.termos.forEach(function (termo) {
        if (t.indexOf(normalizar(termo)) !== -1) peso += normalizar(termo).length;
      });
      if (peso === 0) return;
      if (intencao.exige) {
        var ok = intencao.exige.some(function (e) { return t.indexOf(e) !== -1; });
        if (!ok) return;
      }
      candidatas.push({ intencao: intencao, peso: peso * (intencao.prioridade || 1) });
    });

    candidatas.sort(function (a, b) { return b.peso - a.peso; });

    // tenta da mais provável para a menos; uma intenção pode passar a vez
    for (var i = 0; i < candidatas.length; i++) {
      var r = candidatas[i].intencao.resposta(t);
      if (r) return r;
    }

    return "Essa eu não sei responder — e prefiro dizer isso a inventar um número.\n\n" +
      "Eu respondo sobre a execução orçamentária e a receita do Estado, as " +
      DADOS.funcoes.itens.length + " funções do orçamento, qualquer um dos 185 municípios " +
      "ou uma região inteira, e a diferença entre custo e despesa. " +
      "Escreva \"ajuda\" para ver a lista.";
  }

  /* ---------- interface ---------- */

  function montar() {
    var raiz = document.createElement("div");
    raiz.className = "assistente";
    raiz.innerHTML =
      '<button class="assistente__botao" type="button" aria-expanded="false" aria-controls="assistente-painel">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.6 8.3z"/>' +
        "</svg>" +
        "<span>Perguntar ao " + NOME + "</span>" +
      "</button>" +
      '<div class="assistente__painel" id="assistente-painel" hidden>' +
        '<div class="assistente__topo">' +
          "<div>" +
            '<p class="assistente__nome">' + NOME + "</p>" +
            '<p class="assistente__papel">Assistente de dados do portal</p>' +
          "</div>" +
          '<button class="assistente__fechar" type="button" aria-label="Fechar o assistente">&times;</button>' +
        "</div>" +
        '<div class="assistente__conversa" role="log" aria-live="polite" aria-label="Conversa"></div>' +
        '<div class="assistente__sugestoes"></div>' +
        '<form class="assistente__entrada">' +
          '<label class="sr-only" for="assistente-campo">Escreva sua pergunta</label>' +
          '<input id="assistente-campo" type="text" autocomplete="off" placeholder="Escreva sua pergunta">' +
          '<button type="submit" aria-label="Enviar pergunta">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>' +
          "</button>" +
        "</form>" +
      "</div>";

    document.body.appendChild(raiz);

    var botao     = raiz.querySelector(".assistente__botao");
    var painel    = raiz.querySelector(".assistente__painel");
    var fechar    = raiz.querySelector(".assistente__fechar");
    var conversa  = raiz.querySelector(".assistente__conversa");
    var sugestoes = raiz.querySelector(".assistente__sugestoes");
    var form      = raiz.querySelector(".assistente__entrada");
    var campo     = raiz.querySelector("#assistente-campo");

    function fala(quem, texto) {
      var bolha = document.createElement("div");
      bolha.className = "fala fala--" + quem;
      texto.split("\n").forEach(function (linha) {
        var p = document.createElement("p");
        p.textContent = linha;
        if (!linha.trim()) p.className = "fala__espaco";
        bolha.appendChild(p);
      });
      conversa.appendChild(bolha);
      conversa.scrollTop = conversa.scrollHeight;
    }

    function perguntar(texto) {
      fala("pessoa", texto);
      window.setTimeout(function () { fala("capi", responder(texto)); }, 180);
    }

    SUGESTOES.forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = s;
      b.addEventListener("click", function () { perguntar(s); });
      sugestoes.appendChild(b);
    });

    function abrir(sim) {
      if (sim) {
        painel.removeAttribute("hidden");
        botao.setAttribute("aria-expanded", "true");
        if (!conversa.childNodes.length) {
          fala("capi", "Oi. Eu sou o " + NOME + " e respondo sobre as despesas do Estado de Pernambuco com os números deste portal.\n\nQuando o dado ainda for de exemplo, eu aviso. Quando eu não souber, eu digo que não sei.");
        }
        campo.focus();
      } else {
        painel.setAttribute("hidden", "");
        botao.setAttribute("aria-expanded", "false");
        botao.focus();
      }
    }

    botao.addEventListener("click", function () {
      abrir(painel.hasAttribute("hidden"));
    });
    fechar.addEventListener("click", function () { abrir(false); });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && !painel.hasAttribute("hidden")) abrir(false);
    });

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var texto = campo.value.trim();
      if (!texto) return;
      campo.value = "";
      perguntar(texto);
    });
  }

  document.addEventListener("DOMContentLoaded", montar);
})();
