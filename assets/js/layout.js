/* ============================================================
   layout.js
   Cabeçalho, menu e rodapé ÚNICOS do portal, mais a montagem
   dos blocos de dado (régua, gráficos, ranking, comparador).

   Os NÚMEROS não ficam aqui — ficam em dados.js.
   Para atualizar valores, mexa só naquele arquivo.
   ============================================================ */

(function () {
  // Navegação principal: por ÁREA, que é a aposta do projeto —
  // o portal oficial organiza por instrumento (despesas, receitas,
  // licitações) e obriga a pessoa a saber o nome do que procura.
  // "Gestão" em vez de "Política" para bater com a função 04
  // Administração, que é o que o dado dessa página realmente é.
  var MENU = [
    { label: "Início",    href: "index.html",     chave: "inicio" },
    { label: "Educação",  href: "educacao.html",  chave: "educacao" },
    { label: "Saúde",     href: "saude.html",     chave: "saude" },
    { label: "Gestão",    href: "politica.html",  chave: "politica" },
    { label: "Cultura",   href: "cultura.html",   chave: "cultura" },
    { label: "Segurança", href: "seguranca.html", chave: "seguranca" }
  ];

  // Barra de serviço: os cortes que não são área, no lugar onde o
  // portal oficial põe o menu inteiro. Ficam acima e em corpo
  // menor porque são atalho, não a leitura principal.
  var ATALHOS = [
    { label: "Receitas",      href: "index.html#receita" },
    { label: "Despesas",      href: "index.html#faixa-orcamento" },
    { label: "Municípios",    href: "index.html#municipios" },
    { label: "Dados abertos", href: "index.html#rodape-dados" }
  ];

  function paginaAtual() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function setorAtual() {
    return document.body.getAttribute("data-sector") || "inicio";
  }

  /* ---------- cabeçalho ---------- */

  function renderHeader() {
    var page = paginaAtual();
    var links = MENU.map(function (item) {
      var atual = item.href === page;
      return '<li><a href="' + item.href + '"' + (atual ? ' aria-current="page"' : "") +
        (item.chave !== "inicio" ? ' data-area="' + item.chave + '"' : "") +
        ">" + item.label + "</a></li>";
    }).join("");

    var atalhos = ATALHOS.map(function (a) {
      return '<li><a href="' + a.href + '">' + a.label + "</a></li>";
    }).join("");

    return (
      '<a class="pular" href="#conteudo">Pular para o conteúdo</a>' +

      // 1. Faixa de serviço escura, como a do portal oficial.
      //    Lá leva O Portal, FAQ, Glossário, Ouvidoria; aqui leva
      //    os cortes de dado e a data da consulta.
      '<div class="faixa-servico">' +
        '<div class="container faixa-servico__inner">' +
          '<ul class="servico__links">' + atalhos + "</ul>" +
          '<p class="servico__selo"><span class="servico__ponto" aria-hidden="true"></span>' +
            "Dados de " + DADOS.execucao.consultaEm + "</p>" +
        "</div>" +
      "</div>" +

      // 2. Faixa da marca, escura. O logotipo oficial é um bloco
      //    de três linhas — PORTAL DA / TRANSPARÊNCIA / DE
      //    PERNAMBUCO — e é a coisa mais reconhecível do topo
      //    deles. Reproduzo a forma; o brasão fica de fora.
      '<header class="site-header">' +
        '<div class="container site-header__inner">' +
          '<p class="marca">' +
            '<span class="marca__l1">Portal da</span>' +
            '<span class="marca__l2">Transparência</span>' +
            '<span class="marca__l3">de Pernambuco</span>' +
          "</p>" +
          '<p class="marca__nota">Receitas, despesas e dados públicos do Estado,' +
            "<br>com a fonte de cada número</p>" +
        "</div>" +
      "</header>" +
      '<nav class="site-nav" aria-label="Menu principal">' +
        '<div class="container site-nav__inner">' +
          '<ul class="site-nav__list">' + links + "</ul>" +
          '<div class="busca">' +
            '<form class="site-search" role="search" onsubmit="return false;">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
              '<input type="search" id="busca-campo" placeholder="Buscar no portal" aria-label="Buscar no portal"' +
                ' role="combobox" aria-expanded="false" aria-controls="busca-saida" aria-autocomplete="list" autocomplete="off">' +
            "</form>" +
            '<ul class="busca__saida" id="busca-saida" role="listbox" hidden></ul>' +
          "</div>" +
        "</div>" +
      "</nav>"
    );
  }

  /* ---------- busca que realmente busca ----------
     Índice pequeno, montado dos dados e das páginas. Procura
     termo orçamentário, área e consulta — e devolve o número
     quando a resposta é um número.
  ------------------------------------------------ */

  function montarBusca() {
    var campo = document.getElementById("busca-campo");
    var saida = document.getElementById("busca-saida");
    if (!campo || !saida) return;

    var indice = [];

    MENU.forEach(function (m) {
      if (m.chave === "inicio") return;
      indice.push({ titulo: m.label, desc: "Página da área", href: m.href, termos: m.label });
    });

    DADOS.execucao.etapas.forEach(function (et) {
      indice.push({
        titulo: et.rotulo,
        desc: DADOS.moeda(et.valor) + " · " + DADOS.pct(et.share) + " do orçamento",
        href: "index.html",
        termos: et.rotulo + " " + et.rotulo.replace(/a$/, "o") +
          " execucao orcamento etapa empenho liquidacao pagamento"
      });
    });

    DADOS.areas.itens.forEach(function (a) {
      if (!a.pagina) return;
      var v = DADOS.areas.total * (a.share / 100);
      indice.push({
        titulo: "Orçamento de " + a.nome,
        desc: DADOS.moeda(v) + " · " + DADOS.porHabitante(v) + " por habitante",
        href: a.pagina,
        termos: a.nome + " orcamento area fatia por habitante"
      });
    });

    DADOS.ranking.itens.forEach(function (i) {
      indice.push({
        titulo: i.nome,
        desc: DADOS.moeda(i.valor) + " executados",
        href: "index.html",
        termos: i.nome + " ranking despesa"
      });
    });

    [["Custo e despesa", "A diferença entre o que saiu do caixa e o que custa manter o serviço"],
     ["Lei de Acesso à Informação", "Como pedir um dado que não está publicado"],
     ["Dados abertos", "Baixar as bases em CSV e JSON"]
    ].forEach(function (t) {
      indice.push({ titulo: t[0], desc: t[1], href: "#", termos: t[0] + " " + t[1] });
    });

    function limpar(x) {
      return x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function fechar() {
      saida.hidden = true;
      saida.innerHTML = "";
      campo.setAttribute("aria-expanded", "false");
    }

    campo.addEventListener("input", function () {
      var q = limpar(campo.value.trim());
      if (q.length < 2) return fechar();

      var achados = indice.filter(function (it) {
        return limpar(it.titulo + " " + it.termos).indexOf(q) !== -1;
      }).slice(0, 6);

      if (!achados.length) {
        saida.innerHTML = '<li class="busca__vazio">Nada encontrado para “' + campo.value.trim() + '”.</li>';
      } else {
        saida.innerHTML = achados.map(function (it) {
          return '<li role="option" tabindex="-1">' +
            '<a href="' + it.href + '">' +
              '<span class="busca__titulo">' + it.titulo + "</span>" +
              '<span class="busca__desc">' + it.desc + "</span>" +
            "</a></li>";
        }).join("");
      }
      saida.hidden = false;
      campo.setAttribute("aria-expanded", "true");
    });

    campo.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") { fechar(); campo.blur(); }
      if (ev.key === "ArrowDown") {
        var a = saida.querySelector("a");
        if (a) { ev.preventDefault(); a.focus(); }
      }
    });

    document.addEventListener("click", function (ev) {
      if (!ev.target.closest(".busca")) fechar();
    });
  }

  /* ---------- rodapé ---------- */

  function renderFooter() {
    var e = DADOS.execucao;
    var m = DADOS.municipios;

    return (
      '<footer class="site-footer">' +
        '<div class="container site-footer__inner">' +

          '<section class="rodape-dados" id="rodape-dados">' +
            "<h2>De onde vem cada número</h2>" +
            '<dl class="rodape-fontes">' +
              "<dt>Execução, receita e funções</dt>" +
                "<dd>Painéis do Portal da Transparência de PE, que puxa do <b>E-Fisco</b> " +
                  "da Secretaria da Fazenda. Consulta em " + e.consultaEm + ".</dd>" +
              "<dt>População e regiões</dt>" +
                "<dd>IBGE, Censo 2022. " + DADOS.inteiro(m.populacaoTotal) +
                  " habitantes em " + m.itens.length + " municípios.</dd>" +
              "<dt>Transferência a municípios</dt>" +
                "<dd>Painel estadual de transferências. <b>Nele as colunas de ICMS e IPI " +
                  "estão zeradas em todos os anos</b> — só o IPVA tem valor. " +
                  "Publicamos o que está publicado, com esta ressalva.</dd>" +
            "</dl>" +
            '<p class="site-footer__aviso">O único bloco ainda ilustrativo é o ranking por ' +
              "órgão, marcado como tal onde aparece.</p>" +
          "</section>" +

          "<section>" +
            "<h2>Baixar os dados</h2>" +
            '<p class="rodape-intro">Os mesmos números desta página, sem precisar ' +
              "raspar a tela.</p>" +
            '<ul class="rodape-lista">' +
              '<li><a href="#" data-baixar="municipios" data-formato="csv">' +
                '<span class="rodape-tag">CSV</span>' +
                '<span class="rodape-lista__txt">Municípios, população e transferência' +
                  '<em>' + m.itens.length + " linhas</em></span></a></li>" +
              '<li><a href="#" data-baixar="funcoes" data-formato="csv">' +
                '<span class="rodape-tag">CSV</span>' +
                '<span class="rodape-lista__txt">Despesa por função orçamentária' +
                  '<em>' + DADOS.funcoes.itens.length + " funções, 3 estágios</em></span></a></li>" +
              '<li><a href="#" data-baixar="serie" data-formato="csv">' +
                '<span class="rodape-tag">CSV</span>' +
                '<span class="rodape-lista__txt">Série histórica' +
                  "<em>" + DADOS.serie.anos[0] + "–" +
                  DADOS.serie.anos[DADOS.serie.anos.length - 1] + "</em></span></a></li>" +
              '<li><a href="#" data-baixar="tudo" data-formato="json">' +
                '<span class="rodape-tag">JSON</span>' +
                '<span class="rodape-lista__txt">Base completa' +
                  "<em>tudo, com as fontes</em></span></a></li>" +
            "</ul>" +
          "</section>" +

          "<section>" +
            "<h2>Base legal</h2>" +
            '<ul class="rodape-lista rodape-lista--simples">' +
              '<li><a href="https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp131.htm" ' +
                'target="_blank" rel="noopener">Lei Complementar 131/2009' +
                '<em>transparência em tempo real</em></a></li>' +
              '<li><a href="https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm" ' +
                'target="_blank" rel="noopener">Lei 12.527/2011' +
                '<em>Acesso à Informação</em></a></li>' +
              '<li><a href="https://legis.alepe.pe.gov.br" target="_blank" rel="noopener">' +
                "Lei Estadual 14.804/2012<em>LAI em Pernambuco</em></a></li>" +
              '<li><a href="#">NBC TSP 34<em>custos no setor público</em></a></li>' +
            "</ul>" +
          "</section>" +

          '<section class="rodape-sic">' +
            "<h2>Não achou o dado?</h2>" +
            "<p>Peça pelo Serviço de Informação ao Cidadão. O pedido não precisa de " +
              "justificativa, e o órgão tem <b>20 dias</b> para responder, prorrogáveis " +
              "por mais 10 com justificativa.</p>" +
            '<a class="site-footer__acao" href="https://ouve.pe.gov.br/modalidades/2/tipos_atendimentos" ' +
              'target="_blank" rel="noopener">Abrir um pedido no Ouve.PE</a>' +

            // O rodapé oficial é um mapa do site com 162 links. A
            // função é legítima — achar o que o menu não mostra —
            // mas 162 não é navegação. Aqui são sete.
            '<h2 class="rodape-sic__ir">Ir direto para</h2>' +
            '<ul class="rodape-atalhos">' +
              ATALHOS.slice(0, 3).map(function (a) {
                return '<li><a href="' + a.href + '">' + a.label + "</a></li>";
              }).join("") +
              MENU.filter(function (m) { return m.chave !== "inicio"; }).map(function (m) {
                return '<li><a href="' + m.href + '">' + m.label + "</a></li>";
              }).join("") +
            "</ul>" +
          "</section>" +

        "</div>" +

        // Bloco de identidade centralizado, no formato do rodapé
        // oficial: órgão, endereço, horário. O equivalente aqui é
        // quem fez, o que é e de onde vem o dado. Sem o brasão —
        // usar o brasão do Estado num protótipo acadêmico seria
        // se passar por site oficial.
        '<div class="site-footer__base">' +
          '<div class="container site-footer__base-inner">' +
            '<p class="base-marca"><span class="base-marca__uf">PE</span>' +
              "Portal de Custos e Transparência de Pernambuco</p>" +
            '<p class="base-org">Protótipo acadêmico — squad <b>Datavix</b> · ' +
              "Ciência da Computação, UNIT Recife</p>" +
            '<p class="base-fonte">Dados do Portal da Transparência de Pernambuco ' +
              "(E-Fisco/SEFAZ) e do IBGE · consulta em " + e.consultaEm + "</p>" +
            '<p class="base-aviso">Não é um site oficial do Governo do Estado de Pernambuco.</p>' +
            '<nav class="base-links" aria-label="Rodapé">' +
              '<a href="#conteudo">Acessibilidade</a>' +
              '<a href="index.html">Mapa do site</a>' +
              '<a href="#rodape-dados">Fontes dos dados</a>' +
            "</nav>" +
          "</div>" +
        "</div>" +
      "</footer>"
    );
  }

  /* ---------- baixar os dados ----------
     Gera o arquivo no próprio navegador, a partir de dados.js.
     Sem servidor e sem arquivo versionado que possa divergir do
     que a tela mostra: a tabela e o download saem da mesma fonte.
  -------------------------------------- */

  function montarDownloads() {
    var campo = function (v) {
      var s = String(v == null ? "" : v);
      return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    // ponto e vírgula e vírgula decimal: é o que o Excel em
    // português abre sem pedir assistente de importação
    var linha = function (a) { return a.map(campo).join(";"); };
    var dec = function (n) { return String(n).replace(".", ","); };

    function csvMunicipios() {
      var cab = ["municipio", "regiao", "populacao_censo_2022",
                 "transferencia_2025_reais", "transferencia_2026_reais"];
      return [linha(cab)].concat(DADOS.municipios.itens.map(function (m) {
        return linha([m.n, DADOS.regioes[m.r], m.p, dec(m.t25), dec(m.t)]);
      })).join("\n");
    }
    function csvFuncoes() {
      var cab = ["codigo", "funcao", "empenhada_reais", "liquidada_reais", "paga_reais"];
      return [linha(cab)].concat(DADOS.funcoes.itens.map(function (f) {
        return linha([f.cod, f.nome, dec(f.empenhada), dec(f.liquidada), dec(f.paga)]);
      })).join("\n");
    }
    function csvSerie() {
      var s = DADOS.serie;
      var chaves = Object.keys(s.setores);
      var cab = ["ano", "receita_arrecadada_reais"].concat(chaves.map(function (k) {
        return (k === "inicio" ? "despesa_liquidada_total" : "liquidada_" + k) + "_reais";
      }));
      return [linha(cab)].concat(s.anos.map(function (ano, i) {
        return linha([ano, dec(s.receita[i])].concat(chaves.map(function (k) {
          return dec(s.setores[k][i]);
        })));
      })).join("\n");
    }
    function jsonTudo() {
      return JSON.stringify({
        gerado_em: new Date().toISOString(),
        aviso: "Protótipo acadêmico (squad Datavix). Não é fonte oficial. " +
               DADOS.municipios.ressalva,
        execucao: DADOS.execucao,
        receita: DADOS.receita,
        funcoes: DADOS.funcoes,
        areas: DADOS.areas,
        serie: DADOS.serie,
        municipios: DADOS.municipios
      }, null, 2);
    }

    var MAPA = {
      municipios: { fn: csvMunicipios, nome: "municipios-pe", tipo: "text/csv" },
      funcoes:    { fn: csvFuncoes,    nome: "despesa-por-funcao-pe", tipo: "text/csv" },
      serie:      { fn: csvSerie,      nome: "serie-historica-pe",    tipo: "text/csv" },
      tudo:       { fn: jsonTudo,      nome: "portal-transparencia-pe", tipo: "application/json" }
    };

    document.addEventListener("click", function (ev) {
      var a = ev.target.closest("[data-baixar]");
      if (!a) return;
      ev.preventDefault();

      var def = MAPA[a.getAttribute("data-baixar")];
      if (!def) return;
      var ext = a.getAttribute("data-formato");

      // BOM na frente do CSV, senão o Excel come os acentos
      var corpo = def.fn();
      var pedaco = ext === "csv" ? ["﻿", corpo] : [corpo];
      var blob = new Blob(pedaco, { type: def.tipo + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);

      var tmp = document.createElement("a");
      tmp.href = url;
      tmp.download = def.nome + "-" + DADOS.execucao.exercicio + "." + ext;
      document.body.appendChild(tmp);
      tmp.click();
      document.body.removeChild(tmp);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

      if (typeof UI !== "undefined" && UI.toast) {
        UI.toast("Baixando " + tmp.download, "ok");
      }
    });
  }

  /* ---------- abertura: a resposta antes do menu ---------- */

  function renderAbertura(slot) {
    var e = DADOS.execucao;
    var fixado = e.etapas[0], pago = e.etapas[3];

    var etapas = e.etapas.map(function (et, i) {
      return '<div class="etapa etapa--' + (i + 1) + '">' +
          '<span class="etapa__rotulo">' + et.rotulo + "</span>" +
          '<span class="etapa__valor">' + DADOS.moeda(et.valor) + "</span>" +
          '<span class="etapa__share">' + DADOS.pct(et.share) + "</span>" +
        "</div>";
    }).join("");

    // "de cada R$ 100" é a mesma informação que o percentual,
    // numa escala que a pessoa consegue imaginar
    var deCem = pago.share.toFixed(2).replace(".", ",");

    slot.outerHTML =
      '<section class="abertura">' +
        '<div class="container abertura__grade">' +

          '<div class="abertura__chamada">' +
            '<h1 class="abertura__frase">Pernambuco reservou</h1>' +
            '<p class="abertura__cifra">' + DADOS.moeda(fixado.valor) + "</p>" +
            '<p class="abertura__frase abertura__frase--fim">para gastar em ' + e.exercicio + ".</p>" +
          "</div>" +

          '<div class="abertura__apoio">' +
            '<p class="abertura__leitura">De cada R$ 100 previstos, <b>R$ ' + deCem +
              " já saíram do caixa</b>. O orçamento do ano equivale a <b>" +
              DADOS.porHabitante(fixado.valor) + " por pernambucano</b>, para os " +
              (DADOS.populacao.valor / 1e6).toFixed(2).replace(".", ",") + " milhões de habitantes do Estado.</p>" +
            '<p class="abertura__nota">' + e.fonte + ". Consulta em " + e.consultaEm + ".</p>" +
          "</div>" +

          '<div class="caminho">' +
            '<p class="caminho__titulo">O caminho do dinheiro ao longo do ano</p>' +
            '<div class="execucao__trilha">' + etapas + "</div>" +
            '<p class="execucao__legenda">' +
              '<b data-termo="fixado">Fixado</b> é o teto autorizado. ' +
              '<b data-termo="empenhado">Empenhado</b> é o que já tem contrato. ' +
              '<b data-termo="liquidado">Liquidado</b> é o serviço entregue e conferido. ' +
              '<b data-termo="pago">Pago</b> é o que saiu do caixa. ' +
              "Entre a primeira etapa e a última há <b>" + DADOS.moeda(fixado.valor - pago.valor) + "</b> que ainda não viraram pagamento." +
            "</p>" +
          "</div>" +

        "</div>" +
      "</section>";
  }

  /* ---------- faixa do orçamento por área ---------- */

  function renderFaixa(slot) {
    // o share de cada área é calculado sobre a despesa LIQUIDADA,
    // não sobre o orçamento fixado. usar o fixado aqui inflaria
    // toda área em ~35%.
    var total = DADOS.areas.total;

    var fatias = DADOS.areas.itens.map(function (a, i) {
      var valor = total * (a.share / 100);
      var fina = a.share < 8 ? " faixa__area--fina" : "";
      var outras = a.chave === "outras" ? " faixa__area--outras" : "";
      var cor = a.chave === "outras" ? "" : "--cor:var(--cor-" + a.chave + ");";

      return '<button type="button" class="faixa__area' + fina + outras + '"' +
          ' data-area="' + a.chave + '" data-i="' + i + '" aria-pressed="false"' +
          ' style="--w:0;' + cor + '">' +
          '<span class="faixa__nome">' + a.nome + "</span>" +
          '<span class="faixa__valor">' + DADOS.moeda(valor) + "</span>" +
          '<span class="faixa__share">' + a.share.toFixed(1).replace(".", ",") + "%</span>" +
        "</button>";
    }).join("");

    slot.outerHTML =
      '<section class="faixa" aria-labelledby="faixa-titulo">' +
        '<h2 class="faixa__titulo" id="faixa-titulo">Para onde vai o orçamento</h2>' +
        '<p class="faixa__sub">A largura de cada faixa é o tamanho da fatia. Toque numa área para ver os números dela aqui embaixo.</p>' +
        '<div class="faixa__trilha" role="group" aria-label="Áreas do orçamento. Escolha uma para ver os números dela.">' + fatias + "</div>" +
        '<div class="leitura" aria-live="polite"></div>' +
        '<p class="faixa__nota">Repartição ilustrativa no protótipo. A ser substituída pela consulta de despesa por função orçamentária.</p>' +
      "</section>";

    ligarFaixa();
  }

  /* ---------- a faixa comanda a página ---------- */

  function ligarFaixa() {
    var trilha = document.querySelector(".faixa__trilha");
    var leitura = document.querySelector(".leitura");
    var grafico = document.querySelector(".chart");
    var legenda = document.querySelector(".chart-caption");
    if (!trilha || !leitura) return;

    var total = DADOS.areas.total;
    var legendaOriginal = legenda ? legenda.textContent : "";

    function leituraGeral() {
      leitura.innerHTML =
        '<p class="leitura__vazia">O Estado liquidou <b>' +
        DADOS.porHabitante(total) + " por pernambucano</b> em " +
        DADOS.execucao.exercicio + ". Toque numa área para abrir os números dela.</p>";
    }

    function selecionar(chave) {
      var item = null;
      DADOS.areas.itens.forEach(function (a) { if (a.chave === chave) item = a; });
      if (!item) return;

      var valor = total * (item.share / 100);
      var maior = DADOS.areas.itens.filter(function (a) { return a.chave !== "outras"; })
        .reduce(function (m, a) { return a.share > m.share ? a : m; });

      var contexto = item.chave === maior.chave && item.chave !== "outras"
        ? "É a maior área do orçamento."
        : "";

      leitura.innerHTML =
        '<div class="leitura__painel" style="--cor:var(--cor-' + item.chave + ')">' +
          '<div class="leitura__item">' +
            '<p class="leitura__rotulo">' + item.nome + " recebe</p>" +
            '<p class="leitura__cifra">' + DADOS.moeda(valor) + "</p>" +
          "</div>" +
          '<div class="leitura__item">' +
            '<p class="leitura__rotulo">Por habitante</p>' +
            '<p class="leitura__cifra">' + DADOS.porHabitante(valor) + "</p>" +
          "</div>" +
          '<div class="leitura__item leitura__item--texto">' +
            '<p class="leitura__nota">' + item.share.toFixed(1).replace(".", ",") +
              "% do orçamento do Estado. " + contexto + "</p>" +
            (item.pagina ? '<a class="leitura__link" href="' + item.pagina + '">Ver os dados de ' + item.nome + "</a>" : "") +
          "</div>" +
        "</div>" +
        '<div class="leitura__grafico"></div>';

      var cx = leitura.querySelector(".leitura__grafico");
      if (cx && DADOS.serie.setores[chave]) {
        var pronto = UI.skeleton(cx, "grafico");
        window.setTimeout(function () { pronto(); desenhar(); }, 260);
        return;
      }

      function desenhar() {
        var cx = leitura.querySelector(".leitura__grafico");
        if (!cx) return;
        cx.innerHTML = '<p class="leitura__rotulo">Evolução de ' + item.nome.toLowerCase() +
          ", " + DADOS.serie.anos[0] + "–" + DADOS.serie.anos[DADOS.serie.anos.length - 1] +
          '</p><div class="chart" data-serie="' + chave + '"></div>' +
          '<p class="chart-caption">Índice ilustrativo no protótipo.</p>';
        renderChart(cx.querySelector(".chart"));
        UI.tooltips(cx);
      }
    }

    trilha.addEventListener("click", function (ev) {
      var btn = ev.target.closest(".faixa__area");
      if (!btn) return;
      var jaAtivo = btn.getAttribute("aria-pressed") === "true";

      trilha.querySelectorAll(".faixa__area").forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
      });

      if (jaAtivo) {
        leituraGeral();
        if (grafico) {
          grafico.setAttribute("data-serie", "inicio");
          renderChart(grafico);
          if (legenda) legenda.textContent = legendaOriginal;
        }
        return;
      }

      btn.setAttribute("aria-pressed", "true");
      selecionar(btn.getAttribute("data-area"));
    });

    leituraGeral();

    // entrada: as fatias abrem a partir do zero, uma vez só
    var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var alvos = trilha.querySelectorAll(".faixa__area");
    DADOS.areas.itens.forEach(function (a, i) {
      var el = alvos[i];
      if (!el) return;
      if (reduz) { el.style.setProperty("--w", a.share); return; }
      window.setTimeout(function () {
        el.style.setProperty("--w", a.share);
      }, 90 + i * 55);
    });
  }

  /* ---------- consultas dos cartões ----------
     Os cinco cartões abriam um modal dizendo "ainda não está
     ligada à base". Agora cada um abre a consulta de verdade,
     montada de dados.js: tabela com busca, ordenação e o
     mesmo download do rodapé.
  -------------------------------------------- */

  // tabela de consulta reaproveitável: busca, ordenação por
  // coluna e total das linhas visíveis
  function modalTabela(op) {
    var cols = op.colunas;

    var cabecalho = cols.map(function (c, i) {
      return '<th' + (c.num ? ' class="num"' : "") +
        ' role="columnheader" aria-sort="none"' +
        ' data-ord="' + i + '" tabindex="0">' + c.rot + "</th>";
    }).join("");

    var corpo =
      (op.intro ? '<p class="modal__intro">' + op.intro +
        (op.nota ? '<span class="modal__nota">' + op.nota + "</span>" : "") + "</p>" : "") +
      (op.busca
        ? '<div class="consulta-busca">' +
            '<label class="visually-hidden" for="consulta-filtro">Filtrar</label>' +
            '<input type="search" id="consulta-filtro" placeholder="' +
              (op.placeholder || "Filtrar...") + '" autocomplete="off">' +
          "</div>"
        : "") +
      '<p class="modal__contagem" aria-live="polite"></p>' +
      '<div class="tabela-rolagem"><table class="modal-tabela consulta-tabela">' +
        "<thead><tr>" + cabecalho + "</tr></thead>" +
        "<tbody data-corpo></tbody>" +
      "</table></div>" +
      (op.baixar
        ? '<p class="modal__acoes"><button type="button" class="link-inline" data-baixar-consulta>' +
            "Baixar esta tabela em CSV</button></p>"
        : "");

    UI.modal({ titulo: op.titulo, corpo: corpo });

    var raiz = document.querySelector(".modal__corpo");
    if (!raiz) return;
    var tbody = raiz.querySelector("[data-corpo]");
    var filtro = raiz.querySelector("#consulta-filtro");
    var contagem = raiz.querySelector(".modal__contagem");

    var ordCol = op.ordenarPor == null ? -1 : op.ordenarPor;
    var ordDesc = true;
    var visiveis = op.linhas.slice();

    function texto(l, c) {
      var v = l[c.chave];
      return c.fmt ? c.fmt(v, l) : (v == null ? "" : String(v));
    }

    function pintar() {
      var termo = filtro ? normalizarTexto(filtro.value) : "";
      visiveis = op.linhas.filter(function (l) {
        if (!termo) return true;
        return normalizarTexto(op.buscaEm ? op.buscaEm(l) : l[cols[0].chave]).indexOf(termo) !== -1;
      });

      if (ordCol >= 0) {
        var c = cols[ordCol];
        visiveis.sort(function (a, b) {
          var x = a[c.chave], y = b[c.chave];
          var r = (typeof x === "number" && typeof y === "number")
            ? x - y
            : String(x).localeCompare(String(y), "pt-BR");
          return ordDesc ? -r : r;
        });
      }

      tbody.innerHTML = visiveis.map(function (l, i) {
        return "<tr>" + cols.map(function (c, j) {
          return "<td" + (c.num ? ' class="num"' : "") + ">" +
            (j === 0 && op.numerar ? '<span class="pos-linha">' + (i + 1) + "</span> " : "") +
            texto(l, c) + "</td>";
        }).join("") + "</tr>";
      }).join("");

      if (contagem) contagem.textContent = op.resumo
        ? op.resumo(visiveis, op.linhas)
        : visiveis.length + " de " + op.linhas.length;
    }

    raiz.querySelectorAll("[data-ord]").forEach(function (th) {
      function ordenar() {
        var i = +th.getAttribute("data-ord");
        if (i === ordCol) ordDesc = !ordDesc; else { ordCol = i; ordDesc = !!cols[i].num; }
        raiz.querySelectorAll("[data-ord]").forEach(function (o) {
          o.setAttribute("aria-sort", "none");
        });
        th.setAttribute("aria-sort", ordDesc ? "descending" : "ascending");
        pintar();
      }
      th.addEventListener("click", ordenar);
      th.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); ordenar(); }
      });
    });

    if (filtro) filtro.addEventListener("input", pintar);

    var btn = raiz.querySelector("[data-baixar-consulta]");
    if (btn) btn.addEventListener("click", function () {
      var cab = cols.map(function (c) { return c.rot; });
      var linhas = visiveis.map(function (l) {
        return cols.map(function (c) {
          var v = l[c.chave];
          return typeof v === "number" ? String(v).replace(".", ",") : String(v == null ? "" : v);
        });
      });
      baixarCSV(op.baixar, [cab].concat(linhas));
    });

    pintar();
  }

  function normalizarTexto(s) {
    return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  function baixarCSV(nome, matriz) {
    var csv = matriz.map(function (l) {
      return l.map(function (v) {
        var s = String(v == null ? "" : v);
        return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(";");
    }).join("\n");
    var blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = nome + ".csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    if (typeof UI !== "undefined" && UI.toast) UI.toast("Baixando " + nome + ".csv", "ok");
  }

  /* ---------- página de área: os números dela ----------
     As abas tinham gráfico mas nenhum número, e a pizza era
     fixa no HTML (30/20/35/15, inventados). Aqui tudo sai de
     dados.js: a execução da função orçamentária da área, a
     repartição real por grupo de natureza da despesa e a
     posição entre as 24 funções.
  ------------------------------------------------------ */

  function areaAtual() {
    var chave = document.body.getAttribute("data-sector");
    if (!chave) return null;
    var achada = null;
    DADOS.areas.itens.forEach(function (a) { if (a.chave === chave) achada = a; });
    return achada && achada.liquidada ? achada : null;
  }

  // Cores dos grupos de despesa: fixas, não a da área. Usar
  // var(--sector) aqui fazia "Pessoal" sair igual a
  // "Investimentos" na aba Segurança, onde a cor da área é o
  // mesmo verde — a pizza aparentava ter duas fatias.
  // Fixas também deixam a leitura igual em todas as abas.
  var COR_GRUPO = {
    "Pessoal e encargos": "var(--navy-800)",
    "Outras despesas correntes": "var(--navy-500)",
    "Investimentos": "var(--green-600)",
    "Inversões financeiras": "var(--gold-500)",
    "Juros da dívida": "var(--text-muted)",
    "Amortização da dívida": "var(--navy-300)"
  };

  // o CSS da pizza só comporta quatro fatias em variáveis; monto
  // o conic-gradient aqui para aceitar quantas o dado tiver
  function montarPizza(grupos) {
    var visiveis = grupos.filter(function (g) { return g.share >= 0.05; });

    // Filete branco entre as fatias. As cores diferem em matiz
    // mas quase não em luminosidade — azul e verde ficam em
    // 1,09:1, que some num daltonismo verde-vermelho. O filete
    // marca a divisa sem depender da cor.
    var FIO = 0.45;
    var paradas = [];
    var acc = 0;

    visiveis.forEach(function (g, i) {
      var cor = COR_GRUPO[g.nome] || "var(--navy-300)";
      var ini = i === 0 ? 0 : acc + FIO;
      var fim = acc + g.share;
      if (i === visiveis.length - 1) fim = 100;
      paradas.push(cor + " " + ini.toFixed(2) + "% " + fim.toFixed(2) + "%");
      if (i < visiveis.length - 1) {
        paradas.push("#fff " + fim.toFixed(2) + "% " + (fim + FIO).toFixed(2) + "%");
      }
      acc = fim;
    });

    var legenda = visiveis.map(function (g) {
      var cor = COR_GRUPO[g.nome] || "var(--navy-300)";
      return "<li><span class=\"swatch\" style=\"background:" + cor + "\"></span>" +
        g.nome + '<span class="pct">' + DADOS.moeda(g.valor) + " · " +
        String(g.share).replace(".", ",") + "%</span></li>";
    }).join("");

    return {
      pizza: '<div class="pie-chart" style="background:conic-gradient(' +
        paradas.join(", ") + ')" role="img" aria-label="' +
        visiveis.map(function (g) { return g.nome + ", " + String(g.share).replace(".", ",") + "%"; }).join("; ") +
        '"></div>',
      legenda: '<ul class="pie-legend">' + legenda + "</ul>"
    };
  }

  function renderAreaResumo(alvo) {
    if (!alvo) return;
    var a = areaAtual();
    if (!a) { alvo.remove(); return; }

    // posição entre as 24 funções, por despesa liquidada
    var pos = 0;
    DADOS.funcoes.itens.forEach(function (f, i) {
      if (f.cod === a.funcao) pos = i + 1;
    });
    var nFun = DADOS.funcoes.itens.length;

    var serie = DADOS.serie.setores[a.chave];
    var anos = DADOS.serie.anos;
    var cresc = serie ? ((serie[serie.length - 1] / serie[0] - 1) * 100) : null;

    // Mostro empenhado e liquidado, não "pago".
    // Motivo: no painel de Despesas Detalhadas a coluna paga não
    // fecha com a do painel de Despesas Gerais (R$ 936 mi de
    // diferença no total), e em 7 das 24 funções ela vem MAIOR
    // que a liquidada, o que não pode acontecer. A liquidada
    // bate exatamente nos dois painéis, então é nela que apoio
    // tudo. O valor de paga fica em dados.js para consulta.
    var aLiquidar = a.empenhada - a.liquidada;

    alvo.innerHTML =
      '<section class="card area-resumo">' +
        '<div class="card__header">' +
          '<h2 class="card__title">' + a.nome + " em " + DADOS.execucao.exercicio + "</h2>" +
          '<span class="card__selo">dado oficial</span>' +
        "</div>" +

        '<div class="area-resumo__topo">' +
          '<div class="area-resumo__cifra">' +
            '<p class="area-resumo__rot">Liquidado até ' + DADOS.execucao.consultaEm + "</p>" +
            '<p class="area-resumo__valor">' + DADOS.moeda(a.liquidada) + "</p>" +
            '<p class="area-resumo__sub">' + DADOS.pct(a.share) + " da despesa do Estado · " +
              DADOS.porHabitante(a.liquidada) + " por pernambucano</p>" +
          "</div>" +
          '<dl class="area-resumo__pares">' +
            "<div><dt>Empenhado</dt><dd>" + DADOS.moeda(a.empenhada) + "</dd></div>" +
            "<div><dt>Liquidado</dt><dd>" + DADOS.moeda(a.liquidada) + "</dd></div>" +
            "<div><dt>A liquidar</dt><dd>" + DADOS.moeda(aLiquidar) + "</dd></div>" +
            "<div><dt>Posição</dt><dd>" + pos + "ª de " + nFun + " funções</dd></div>" +
          "</dl>" +
        "</div>" +

        '<p class="area-resumo__leitura">' +
          "Entre o que foi <span data-termo=\"empenhado\">empenhado</span> e o que já foi " +
          "<span data-termo=\"liquidado\">liquidado</span> há <b>" + DADOS.moeda(aLiquidar) +
          "</b> em contratos firmados cujo serviço ainda não foi entregue ou conferido." +
          (cresc !== null
            ? " Em " + anos[0] + " a área liquidava " + DADOS.moeda(serie[0]) +
              ", uma variação de <b>" + cresc.toFixed(0) + "%</b> em " + (anos.length - 1) + " anos."
            : "") +
        "</p>" +

        '<p class="chart-caption">Função orçamentária ' + a.funcao + " · " +
          DADOS.execucao.fonte + " · consulta em " + DADOS.execucao.consultaEm + "</p>" +
      "</section>";

    if (typeof UI !== "undefined" && UI.tooltips) UI.tooltips(alvo);
  }

  /* ---------- receita: de onde vem ---------- */

  // o portal oficial trata receita e despesa como dois assuntos
  // em menus separados. aqui ficam lado a lado, porque a pergunta
  // "de onde vem" e "para onde vai" é uma só pergunta.
  function renderReceita(alvo) {
    if (!alvo) return;
    var r = DADOS.receita;
    var pago = DADOS.execucao.etapas[3];
    var dif = r.arrecadada - pago.valor;

    var correntes = r.categorias[0];
    var capital = r.categorias[1];

    alvo.innerHTML =
      '<section class="card receita">' +
        '<div class="card__header">' +
          '<h2 class="card__title">De onde vem o dinheiro</h2>' +
          '<span class="card__selo">dado oficial</span>' +
        "</div>" +

        '<div class="receita__topo">' +
          '<div class="receita__bloco">' +
            '<p class="receita__rot">Previsto para ' + r.exercicio + "</p>" +
            '<p class="receita__cifra">' + DADOS.moeda(r.prevista) + "</p>" +
          "</div>" +
          '<div class="receita__bloco receita__bloco--forte">' +
            '<p class="receita__rot">Já arrecadado</p>' +
            '<p class="receita__cifra">' + DADOS.moeda(r.arrecadada) + "</p>" +
            '<p class="receita__share">' + DADOS.pct(r.share) + " do previsto</p>" +
          "</div>" +
        "</div>" +

        '<div class="receita__barra" role="img" aria-label="' +
          DADOS.pct(r.share) + ' da receita prevista para ' + r.exercicio + ' já foi arrecadada.">' +
          '<span style="--v:' + r.share.toFixed(1) + '"></span>' +
        "</div>" +

        '<p class="receita__frase">O Estado arrecadou <b>' + DADOS.moeda(r.arrecadada) +
          "</b> e pagou <b>" + DADOS.moeda(pago.valor) + "</b> em despesa até " +
          r.consultaEm + ". A diferença entre as duas é de <b>" + DADOS.moeda(Math.abs(dif)) +
          "</b>." +
        "</p>" +

        '<ul class="receita__quebra">' +
          '<li><span class="receita__qrot">Receitas correntes</span>' +
            '<span class="receita__qval">' + DADOS.moeda(correntes.arrecadada) + "</span>" +
            '<span class="receita__qctx">impostos, taxas e transferências</span></li>' +
          '<li><span class="receita__qrot">Receitas de capital</span>' +
            '<span class="receita__qval">' + DADOS.moeda(capital.arrecadada) + "</span>" +
            '<span class="receita__qctx">operações de crédito e alienação de bens</span></li>' +
          '<li><span class="receita__qrot">Deduções</span>' +
            '<span class="receita__qval receita__qval--neg">' + DADOS.moeda(r.categorias[4].arrecadada) + "</span>" +
            '<span class="receita__qctx">o que sai antes de virar caixa do Estado</span></li>' +
        "</ul>" +

        '<p class="chart-caption">' + r.fonte + " · consulta em " + r.consultaEm +
          '. <button type="button" class="link-inline" data-abre-receita>' +
          "Ver a abertura completa</button></p>" +
      "</section>";

    var b = alvo.querySelector("[data-abre-receita]");
    if (b && typeof UI !== "undefined") {
      b.addEventListener("click", function () {
        var linhas = r.categorias.map(function (c) {
          return "<tr><td>" + c.nome + "</td><td>" + DADOS.moeda(c.prevista) +
                 "</td><td>" + DADOS.moeda(c.arrecadada) + "</td></tr>";
        }).join("");
        var poderes = r.poderes.map(function (p) {
          return "<tr><td>" + p.nome + "</td><td colspan=\"2\">" + DADOS.moeda(p.valor) + "</td></tr>";
        }).join("");
        UI.modal({
          titulo: "Receita de " + r.exercicio + ", por categoria",
          corpo:
            '<table class="tabela-dados"><thead><tr><th>Categoria</th><th>Previsto</th><th>Arrecadado</th></tr></thead>' +
            "<tbody>" + linhas + "</tbody></table>" +
            '<h3 class="modal__sub">Por poder</h3>' +
            '<table class="tabela-dados"><tbody>' + poderes + "</tbody></table>" +
            '<p class="modal__nota">' + r.fonte + " · consulta em " + r.consultaEm + ".</p>"
        });
      });
    }
  }

  /* ---------- gráfico de barras ---------- */

  function renderChart(el) {
    var serie = DADOS.serie;
    var chave = el.getAttribute("data-serie") || setorAtual();
    var valores = serie.setores[chave] || serie.setores.inicio;
    var anos = serie.anos;

    // os valores são reais, em R$. o topo sobe até uma marca
    // redonda acima do maior ano, para o eixo ficar legível
    var max = Math.max.apply(null, valores);
    var passo = Math.pow(10, Math.floor(Math.log10(max))) / 2;
    var topo = Math.ceil(max / passo) * passo;

    var barras = valores.map(function (v, i) {
      var ultimo = i === valores.length - 1 ? ' data-destaque="sim"' : "";
      var rotulo = anos[i] + ": " + DADOS.moeda(v);
      return '<div class="chart__bar" style="--v:' + ((v / topo) * 100).toFixed(1) + '"' +
             ultimo + ' title="' + rotulo + '"></div>';
    }).join("");

    var eixoY = [topo, topo * 0.75, topo * 0.5, topo * 0.25, 0]
      .map(function (v) { return "<span>" + DADOS.moeda(v) + "</span>"; }).join("");

    var eixoX = anos.map(function (a) {
      return "<span>" + String(a).slice(2) + "</span>";
    }).join("");

    el.innerHTML =
      '<div class="chart__y" aria-hidden="true">' + eixoY + "</div>" +
      '<div class="chart__plot">' + barras + "</div>" +
      '<div class="chart__x" aria-hidden="true">' + eixoX + "</div>";
    el.setAttribute("role", "img");
    el.setAttribute("aria-label",
      "Gráfico de barras da despesa liquidada, " + anos[0] + " a " +
      anos[anos.length - 1] + ". " +
      anos.map(function (a, i) { return a + ": " + DADOS.moeda(valores[i]); }).join("; ") + ".");
  }

  /* ---------- ranking ---------- */

  var RANKING_VISIVEL = 15;

  // uma linha do ranking. "--v" vai de 0 a 100; o teto de 90% da
  // largura é aplicado no CSS, para o 1º lugar não preencher a
  // linha inteira e virar aparência de seleção.
  function linhaRanking(item, i, max) {
    var contexto = item.pop
      ? '<span class="mun__ctx">' + DADOS.inteiro(item.pop) + " hab · " + item.regiao + "</span>"
      : "";
    return "<li style=\"--v:" + ((item.valor / max) * 100).toFixed(1) + "\">" +
             '<span class="pos">' + (i + 1) + "</span>" +
             '<span class="mun">' + item.nome + contexto + "</span>" +
             '<span class="val">' + DADOS.moeda(item.valor) + "</span>" +
           "</li>";
  }

  function renderRanking(lista) {
    var itens = DADOS.ranking.itens;
    if (!itens.length) return;
    var max = itens[0].valor;

    lista.innerHTML = itens.slice(0, RANKING_VISIVEL).map(function (item, i) {
      return linhaRanking(item, i, max);
    }).join("");
  }

  /* ---------- comparador ---------- */

  // a frase embaixo da comparação. existe porque a ordem muda
  // quando se divide pela população, e é justamente essa virada
  // que a pessoa não veria olhando só o valor total.
  function viradaPorHabitante(na, ia, nb, ib) {
    var pa = ia.valor / ia.pop, pb = ib.valor / ib.pop;
    var maiorTotal = ia.valor >= ib.valor ? na : nb;
    var maiorHab   = pa >= pb ? na : nb;
    var razao = (Math.max(pa, pb) / Math.min(pa, pb));

    var vezes = razao.toFixed(1).replace(".", ",");

    // abaixo de 1,1 a razão não significa nada: dizer "1,0 vezes
    // mais" soa a erro. nesse caso a leitura é a semelhança.
    if (razao < 1.1) {
      return "Os dois recebem praticamente o mesmo por habitante — " +
        DADOS.porHabitante(ia.valor, ia.pop) + " e " + DADOS.porHabitante(ib.valor, ib.pop) +
        " — embora " + maiorTotal + " receba muito mais em valor total.";
    }
    if (maiorTotal !== maiorHab) {
      return "Em valor total " + maiorTotal + " recebe mais, mas por habitante a ordem inverte: " +
        maiorHab + " recebe " + vezes + " vezes mais por pessoa.";
    }
    return maiorHab + " recebe mais nas duas medidas — " + vezes + " vezes mais por habitante.";
  }

  function montarComparador(card) {
    var selects = card.querySelectorAll(".comparador select");
    var botao = card.querySelector(".comparador button");
    var saida = card.querySelector(".comparador__result");
    if (!selects.length || !botao || !saida) return;

    var itens = DADOS.ranking.itens;

    // preenche as duas listas a partir dos dados, em vez de HTML
    // fixo. com 185 municípios, agrupo por região para a pessoa
    // não rolar uma lista corrida — e ordeno por nome dentro de
    // cada grupo, porque aqui ela está procurando, não rankeando.
    var porRegiao = {};
    itens.forEach(function (i) {
      var g = i.regiao || "";
      (porRegiao[g] = porRegiao[g] || []).push(i);
    });
    var grupos = Object.keys(porRegiao);

    var opcoes = grupos.length > 1
      ? DADOS.regioes.filter(function (g) { return porRegiao[g]; }).map(function (g) {
          return '<optgroup label="' + g + '">' +
            porRegiao[g].slice().sort(function (x, y) { return x.nome.localeCompare(y.nome, "pt-BR"); })
              .map(function (i) { return '<option value="' + i.nome + '">' + i.nome + "</option>"; }).join("") +
            "</optgroup>";
        }).join("")
      : itens.map(function (i) { return '<option value="' + i.nome + '">' + i.nome + "</option>"; }).join("");

    Array.prototype.forEach.call(selects, function (sel) {
      sel.innerHTML = '<option value="">Selecione</option>' + opcoes;
    });

    function achar(nome) {
      for (var i = 0; i < itens.length; i++) {
        if (itens[i].nome === nome) return itens[i];
      }
      return null;
    }
    function valorDe(nome) {
      var it = achar(nome);
      return it ? it.valor : null;
    }

    botao.addEventListener("click", function () {
      var a = selects[0].value, b = selects[1].value;

      if (!a || !b) {
        saida.removeAttribute("data-estado");
        saida.textContent = "Selecione dois para comparar.";
        return;
      }
      if (a === b) {
        saida.removeAttribute("data-estado");
        saida.textContent = "Escolha dois diferentes.";
        return;
      }

      var ia = achar(a), ib = achar(b);
      var va = ia.valor, vb = ib.valor;
      var diff = ((va - vb) / vb) * 100;
      var sinal = diff >= 0 ? "mais" : "menos";
      var texto = (diff >= 0 ? "+" : "") + diff.toFixed(1).replace(".", ",") + "%";

      // em valor absoluto o município grande sempre ganha, e isso
      // não informa nada. quando há população, mostro também o
      // valor por habitante, que é a comparação que responde algo.
      function lado(nome, it) {
        var extra = "";
        if (it.pop) {
          extra =
            '<p class="comparacao__porhab">' + DADOS.porHabitante(it.valor, it.pop) + " por habitante</p>" +
            '<p class="comparacao__ctx">' + DADOS.inteiro(it.pop) + " hab · " + it.regiao + "</p>";
        }
        return '<div class="comparacao__lado">' +
                 '<p class="comparacao__nome">' + nome + "</p>" +
                 '<p class="comparacao__valor">' + DADOS.moeda(it.valor) + "</p>" +
                 extra +
               "</div>";
      }

      saida.setAttribute("data-estado", "preenchido");
      saida.innerHTML =
        '<div class="comparacao">' +
          lado(a, ia) +
          '<div class="comparacao__delta" data-sinal="' + sinal + '">' + texto +
            '<span class="comparacao__delta-rot">em valor total</span></div>' +
          lado(b, ib) +
        "</div>" +
        (ia.pop && ib.pop
          ? '<p class="comparacao__virada">' + viradaPorHabitante(a, ia, b, ib) + "</p>"
          : "");
    });
  }

  /* ---------- expandir gráfico ---------- */

  function montarToggle(btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".card");
      var painel = card.querySelector(".chart-expanded");
      var abrindo = painel.hasAttribute("hidden");

      if (abrindo) {
        painel.removeAttribute("hidden");
        painel.querySelectorAll(".chart").forEach(renderChart);
        btn.textContent = "Ocultar dados completos";
      } else {
        painel.setAttribute("hidden", "");
        btn.textContent = "Ver dados completos";
      }
      btn.setAttribute("aria-expanded", String(abrindo));
    });
  }


  /* ---------- barra de acessibilidade ----------
     Mesmo recurso que o portal do Estado oferece na borda
     esquerda: aumentar e diminuir o texto e ligar alto contraste.
  ------------------------------------------------- */

  function renderAcessibilidade() {
    var raiz = document.createElement("nav");
    raiz.className = "acessibilidade";
    raiz.setAttribute("aria-label", "Ferramentas de acessibilidade");
    raiz.innerHTML =
      '<button type="button" data-aa="mais" aria-label="Aumentar o texto">A+</button>' +
      '<button type="button" data-aa="menos" aria-label="Diminuir o texto">A\u2212</button>' +
      '<button type="button" data-aa="contraste" aria-pressed="false" aria-label="Alto contraste">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/>' +
        "</svg>" +
      "</button>";
    document.body.appendChild(raiz);

    var html = document.documentElement;
    var escala = ["", "g", "gg"];
    var nivel = 0;

    raiz.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button");
      if (!btn) return;
      var acao = btn.getAttribute("data-aa");

      if (acao === "mais")  nivel = Math.min(nivel + 1, 2);
      if (acao === "menos") nivel = Math.max(nivel - 1, 0);
      if (acao === "mais" || acao === "menos") {
        if (escala[nivel]) html.setAttribute("data-fonte", escala[nivel]);
        else html.removeAttribute("data-fonte");
        UI.toast(["Texto no tamanho normal", "Texto maior", "Texto bem maior"][nivel], "ok");
      }

      if (acao === "contraste") {
        var ligado = html.getAttribute("data-contraste") === "alto";
        if (ligado) html.removeAttribute("data-contraste");
        else html.setAttribute("data-contraste", "alto");
        btn.setAttribute("aria-pressed", String(!ligado));
        UI.toast(ligado ? "Alto contraste desligado" : "Alto contraste ligado", "ok");
      }
    });
  }

  /* ---------- grade de cartões de consulta ---------- */

  var ICONES = {
    orgao:     '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>',
    credor:    '<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    contrato:  '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h4"/>',
    historico: '<path d="M4 20V10M10 20V5M16 20v-8M22 20H2"/>',
    todas:     '<path d="M12 6v12M6 12h12"/>'
  };

  var CONSULTAS = [
    { chave: "orgao",     rotulo: "Despesa por órgão",  cor: "educacao" },
    { chave: "credor",    rotulo: "Despesa por credor", cor: "saude" },
    { chave: "contrato",  rotulo: "Contratos vigentes", cor: "seguranca" },
    { chave: "historico", rotulo: "Série histórica",    cor: "politica" },
    { chave: "todas",     rotulo: "Todas as consultas", cor: null }
  ];

  function renderCartoes(lista) {
    lista.innerHTML = CONSULTAS.map(function (c) {
      var cor = c.cor ? ' style="--cor:var(--cor-' + c.cor + ')"' : "";
      var mod = c.cor ? "" : " cartao--todas";
      return "<li>" +
        '<a class="cartao' + mod + '" href="#" data-consulta="' + c.chave + '"' + cor + ">" +
          '<span class="cartao__icone">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
              ICONES[c.chave] +
            "</svg>" +
          "</span>" +
          '<span class="cartao__rotulo">' + c.rotulo + "</span>" +
        "</a>" +
      "</li>";
    }).join("");
  }

  /* ---------- cabeçalho de seção com disco ---------- */

  function renderSecoes() {
    document.querySelectorAll("[data-secao]").forEach(function (el) {
      var d = el.getAttribute("data-secao");
      el.classList.add("secao");
      el.innerHTML =
        '<span class="secao__disco" aria-hidden="true">' +
          '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
            (ICONES[el.getAttribute("data-icone")] || ICONES.historico) +
          "</svg>" +
        "</span>" +
        '<h2 class="secao__rotulo">' + d + "</h2>";
    });
  }

  /* ---------- entrada: um único momento, no carregamento ---------- */

  function animarEntrada() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll(".chart__bar").forEach(function (barra, i) {
      var h = barra.style.getPropertyValue("--v");
      barra.style.setProperty("--v", 0);
      barra.style.transition = "height .5s cubic-bezier(.2,.7,.3,1)";
      window.setTimeout(function () { barra.style.setProperty("--v", h); }, 120 + i * 45);
    });
  }

  /* ---------- modais ---------- */

  function montarModais() {
    var r = DADOS.ranking;

    // tabela completa dos 185, com filtro por região. o "por
    // habitante" usa a população do próprio município, não a do
    // Estado: é o que deixa Fernando de Noronha comparável a Recife.
    document.querySelectorAll(".card__link[href='#']").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        ev.preventDefault();

        var filtros = ['<button type="button" data-reg="" aria-pressed="true">Todas</button>']
          .concat(DADOS.regioes.map(function (nome) {
            return '<button type="button" data-reg="' + nome + '" aria-pressed="false">' + nome + "</button>";
          })).join("");

        var temPop = !!(r.itens[0] && r.itens[0].pop);

        UI.modal({
          titulo: r.titulo,
          corpo:
            '<p class="modal__intro">' + DADOS.inteiro(r.itens.length) + " " + r.rotulo +
              "s, por valor " + r.medida + " em " + DADOS.execucao.exercicio + "." +
              (r.nota ? '<span class="modal__nota">' + r.nota + "</span>" : "") + "</p>" +
            (temPop
              ? '<div class="filtro-regiao" role="group" aria-label="Filtrar por região">' + filtros + "</div>"
              : "") +
            '<p class="modal__contagem" aria-live="polite"></p>' +
            '<table class="modal-tabela"><thead><tr>' +
              "<th>#</th><th>" + (r.rotulo === "órgão" ? "Órgão" : "Município") + "</th>" +
              (temPop ? "<th>Região</th><th>População</th>" : "") +
              "<th>Recebido</th>" + (temPop ? "<th>Por habitante</th>" : "") +
            "</tr></thead><tbody data-alvo-tabela></tbody></table>"
        });

        var corpo = document.querySelector(".modal__corpo");
        if (!corpo) return;
        var alvo = corpo.querySelector("[data-alvo-tabela]");
        var grupo = corpo.querySelector(".filtro-regiao");
        var contagem = corpo.querySelector(".modal__contagem");

        function pintar(regiao) {
          var vis = regiao
            ? r.itens.filter(function (m) { return m.regiao === regiao; })
            : r.itens;

          alvo.innerHTML = vis.map(function (i, n) {
            return "<tr><td>" + (n + 1) + "</td><td>" + i.nome + "</td>" +
              (temPop ? "<td>" + i.regiao + "</td><td>" + DADOS.inteiro(i.pop) + "</td>" : "") +
              "<td>" + DADOS.moeda(i.valor) + "</td>" +
              (temPop ? "<td>" + DADOS.porHabitante(i.valor, i.pop) + "</td>" : "") +
              "</tr>";
          }).join("");

          if (!contagem) return;
          if (!regiao) {
            contagem.textContent = "Mostrando todos os " + DADOS.inteiro(vis.length) + ".";
            return;
          }
          var pop = vis.reduce(function (s, m) { return s + m.pop; }, 0);
          var val = vis.reduce(function (s, m) { return s + m.valor; }, 0);
          contagem.textContent = vis.length + " municípios no " + regiao + " · " +
            DADOS.inteiro(pop) + " habitantes · " + DADOS.moeda(val) + " no total, ou " +
            DADOS.porHabitante(val, pop) + " por habitante.";
        }

        pintar("");

        if (grupo) {
          grupo.addEventListener("click", function (e) {
            var btn = e.target.closest("button[data-reg]");
            if (!btn) return;
            Array.prototype.forEach.call(grupo.querySelectorAll("button"), function (x) {
              x.setAttribute("aria-pressed", String(x === btn));
            });
            pintar(btn.getAttribute("data-reg"));
          });
        }
      });
    });

    document.addEventListener("click", function (ev) {
      var cartao = ev.target.closest(".cartao");
      if (!cartao) return;
      ev.preventDefault();
      abrirConsulta(cartao.getAttribute("data-consulta"));
    });
  }

  /* ---------- as cinco consultas ---------- */

  function abrirConsulta(chave) {
    var ex = DADOS.execucao.exercicio;
    var fonte = DADOS.execucao.fonte + " · consulta em " + DADOS.execucao.consultaEm + ".";

    if (chave === "orgao") {
      var org = DADOS.conjuntos.orgaos;
      var totalO = org.itens.reduce(function (s, o) { return s + o.valor; }, 0);
      modalTabela({
        titulo: "Despesa por órgão",
        intro: org.itens.length + " órgãos com execução em " + ex +
          ". A soma do liquidado fecha com o total do painel oficial.",
        nota: fonte,
        busca: true, numerar: true, ordenarPor: 2,
        placeholder: "Filtrar por órgão...",
        buscaEm: function (l) { return l.nome; },
        colunas: [
          { rot: "Órgão", chave: "nome" },
          { rot: "Empenhado", chave: "empenhado", num: true, fmt: DADOS.moeda },
          { rot: "Liquidado", chave: "valor", num: true, fmt: DADOS.moeda },
          { rot: "% do total", chave: "share", num: true,
            fmt: function (v) { return DADOS.pct(v); } }
        ],
        linhas: org.itens.map(function (o) {
          return { nome: o.nome, empenhado: o.empenhado, valor: o.valor,
                   share: 100 * o.valor / totalO };
        }),
        resumo: function (v) {
          var s = v.reduce(function (a, o) { return a + o.valor; }, 0);
          return v.length + " órgãos · " + DADOS.moeda(s) + " liquidados";
        },
        baixar: "despesa-por-orgao-pe-" + ex
      });
      return;
    }

    if (chave === "credor") {
      var cr = DADOS.credores;
      modalTabela({
        titulo: "Despesa por credor",
        intro: "Os " + cr.itens.length + " maiores de <b>" + DADOS.inteiro(cr.totalCredores) +
          "</b> credores, apurados nos " + DADOS.inteiro(cr.totalEmpenhos) +
          " empenhos de " + ex + ". Concentram " +
          String(cr.concentracao).replace(".", ",") + "% do liquidado.",
        nota: cr.ressalva + " " + fonte,
        busca: true, numerar: true, ordenarPor: 2,
        placeholder: "Filtrar por nome ou CNPJ...",
        buscaEm: function (l) { return l.nome + " " + l.doc; },
        colunas: [
          { rot: "Credor", chave: "nome",
            fmt: function (v, l) {
              return v + '<span class="cel-sub">' + l.doc + "</span>";
            } },
          { rot: "Empenhado", chave: "empenhado", num: true, fmt: DADOS.moeda },
          { rot: "Liquidado", chave: "liquidado", num: true, fmt: DADOS.moeda },
          { rot: "Empenhos", chave: "empenhos", num: true, fmt: DADOS.inteiro }
        ],
        linhas: cr.itens.slice(),
        resumo: function (v) {
          var s = v.reduce(function (a, o) { return a + o.liquidado; }, 0);
          return v.length + " credores · " + DADOS.moeda(s) + " liquidados";
        },
        baixar: "maiores-credores-pe-" + ex
      });
      return;
    }

    if (chave === "historico") {
      var s = DADOS.serie;
      modalTabela({
        titulo: "Série histórica",
        intro: "Receita arrecadada e despesa liquidada do Estado, " +
          s.anos[0] + " a " + s.anos[s.anos.length - 1] + ", mais o liquidado de cada área.",
        nota: fonte,
        busca: false, ordenarPor: 0,
        colunas: [
          { rot: "Ano", chave: "ano", num: true },
          { rot: "Receita", chave: "receita", num: true, fmt: DADOS.moeda },
          { rot: "Despesa", chave: "despesa", num: true, fmt: DADOS.moeda },
          { rot: "Saúde", chave: "saude", num: true, fmt: DADOS.moeda },
          { rot: "Educação", chave: "educacao", num: true, fmt: DADOS.moeda },
          { rot: "Segurança", chave: "seguranca", num: true, fmt: DADOS.moeda }
        ],
        linhas: s.anos.map(function (ano, i) {
          return { ano: ano, receita: s.receita[i], despesa: s.setores.inicio[i],
                   saude: s.setores.saude[i], educacao: s.setores.educacao[i],
                   seguranca: s.setores.seguranca[i] };
        }),
        resumo: function (v) { return v.length + " exercícios"; },
        baixar: "serie-historica-pe"
      });
      return;
    }

    if (chave === "contrato") {
      // Não tenho esta base: contratos vivem no PEIntegrado, que
      // é outro sistema. Em vez de fingir, digo onde está e levo
      // para lá — e mostro o que daqui mais se aproxima.
      UI.modal({
        titulo: "Contratos vigentes",
        corpo:
          '<p class="modal__intro">Os contratos do Estado não ficam no Portal da ' +
            "Transparência: ficam no <b>PEIntegrado</b>, outro sistema do Governo. " +
            "Este protótipo não replica aquela base.</p>" +
          "<p>O que dá para ver aqui é o lado orçamentário do mesmo dinheiro — quanto " +
            "cada credor recebeu e por quantos empenhos:</p>" +
          '<p class="modal__acoes">' +
            '<button type="button" class="link-inline" data-ir="credor">Ver despesa por credor</button>' +
          "</p>" +
          '<h3 class="modal__sub">No sistema oficial</h3>' +
          '<ul class="rodape-lista rodape-lista--simples lista-clara">' +
            '<li><a href="https://www.peintegrado.pe.gov.br/Portal/Pages/Contratos.aspx" target="_blank" rel="noopener">' +
              "Painel de contratos<em>a partir de 2025 · PEIntegrado</em></a></li>" +
            '<li><a href="https://transparencia.pe.gov.br/licitacoes-e-contratos/menu-contratos/painel-de-contratos/" target="_blank" rel="noopener">' +
              "Painel de contratos<em>até 2024 · Portal da Transparência</em></a></li>" +
            '<li><a href="https://www.peintegrado.pe.gov.br/Portal/Pages/LicitacoesEmAndamento.aspx" target="_blank" rel="noopener">' +
              "Licitações em andamento<em>PEIntegrado</em></a></li>" +
          "</ul>"
      });
      var ir = document.querySelector("[data-ir]");
      if (ir) ir.addEventListener("click", function () { abrirConsulta("credor"); });
      return;
    }

    // todas as consultas
    var linhas = [
      { o: "Execução orçamentária", d: "Fixado, empenhado, liquidado e pago do Estado",
        n: DADOS.moeda(DADOS.execucao.etapas[0].valor), ir: null },
      { o: "Receita", d: "Previsto, arrecadado, por categoria e por poder",
        n: DADOS.moeda(DADOS.receita.arrecadada), ir: null },
      { o: "Despesa por função", d: DADOS.funcoes.itens.length + " funções orçamentárias",
        n: DADOS.funcoes.itens.length + " funções", ir: null },
      { o: "Despesa por órgão", d: DADOS.conjuntos.orgaos.itens.length + " órgãos com execução",
        n: DADOS.conjuntos.orgaos.itens.length + " órgãos", ir: "orgao" },
      { o: "Despesa por credor", d: DADOS.inteiro(DADOS.credores.totalCredores) + " credores nos empenhos do ano",
        n: DADOS.credores.itens.length + " maiores", ir: "credor" },
      { o: "Série histórica", d: "Receita e despesa de " + DADOS.serie.anos[0] + " a " + DADOS.serie.anos[DADOS.serie.anos.length - 1],
        n: DADOS.serie.anos.length + " anos", ir: "historico" },
      { o: "Municípios", d: "População, região e transferência estadual",
        n: DADOS.municipios.itens.length + " municípios", ir: null },
      { o: "Contratos vigentes", d: "Em outro sistema (PEIntegrado)",
        n: "fora desta base", ir: "contrato" }
    ];
    modalTabela({
      titulo: "Todas as consultas",
      intro: "Tudo que este protótipo tem, e de onde vem cada coisa.",
      nota: fonte,
      busca: false,
      colunas: [
        { rot: "Consulta", chave: "o",
          fmt: function (v, l) {
            return (l.ir ? '<button type="button" class="link-inline" data-abrir="' + l.ir + '">' + v + "</button>" : v) +
              '<span class="cel-sub">' + l.d + "</span>";
          } },
        { rot: "Tamanho", chave: "n", num: true }
      ],
      linhas: linhas,
      resumo: function (v) { return v.length + " consultas"; }
    });
    document.querySelectorAll("[data-abrir]").forEach(function (b) {
      b.addEventListener("click", function () { abrirConsulta(b.getAttribute("data-abrir")); });
    });
  }

  /* ---------- montagem ---------- */

  function mount() {
    var headerSlot = document.getElementById("site-header");
    var footerSlot = document.getElementById("site-footer");
    if (headerSlot) headerSlot.outerHTML = renderHeader();
    if (footerSlot) footerSlot.outerHTML = renderFooter();

    var aberturaSlot = document.getElementById("abertura");
    if (aberturaSlot) renderAbertura(aberturaSlot);

    var faixaSlot = document.getElementById("faixa-orcamento");
    if (faixaSlot) renderFaixa(faixaSlot);


    document.querySelectorAll(".chart:not([hidden] .chart)").forEach(function (el) {
      if (!el.closest("[hidden]")) renderChart(el);
    });

    renderReceita(document.getElementById("receita"));
    renderAreaResumo(document.getElementById("area-resumo"));

    // troca a pizza fixa do HTML pela repartição real por grupo
    // de natureza da despesa, e escreve as legendas que estavam
    // chumbadas com números inventados
    (function () {
      var a = areaAtual();
      var slot = document.querySelector("[data-pizza]");
      if (!slot) return;
      if (!a || !a.grupos) { slot.closest(".chart-block") && slot.closest(".chart-block").remove(); return; }
      var p = montarPizza(a.grupos);
      slot.innerHTML = p.pizza + p.legenda;
    })();

    // legendas dos gráficos, escritas a partir do dado
    document.querySelectorAll("[data-legenda-serie]").forEach(function (el) {
      var a = areaAtual();
      var anos = DADOS.serie.anos;
      el.innerHTML = "Despesa liquidada" + (a ? " em " + a.nome.toLowerCase() : " do Estado") +
        ", " + anos[0] + " a " + anos[anos.length - 1] + ", em reais. " +
        DADOS.execucao.fonte + " · consulta em " + DADOS.execucao.consultaEm + ".";
    });

    var r = DADOS.ranking;
    document.querySelectorAll("[data-titulo-ranking]").forEach(function (el) {
      if (!el.textContent.trim()) el.textContent = r.titulo;
    });
    document.querySelectorAll("[data-titulo-comparador]").forEach(function (el) {
      if (!el.textContent.trim()) el.textContent = "Comparar dois " + (r.rotulo === "órgão" ? "órgãos" : "municípios");
    });
    document.querySelectorAll("[data-rotulo-a]").forEach(function (el) {
      if (!el.textContent.trim()) el.textContent = "Primeiro " + r.rotulo;
    });
    document.querySelectorAll("[data-rotulo-b]").forEach(function (el) {
      if (!el.textContent.trim()) el.textContent = "Segundo " + r.rotulo;
    });
    document.querySelectorAll("[data-nota-ranking]").forEach(function (el) {
      if (el.textContent.trim()) return;
      el.innerHTML = "Os " + RANKING_VISIVEL + " primeiros de " +
        DADOS.inteiro(r.itens.length) + ". A barra de fundo compara cada um com o primeiro." +
        (r.nota ? " " + r.nota : "");
    });

    montarBusca();
    montarModais();
    renderSecoes();
    document.querySelectorAll(".cartoes").forEach(renderCartoes);
    renderAcessibilidade();

    document.querySelectorAll(".ranking-list").forEach(renderRanking);
    document.querySelectorAll(".card").forEach(montarComparador);
    document.querySelectorAll(".js-toggle-grafico").forEach(montarToggle);

    UI.tooltips();

    montarDownloads();

    animarEntrada();
  }

  document.addEventListener("DOMContentLoaded", mount);
})();
