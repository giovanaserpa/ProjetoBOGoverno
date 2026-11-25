/* ============================================================
   dados.js
   ÚNICO lugar com números do portal. Trocar aqui atualiza todas
   as páginas — régua, gráficos, faixa, ranking, comparador e
   as respostas do assistente.

   origem: "oficial"     = conferido na fonte, com data de consulta
           "ilustrativo" = número de exemplo, ainda a substituir

   PROVENIÊNCIA DESTA VERSÃO
   Execução, receita, repartição por função e série histórica:
   painéis do Portal da Transparência de PE (Pentaho/E-Fisco),
   consulta de 24/11/2026. Os painéis informam "Valores em Reais".
   População e região dos municípios: IBGE, Censo 2022.
   Transferência por município: painel "Transferências
   Constitucionais a Municípios" do próprio Estado — ver a nota
   em municipios.ressalva antes de usar em apresentação.
   ============================================================ */

var DADOS = (function () {

  var FONTE_PE   = "Portal da Transparência de PE · Sistema E-Fisco (SEFAZ/PE)";
  var FONTE_IBGE = "IBGE · Censo Demográfico 2022";
  var CONSULTA   = "24/11/2026";

  /* --- Execução orçamentária do Estado -----------------------
     Painel "Despesas Gerais", exercício 2026. Valores exatos
     como o painel publica, em reais.
  ------------------------------------------------------------ */
  var execucao = {
    origem: "oficial",
    exercicio: 2026,
    fonte: FONTE_PE,
    consultaEm: CONSULTA,
    etapas: [
      { rotulo: "Fixada atualizada", valor: 66217680909.08, share: 100.00 },
      { rotulo: "Empenhada",         valor: 58621010853.57, share: 88.53 },
      { rotulo: "Liquidada",         valor: 49160448053.23, share: 74.24 },
      { rotulo: "Paga",              valor: 48182157565.08, share: 72.76 }
    ],
    categorias: [
      { nome: "Despesas correntes", fixada: 53397856741.39, empenhada: 48900776616.60, liquidada: 41700269931.82, paga: 40923278568.20 },
      { nome: "Despesas de capital", fixada: 12356950167.69, empenhada: 9720234236.97, liquidada: 7460178121.41, paga: 7258878996.88 },
      { nome: "Reserva de contingência", fixada: 462874000.00, empenhada: 0, liquidada: 0, paga: 0 }
    ]
  };

  /* --- Receita do Estado -------------------------------------
     Painel "Receitas Totais". Entra aqui porque a proposta do
     projeto é a transparência do Estado, não só a despesa: sem
     a receita não se sabe de onde vem o que está sendo gasto.
  ------------------------------------------------------------ */
  var receita = {
    origem: "oficial",
    exercicio: 2026,
    fonte: FONTE_PE,
    consultaEm: CONSULTA,
    prevista: 76374231944.00,
    atualizada: 76374231944.00,
    arrecadada: 55941041304.12,
    share: 73.25,
    categorias: [
      { nome: "Receitas correntes", prevista: 66841802000.00, arrecadada: 59990237260.34 },
      { nome: "Receitas de capital", prevista: 6513162800.00, arrecadada: 7205383006.84 },
      { nome: "Correntes intraorçamentárias", prevista: 3017137744.00, arrecadada: 2317772531.25 },
      { nome: "Capital intraorçamentárias", prevista: 2129400.00, arrecadada: 0 },
      { nome: "Correntes — deduções", prevista: 0, arrecadada: -13572351494.31 }
    ],
    poderes: [
      { nome: "Executivo",   valor: 55213487902.38 },
      { nome: "Judiciário",  valor: 679043660.42 },
      { nome: "Legislativo", valor: 48509741.32 }
    ]
  };

  /* --- Série anual, 2008 a 2026 ------------------------------
     REAL. Despesa liquidada e receita arrecadada do Estado, e a
     despesa liquidada de cada função que tem página no portal.
     Valores em reais. Nada aqui muda a cada recarga.

     "inicio" é a despesa liquidada total — a série que a página
     inicial mostra. As demais chaves são funções orçamentárias:
     10 Saúde, 12 Educação, 06 Segurança, 04 Administração,
     13 Cultura, 09 Previdência.
  ------------------------------------------------------------ */
  var serie = {
    origem: "oficial",
    unidade: "reais",
    base: "despesa liquidada",
    fonte: FONTE_PE,
    consultaEm: CONSULTA,
    anos: [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    receita: [14348872327, 16196339923, 19479953020, 21246082833, 25047342799, 28086412871, 28631074988, 27840771935, 30250695859, 32347516867, 34792968802, 37528726465, 39600184523, 44248574082, 51402332982, 49894516000, 49506720338, 55430790532, 55941041304],
    setores: {
      inicio:      [13845738283, 16347717314, 18971399278, 21515714401, 24469913940, 27132767347, 29663840763, 28203579245, 30092027994, 33320486444, 34759871122, 37179997588, 38574999429, 42247542904, 51425992732, 48872197160, 48914926158, 55408980615, 49160448053],
      saude:       [2220029620, 2735677888, 3264024148, 3777642688, 4241727555, 4473283654, 5234012663, 5103200799, 5229014650, 5619713676, 5754506750, 6110218313, 7470919105, 8393125808, 9384315761, 9508711765, 10737558979, 11791664169, 10841423212],
      previdencia: [1977157370, 2149276719, 2378018250, 2670775356, 3065032187, 3399845226, 3892308014, 4314504270, 4595143459, 5440324133, 5809080484, 6333172648, 6662962353, 6844539243, 8008325687, 8420553448, 9331386847, 10046122820, 8336978813],
      educacao:    [1569394561, 1839658445, 2426862181, 2755870748, 2994659222, 3008820587, 3423241333, 3251846086, 3125064002, 3307392270, 3328847704, 3503368004, 3137533991, 4301858505, 6774016353, 7458115714, 8246675809, 8945098409, 8196155714],
      seguranca:   [1147405317, 1366551693, 1755698155, 2266753442, 2262562779, 2295425287, 2570231812, 2530581609, 2735760699, 3034388299, 3316141615, 3582285739, 3393617261, 3070634862, 3528735368, 3617225808, 3919059367, 4277998730, 3862766789],
      politica:    [726653394, 803938277, 915229047, 1032661549, 1179367006, 1347481980, 1584928796, 1473812349, 1462164089, 1409832451, 1327045809, 1355174362, 1558976773, 1466078971, 1625290104, 1629678184, 1837154951, 2021025444, 1765064385],
      cultura:     [102401560, 111548735, 107828724, 106432420, 144105433, 92932504, 111828882, 92082209, 84114774, 99970248, 101855150, 83989403, 114974174, 110405003, 163713051, 128472054, 315056202, 313796998, 352691620]
    }
  };

  /* --- Repartição por área -----------------------------------
     REAL. Share da despesa LIQUIDADA de 2026 por função
     orçamentária. Usei liquidada, e não paga, porque a soma das
     funções fecha exatamente com o total do painel oficial
     (R$ 49.160.448.053,23) — na coluna "paga" os dois painéis
     do Estado divergem em cerca de R$ 0,9 bi.

     Previdência social aparece aqui porque é a 2ª maior função
     do orçamento. Ficar de fora deixaria a faixa errada.
  ------------------------------------------------------------ */
  var areas = {
    origem: "oficial",
    base: "liquidada",
    total: 49160448053.23,
    fonte: FONTE_PE,
    consultaEm: CONSULTA,
    itens: [
      { chave: "saude", nome: "Saúde", share: 22.05, pagina: "saude.html", funcao: "10", empenhada: 12335612496, liquidada: 10841423212, paga: 10938779886, grupos: [ { nome: "Outras despesas correntes", valor: 7735020386, share: 71.3 }, { nome: "Pessoal e encargos", valor: 2519450418, share: 23.2 }, { nome: "Investimentos", valor: 583894973, share: 5.4 }, { nome: "Amortização da dívida", valor: 2956285, share: 0 }, { nome: "Juros da dívida", valor: 101151, share: 0 } ] },
      { chave: "previdencia", nome: "Previdência", share: 16.96, pagina: null, funcao: "09", empenhada: 10531588714, liquidada: 8336978813, paga: 8337392208, grupos: [ { nome: "Pessoal e encargos", valor: 8329590853, share: 99.9 }, { nome: "Outras despesas correntes", valor: 7381504, share: 0.1 }, { nome: "Investimentos", valor: 6456, share: 0 } ] },
      { chave: "educacao", nome: "Educação", share: 16.67, pagina: "educacao.html", funcao: "12", empenhada: 10268928685, liquidada: 8196155714, paga: 8170934750, grupos: [ { nome: "Pessoal e encargos", valor: 3914309553, share: 47.8 }, { nome: "Outras despesas correntes", valor: 3124721754, share: 38.1 }, { nome: "Investimentos", valor: 1076924408, share: 13.1 }, { nome: "Inversões financeiras", valor: 80200000, share: 1 } ] },
      { chave: "seguranca", nome: "Segurança", share: 7.86, pagina: "seguranca.html", funcao: "06", empenhada: 4202714892, liquidada: 3862766789, paga: 3825044900, grupos: [ { nome: "Pessoal e encargos", valor: 2751001105, share: 71.2 }, { nome: "Outras despesas correntes", valor: 873435347, share: 22.6 }, { nome: "Investimentos", valor: 238330337, share: 6.2 } ] },
      { chave: "politica", nome: "Gestão", share: 3.59, pagina: "politica.html", funcao: "04", empenhada: 2160265527, liquidada: 1765064385, paga: 1746894178, grupos: [ { nome: "Pessoal e encargos", valor: 930824155, share: 52.7 }, { nome: "Outras despesas correntes", valor: 684621437, share: 38.8 }, { nome: "Investimentos", valor: 102445051, share: 5.8 }, { nome: "Inversões financeiras", valor: 47173742, share: 2.7 } ] },
      { chave: "cultura", nome: "Cultura", share: 0.72, pagina: "cultura.html", funcao: "13", empenhada: 412513362, liquidada: 352691620, paga: 337483867, grupos: [ { nome: "Outras despesas correntes", valor: 295976650, share: 83.9 }, { nome: "Pessoal e encargos", valor: 29248828, share: 8.3 }, { nome: "Investimentos", valor: 27466142, share: 7.8 } ] },
      { chave: "outras", nome: "Outras áreas", share: 32.15, pagina: null, funcao: null, grupos: null }
    ]
  };

  /* --- Todas as funções orçamentárias ------------------------
     REAL. As 24 funções com execução em 2026, nos três estágios.
     Alimenta o modal "ver tudo" e as buscas por área.

     ATENÇÃO ao campo "paga": ele vem do painel de Despesas
     Detalhadas e NÃO fecha com o painel de Despesas Gerais — a
     soma dá R$ 49,118 bi contra os R$ 48,182 bi publicados como
     Paga, e em 7 das 24 funções o valor sai MAIOR que o
     liquidado, o que é impossível. Guardo o número porque é o
     que o Estado publica, mas o site não o exibe por função e
     nenhum cálculo se apoia nele. A liquidada bate exatamente
     nos dois painéis e é a base de tudo.
  ------------------------------------------------------------ */
  var funcoes = {
    origem: "oficial",
    exercicio: 2026,
    fonte: FONTE_PE,
    consultaEm: CONSULTA,
    itens: [
      { cod: "10", nome: "Saúde", empenhada: 12335612496, liquidada: 10841423212, paga: 10938779886 },
      { cod: "09", nome: "Previdência social", empenhada: 10531588714, liquidada: 8336978813, paga: 8337392208 },
      { cod: "12", nome: "Educação", empenhada: 10268928685, liquidada: 8196155714, paga: 8170934750 },
      { cod: "28", nome: "Encargos especiais", empenhada: 4788118750, liquidada: 4374844694, paga: 4393274796 },
      { cod: "06", nome: "Segurança pública", empenhada: 4202714892, liquidada: 3862766789, paga: 3825044900 },
      { cod: "02", nome: "Judiciária", empenhada: 3117108906, liquidada: 2753148199, paga: 2770167782 },
      { cod: "14", nome: "Direitos da cidadania", empenhada: 2546673799, liquidada: 2092952583, paga: 2098587427 },
      { cod: "04", nome: "Administração", empenhada: 2160265527, liquidada: 1765064385, paga: 1746894178 },
      { cod: "01", nome: "Legislativa", empenhada: 1765188651, liquidada: 1525400516, paga: 1521267379 },
      { cod: "26", nome: "Transporte", empenhada: 2230272549, liquidada: 1518812924, paga: 1538007886 },
      { cod: "15", nome: "Urbanismo", empenhada: 1319499258, liquidada: 1115263005, paga: 1085579743 },
      { cod: "16", nome: "Habitação", empenhada: 708212436, liquidada: 629270772, paga: 622185737 },
      { cod: "08", nome: "Assistência social", empenhada: 618984454, liquidada: 553113775, paga: 505639785 },
      { cod: "20", nome: "Agricultura", empenhada: 498623503, liquidada: 395201172, paga: 388603690 },
      { cod: "13", nome: "Cultura", empenhada: 412513362, liquidada: 352691620, paga: 337483867 },
      { cod: "23", nome: "Comércio e serviços", empenhada: 361085894, liquidada: 284936411, paga: 279665339 },
      { cod: "18", nome: "Gestão ambiental", empenhada: 249211639, liquidada: 186034188, paga: 192912641 },
      { cod: "19", nome: "Ciência e tecnologia", empenhada: 214633514, liquidada: 160532833, paga: 158680638 },
      { cod: "17", nome: "Saneamento", empenhada: 105573187, liquidada: 73005856, paga: 72850674 },
      { cod: "27", nome: "Desporto e lazer", empenhada: 82829872, liquidada: 51140894, paga: 47516607 },
      { cod: "22", nome: "Indústria", empenhada: 37298571, liquidada: 34859112, paga: 33059228 },
      { cod: "11", nome: "Trabalho", empenhada: 39177270, liquidada: 33568235, paga: 31973159 },
      { cod: "21", nome: "Organização agrária", empenhada: 15666517, liquidada: 14141530, paga: 13236617 },
      { cod: "24", nome: "Comunicações", empenhada: 11228407, liquidada: 9140822, paga: 8441141 }
    ]
  };

  /* --- Os 185 municípios de Pernambuco -----------------------
     População e região: IBGE, Censo 2022 (9.058.931 habitantes).
     "t" é a transferência recebida do Estado em 2026 e "t25" em
     2025, do painel estadual de transferências a municípios.

     RESSALVA, e ela importa numa apresentação: esse painel se
     chama "Transferências Constitucionais a Municípios", mas as
     colunas ICMS e IPI vêm ZERADAS em todos os anos de 2008 a
     2026. Só o IPVA tem valor. O total publicado para o Estado
     inteiro é de R$ 7,5 mi em 2026 — ordens de grandeza abaixo
     da cota-parte constitucional do ICMS. Trate estes números
     como "o que o Estado publica", não como o repasse real.
     É exatamente o tipo de lacuna que o projeto quer mostrar.
  ------------------------------------------------------------ */
  var regioes = ["RMR", "Zona da Mata", "Agreste", "Sertão", "São Francisco"];

  var municipios = {
    origem: "oficial",
    fonteDemografica: FONTE_IBGE,
    fonteTransferencia: FONTE_PE,
    consultaEm: CONSULTA,
    censo: 2022,
    populacaoTotal: 9058931,
    ressalva: "No painel estadual de transferências, as colunas ICMS e IPI estão zeradas em todos os anos. Só o IPVA tem valor.",
    regioes: regioes,
    itens: [
      { n: "Recife", p: 1488920, r: 0, t: 2345385.13, t25: 2457752.55 },
      { n: "Jaboatão dos Guararapes", p: 644037, r: 0, t: 529624.53, t25: 565080.55 },
      { n: "Caruaru", p: 378048, r: 2, t: 443625.48, t25: 447522.19 },
      { n: "Petrolina", p: 386791, r: 4, t: 419262.09, t25: 417015.74 },
      { n: "Olinda", p: 349976, r: 0, t: 304328.3, t25: 336107.08 },
      { n: "Paulista", p: 342167, r: 0, t: 261342.37, t25: 287156.3 },
      { n: "Garanhuns", p: 142506, r: 2, t: 156404.4, t25: 156840.24 },
      { n: "Cabo de Santo Agostinho", p: 203440, r: 0, t: 143773.48, t25: 150184.86 },
      { n: "Vitória de Santo Antão", p: 134084, r: 1, t: 117855.28, t25: 117852.13 },
      { n: "Camaragibe", p: 147771, r: 0, t: 111456.02, t25: 120314.06 },
      { n: "Santa Cruz do Capibaribe", p: 98254, r: 2, t: 105065.43, t25: 105765.6 },
      { n: "Serra Talhada", p: 92228, r: 3, t: 86105.4, t25: 85464.21 },
      { n: "Carpina", p: 79293, r: 1, t: 75183.08, t25: 78214.72 },
      { n: "Gravatá", p: 86516, r: 2, t: 72309.23, t25: 74000.33 },
      { n: "Ipojuca", p: 98932, r: 0, t: 70763.66, t25: 70711.48 },
      { n: "Igarassu", p: 115196, r: 0, t: 67168.28, t25: 71882.1 },
      { n: "Arcoverde", p: 77742, r: 3, t: 66290.32, t25: 66556.8 },
      { n: "São Lourenço da Mata", p: 111249, r: 0, t: 59124.48, t25: 61801.7 },
      { n: "Surubim", p: 64120, r: 2, t: 56365.44, t25: 55972.29 },
      { n: "Belo Jardim", p: 79507, r: 2, t: 55542.2, t25: 53457.27 },
      { n: "Salgueiro", p: 62372, r: 3, t: 52204.97, t25: 54693.95 },
      { n: "Araripina", p: 85088, r: 3, t: 52160.33, t25: 52673.29 },
      { n: "Abreu e Lima", p: 98462, r: 0, t: 51157.72, t25: 57398.21 },
      { n: "Goiana", p: 81055, r: 1, t: 51052.53, t25: 51773.66 },
      { n: "Bezerros", p: 61694, r: 2, t: 46147.45, t25: 44994.82 },
      { n: "Palmares", p: 54584, r: 1, t: 38295.3, t25: 38755.06 },
      { n: "Toritama", p: 41137, r: 2, t: 37310.82, t25: 37662.85 },
      { n: "Limoeiro", p: 56510, r: 2, t: 37066.73, t25: 38142.58 },
      { n: "São Bento do Una", p: 49449, r: 2, t: 35436.06, t25: 33468.43 },
      { n: "Pesqueira", p: 62722, r: 2, t: 35082.65, t25: 35613.04 },
      { n: "Escada", p: 59891, r: 1, t: 34662.53, t25: 35157.27 },
      { n: "Afogados da Ingazeira", p: 40241, r: 3, t: 34258.32, t25: 32698.33 },
      { n: "Moreno", p: 55292, r: 0, t: 33903.77, t25: 36626.43 },
      { n: "Lajedo", p: 39582, r: 2, t: 33454.18, t25: 32973.73 },
      { n: "Ouricuri", p: 65245, r: 3, t: 32066.36, t25: 32288.61 },
      { n: "Paudalho", p: 56665, r: 1, t: 31672.33, t25: 32494.9 },
      { n: "Timbaúba", p: 46147, r: 1, t: 31410.61, t25: 32940.4 },
      { n: "Custódia", p: 37699, r: 3, t: 25336.9, t25: 24839.29 },
      { n: "São José do Belmonte", p: 34843, r: 3, t: 23795.93, t25: 21436.9 },
      { n: "Brejo da Madre de Deus", p: 48648, r: 2, t: 23575.62, t25: 22576.86 },
      { n: "Trindade", p: 30321, r: 3, t: 21575.83, t25: 21161.55 },
      { n: "Bom Conselho", p: 44294, r: 2, t: 20212.45, t25: 19283.84 },
      { n: "Barreiros", p: 40121, r: 1, t: 19883.51, t25: 20288.46 },
      { n: "Cabrobó", p: 30294, r: 4, t: 18471.81, t25: 18435.44 },
      { n: "São Caitano", p: 37126, r: 2, t: 18279.04, t25: 17980.51 },
      { n: "Águas Belas", p: 41548, r: 2, t: 18060, t25: 16670.2 },
      { n: "Bom Jardim", p: 37629, r: 2, t: 17817.39, t25: 17064.84 },
      { n: "Buíque", p: 52097, r: 2, t: 17721.1, t25: 16915.33 },
      { n: "Cupira", p: 23518, r: 2, t: 17561.27, t25: 17274.78 },
      { n: "Bonito", p: 37474, r: 2, t: 17355.85, t25: 17214.88 },
      { n: "Taquaritinga do Norte", p: 24736, r: 2, t: 16785.39, t25: 16481.18 },
      { n: "Tabira", p: 27681, r: 3, t: 16610.03, t25: 16810.69 },
      { n: "Pombos", p: 27552, r: 1, t: 16314.45, t25: 16843.61 },
      { n: "Nazaré da Mata", p: 30648, r: 1, t: 16291.7, t25: 16254.59 },
      { n: "Ribeirão", p: 33507, r: 1, t: 16018.55, t25: 17144.34 },
      { n: "Floresta", p: 30137, r: 4, t: 16017.58, t25: 16157.11 },
      { n: "Petrolândia", p: 34161, r: 4, t: 15715.84, t25: 15541.61 },
      { n: "Sirinhaém", p: 37596, r: 1, t: 15382.75, t25: 15163.67 },
      { n: "Sertânia", p: 32811, r: 3, t: 15271.58, t25: 16033.86 },
      { n: "Santa Maria da Boa Vista", p: 40578, r: 4, t: 14583.65, t25: 14546.42 },
      { n: "São José do Egito", p: 31004, r: 3, t: 14339.68, t25: 14409.68 },
      { n: "Catende", p: 32156, r: 1, t: 14134.84, t25: 14210.02 },
      { n: "Chã Grande", p: 20546, r: 1, t: 13789.93, t25: 13908.99 },
      { n: "Cachoeirinha", p: 19899, r: 2, t: 13701.2, t25: 12980.52 },
      { n: "Riacho das Almas", p: 20639, r: 2, t: 13468.44, t25: 12843.18 },
      { n: "Agrestina", p: 23779, r: 2, t: 13311.22, t25: 13320.82 },
      { n: "Aliança", p: 35741, r: 1, t: 13297.79, t25: 13598.67 },
      { n: "Ipubi", p: 29009, r: 3, t: 13262.3, t25: 12371.94 },
      { n: "Itambé", p: 34935, r: 1, t: 13161.16, t25: 13597.88 },
      { n: "João Alfredo", p: 27725, r: 2, t: 12979.46, t25: 12235.61 },
      { n: "Passira", p: 28340, r: 2, t: 12835.98, t25: 12431.28 },
      { n: "Bodocó", p: 34478, r: 3, t: 12612.83, t25: 12447.89 },
      { n: "Tamandaré", p: 23561, r: 1, t: 12607.82, t25: 11947.16 },
      { n: "Condado", p: 24587, r: 1, t: 12375.93, t25: 11769.56 },
      { n: "Vicência", p: 26359, r: 1, t: 12374.29, t25: 12485.24 },
      { n: "Glória do Goitá", p: 29347, r: 1, t: 12300.05, t25: 12076.61 },
      { n: "Macaparana", p: 23879, r: 1, t: 12189.15, t25: 12347.06 },
      { n: "Feira Nova", p: 21427, r: 2, t: 12094.79, t25: 11735.36 },
      { n: "Jupi", p: 15329, r: 2, t: 12000.43, t25: 10873.5 },
      { n: "Caetés", p: 28827, r: 2, t: 11904.27, t25: 11304.07 },
      { n: "Lagoa de Itaenga", p: 19003, r: 1, t: 11313.58, t25: 11812.81 },
      { n: "Itaíba", p: 32650, r: 2, t: 11141.16, t25: 10722.86 },
      { n: "Ibimirim", p: 26593, r: 3, t: 11124.31, t25: 10842.07 },
      { n: "Exu", p: 31843, r: 3, t: 11030.14, t25: 11207.9 },
      { n: "Triunfo", p: 14705, r: 3, t: 10978, t25: 10966.47 },
      { n: "São João", p: 23837, r: 2, t: 10888.14, t25: 10943.2 },
      { n: "Orobó", p: 21808, r: 2, t: 10586.85, t25: 10216.41 },
      { n: "São José da Coroa Grande", p: 18825, r: 1, t: 10548.53, t25: 10836.85 },
      { n: "Canhotinho", p: 24329, r: 2, t: 10544.24, t25: 10241.64 },
      { n: "Camocim de São Félix", p: 17419, r: 2, t: 10160.13, t25: 9915.37 },
      { n: "São Vicente Férrer", p: 16677, r: 2, t: 10020.52, t25: 9889.88 },
      { n: "Vertentes", p: 21959, r: 2, t: 9706.58, t25: 9607.14 },
      { n: "Venturosa", p: 17251, r: 2, t: 9462.6, t25: 9402.19 },
      { n: "Dormentes", p: 17188, r: 4, t: 9441.57, t25: 8953 },
      { n: "Itapissuma", p: 27749, r: 0, t: 9058.05, t25: 9892.58 },
      { n: "Pedra", p: 22795, r: 2, t: 8920.3, t25: 8847.36 },
      { n: "Sanharó", p: 18624, r: 2, t: 8892.47, t25: 8712.11 },
      { n: "Ilha de Itamaracá", p: 24540, r: 0, t: 8755.95, t25: 9929.34 },
      { n: "Capoeiras", p: 18338, r: 2, t: 8586.33, t25: 7926.51 },
      { n: "Lagoa Grande", p: 24088, r: 4, t: 8535.18, t25: 8484.99 },
      { n: "Altinho", p: 20674, r: 2, t: 8400.8, t25: 8125.39 },
      { n: "Flores", p: 20347, r: 3, t: 8145.2, t25: 7956.97 },
      { n: "Água Preta", p: 26461, r: 1, t: 8138.94, t25: 8080.33 },
      { n: "Panelas", p: 22991, r: 2, t: 8122.81, t25: 7637.98 },
      { n: "Rio Formoso", p: 20009, r: 1, t: 7975.75, t25: 8224 },
      { n: "Santa Cruz da Baixa Verde", p: 11567, r: 3, t: 7870.57, t25: 7889.55 },
      { n: "Tupanatinga", p: 26937, r: 2, t: 7792.61, t25: 7294.48 },
      { n: "Lagoa do Carro", p: 17981, r: 1, t: 7788.42, t25: 7558.48 },
      { n: "Machados", p: 11333, r: 2, t: 7627.2, t25: 7159.85 },
      { n: "Belém do São Francisco", p: 18301, r: 4, t: 7551.49, t25: 7876.72 },
      { n: "São Joaquim do Monte", p: 20037, r: 2, t: 7315.28, t25: 6819.19 },
      { n: "Parnamirim", p: 18612, r: 3, t: 7250.98, t25: 6989.19 },
      { n: "Carnaíba", p: 18644, r: 3, t: 7183.69, t25: 7277.58 },
      { n: "Saloá", p: 13836, r: 2, t: 7104.75, t25: 6703.23 },
      { n: "Frei Miguelinho", p: 13636, r: 2, t: 7054.06, t25: 6959.26 },
      { n: "Amaraji", p: 18205, r: 1, t: 6656.82, t25: 6613 },
      { n: "Araçoiaba", p: 19243, r: 0, t: 6591.15, t25: 6696.43 },
      { n: "Paranatama", p: 12199, r: 2, t: 6388.2, t25: 5865.02 },
      { n: "Jataúba", p: 15843, r: 2, t: 6376.63, t25: 6326.81 },
      { n: "Gameleira", p: 18214, r: 1, t: 6303.47, t25: 6610.98 },
      { n: "Iati", p: 17165, r: 2, t: 6188.04, t25: 6030.65 },
      { n: "Sairé", p: 10887, r: 2, t: 5945.31, t25: 5132.7 },
      { n: "Quipapá", p: 17928, r: 1, t: 5895.92, t25: 5494.18 },
      { n: "Afrânio", p: 18674, r: 4, t: 5886.42, t25: 6049.01 },
      { n: "Lagoa dos Gatos", p: 14076, r: 2, t: 5696.54, t25: 5313.03 },
      { n: "Tacaimbó", p: 13738, r: 2, t: 5611, t25: 4996.51 },
      { n: "Santa Maria do Cambucá", p: 14013, r: 2, t: 5610.48, t25: 5594.67 },
      { n: "Correntes", p: 17131, r: 2, t: 5532.03, t25: 5629.66 },
      { n: "Cumaru", p: 15920, r: 2, t: 5496.19, t25: 5369.73 },
      { n: "Inajá", p: 25603, r: 3, t: 5405.88, t25: 5146.61 },
      { n: "Jurema", p: 13648, r: 2, t: 5402.76, t25: 5202.28 },
      { n: "Lagoa do Ouro", p: 11933, r: 2, t: 5335.05, t25: 5048.56 },
      { n: "Tacaratu", p: 23902, r: 4, t: 5268.72, t25: 5166.43 },
      { n: "Serrita", p: 18207, r: 3, t: 5262.53, t25: 4781.59 },
      { n: "Mirandiba", p: 14166, r: 3, t: 5233.1, t25: 5021.93 },
      { n: "Ferreiros", p: 15026, r: 1, t: 5134.51, t25: 5235.31 },
      { n: "Jucati", p: 11517, r: 2, t: 5089.5, t25: 5221.85 },
      { n: "Buenos Aires", p: 12808, r: 1, t: 5010.41, t25: 5046.11 },
      { n: "Fernando de Noronha", p: 3167, r: 0, t: 4950.78, t25: 5152.07 },
      { n: "Alagoinha", p: 13542, r: 2, t: 4885.39, t25: 5110.3 },
      { n: "Poção", p: 10500, r: 2, t: 4798.43, t25: 4477.7 },
      { n: "Orocó", p: 13613, r: 4, t: 4706.01, t25: 4467.66 },
      { n: "Barra de Guabiraba", p: 12263, r: 2, t: 4639.75, t25: 4555.6 },
      { n: "Joaquim Nabuco", p: 13269, r: 1, t: 4610.38, t25: 4580.08 },
      { n: "Itaquitinga", p: 16554, r: 1, t: 4467.35, t25: 4565.72 },
      { n: "Tuparetama", p: 8005, r: 3, t: 4411.02, t25: 4328.51 },
      { n: "Betânia", p: 11232, r: 3, t: 4408.46, t25: 4171.33 },
      { n: "Santa Cruz", p: 13841, r: 3, t: 4388.42, t25: 4594.11 },
      { n: "Calçado", p: 11093, r: 2, t: 4346.4, t25: 4157.39 },
      { n: "Tracunhaém", p: 13867, r: 1, t: 4240.24, t25: 4191.48 },
      { n: "Angelim", p: 10241, r: 2, t: 4172.89, t25: 4147.5 },
      { n: "Casinhas", p: 12967, r: 2, t: 4092.11, t25: 3891.52 },
      { n: "Brejão", p: 9079, r: 2, t: 4065.98, t25: 3910.95 },
      { n: "Camutanga", p: 7750, r: 1, t: 4056, t25: 3866.81 },
      { n: "Primavera", p: 13838, r: 1, t: 4019.42, t25: 4069.44 },
      { n: "Chã de Alegria", p: 12984, r: 1, t: 3748.33, t25: 3706.82 },
      { n: "Xexéu", p: 11611, r: 1, t: 3712.39, t25: 3755.33 },
      { n: "Cedro", p: 10518, r: 3, t: 3688.8, t25: 3383.66 },
      { n: "Calumbi", p: 5228, r: 3, t: 3546.32, t25: 3147.14 },
      { n: "Vertente do Lério", p: 7558, r: 2, t: 3526.33, t25: 3478.67 },
      { n: "Cortês", p: 10198, r: 1, t: 3526.27, t25: 3505.36 },
      { n: "Manari", p: 23763, r: 3, t: 3418.18, t25: 3327.56 },
      { n: "Terra Nova", p: 8920, r: 4, t: 3182.74, t25: 3123.35 },
      { n: "Jatobá", p: 14020, r: 4, t: 3160.12, t25: 3319.88 },
      { n: "Itapetim", p: 13791, r: 3, t: 3134.55, t25: 3404.56 },
      { n: "Iguaracy", p: 11081, r: 3, t: 3050.03, t25: 3253.63 },
      { n: "Belém de Maria", p: 10378, r: 1, t: 3016.69, t25: 2930.86 },
      { n: "Santa Filomena", p: 12106, r: 3, t: 2995.72, t25: 2878.13 },
      { n: "Verdejante", p: 9169, r: 3, t: 2978.36, t25: 2788.85 },
      { n: "Jaqueira", p: 10247, r: 1, t: 2951.53, t25: 2824.78 },
      { n: "São Benedito do Sul", p: 13113, r: 1, t: 2869.86, t25: 2682.92 },
      { n: "Terezinha", p: 6513, r: 2, t: 2811.16, t25: 2666.24 },
      { n: "Quixaba", p: 6554, r: 3, t: 2787.19, t25: 2963.34 },
      { n: "Carnaubeira da Penha", p: 12239, r: 4, t: 2726.14, t25: 2758.64 },
      { n: "Moreilândia", p: 10540, r: 3, t: 2724.89, t25: 2887.28 },
      { n: "Maraial", p: 9359, r: 1, t: 2595.83, t25: 2712.91 },
      { n: "Santa Terezinha", p: 10244, r: 3, t: 2442.01, t25: 2593.7 },
      { n: "Palmeirina", p: 7031, r: 2, t: 2425.45, t25: 2451.38 },
      { n: "Ibirajuba", p: 7140, r: 2, t: 2141.01, t25: 2161.97 },
      { n: "Granito", p: 6967, r: 3, t: 2108.01, t25: 2173.42 },
      { n: "Salgadinho", p: 5727, r: 2, t: 1830.03, t25: 1784.56 },
      { n: "Brejinho", p: 7720, r: 3, t: 1395.62, t25: 1474.63 },
      { n: "Ingazeira", p: 4765, r: 3, t: 1282.22, t25: 1312.28 },
      { n: "Solidão", p: 5210, r: 3, t: 1214.75, t25: 1255.67 },
      { n: "Itacuruba", p: 4284, r: 4, t: 1192.96, t25: 1252.56 }
    ]
  };

  /* --- Maiores credores --------------------------------------
     REAL. Agreguei os 244.459 empenhos de 2026 por credor —
     30.649 credores distintos — e guardei os 120 maiores, que
     concentram 80,3% do liquidado. As somas de empenhado e
     liquidado de TODOS os 30.649 batem ao centavo com o painel
     oficial (58,6210 bi e 49,1604 bi).

     Atenção à leitura: os primeiros colocados não são
     fornecedores. "Pessoal relacionado em folha de pagamento",
     a folha do TJPE e os fundos previdenciários somam R$ 22,70
     bi, quase metade do liquidado — é a folha do Estado
     registrada como um credor só.
  ------------------------------------------------------------ */
  var credores = {
    origem: "oficial",
    exercicio: 2026,
    fonte: FONTE_PE,
    consultaEm: CONSULTA,
    totalCredores: 30649,
    totalEmpenhos: 244459,
    guardados: 120,
    concentracao: 80.3,
    ressalva: "Os primeiros colocados são agregados de folha de pagamento, não fornecedores.",
    itens: [
      { doc: "PF99999990", nome: "PESSOAL RELACIONADO EM FOLHA DE PAGAMENTO", empenhado: 24637161220.79, liquidado: 20746618571.26, empenhos: 608 },
      { doc: "PF77777770", nome: "FOLHA DE PAGAMENTO DO TRIBUNAL DE JUSTICA", empenhado: 1992157713.37, liquidado: 1822354565.55, empenhos: 34 },
      { doc: "590101", nome: "FUNDO FINANCEIRO DE APOSENTADORIAS E PENSOES DOS SERVIDORES DO ESTADO DE PERNAMBUCO", empenhado: 1784088570.92, liquidado: 1528044476.81, empenhos: 90 },
      { doc: "00000000000191", nome: "BANCO DO BRASIL SA", empenhado: 1315838115.36, liquidado: 1273522141.68, empenhos: 29 },
      { doc: "00360305129492", nome: "CAIXA ECONOMICA FEDERAL", empenhado: 1032878085.27, liquidado: 880758744.34, empenhos: 16 },
      { doc: "00360305000104", nome: "CAIXA ECONOMICA FEDERAL", empenhado: 671866696.17, liquidado: 630105583.29, empenhos: 206 },
      { doc: "10988301000129", nome: "INSTITUTO DE MEDICINA INTEGRAL PROFESSOR FERNANDO FIGUEIRA - IMIP", empenhado: 491808137.82, liquidado: 484084566.26, empenhos: 83 },
      { doc: "29979036019321", nome: "INSTITUTO NACIONAL DO SEGURO SOCIAL", empenhado: 573012810.89, liquidado: 478015612.93, empenhos: 1083 },
      { doc: "00394460008479", nome: "MINISTERIO DA FAZENDA", empenhado: 433940676.65, liquidado: 414665943.54, empenhos: 54 },
      { doc: "05465222000101", nome: "RM TERCEIRIZACAO E GESTAO DE RECURSOS HUMANOS LTDA", empenhado: 499718173.07, liquidado: 410491593.4, empenhos: 1186 },
      { doc: "440702", nome: "FUNDACAO UNIVERSIDADE DE PERNAMBUCO", empenhado: 353958113.75, liquidado: 331908143.48, empenhos: 9 },
      { doc: "06035073000103", nome: "CEASA-PE/O.S - CENTRO DE ABASTECIMENTO E LOGISTICA DE PERNAMBUCO", empenhado: 355694079.32, liquidado: 302337993.43, empenhos: 23 },
      { doc: "PF88888280", nome: "TRANSFERENCIAS A PREFEITURAS - LEI 13.463/2008", empenhado: 353859182.33, liquidado: 287197619.87, empenhos: 13 },
      { doc: "PF26052010", nome: "BIRD - BANCO INTERNACIONAL PARA RECONSTRUCAO E DESENVOLVIMENTO", empenhado: 282644679.09, liquidado: 276066925.8, empenhos: 5 },
      { doc: "60701190000104", nome: "ITAU UNIBANCO S.A.", empenhado: 299394600.79, liquidado: 268078133.93, empenhos: 17 },
      { doc: "09759606000180", nome: "SIND DAS EMP DE TRANSP DE PASSAG DO EST DE PERNAMBUCO", empenhado: 272190186.02, liquidado: 261305296.21, empenhos: 60 },
      { doc: "90400888000142", nome: "BANCO SANTANDER (BRASIL) S.A.", empenhado: 283776508.01, liquidado: 250969793.38, empenhos: 19 },
      { doc: "10583920000800", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 256434252.25, liquidado: 242312210.87, empenhos: 14 },
      { doc: "10835932000108", nome: "COMPANHIA ENERGETICA DE PERNAMBUCO CELPE", empenhado: 243698347.03, liquidado: 215600499.72, empenhos: 460 },
      { doc: "10894988000133", nome: "SOCIEDADE PERNAMBUCANA DE COMBATE AO CANCER", empenhado: 222566115.85, liquidado: 213271702.46, empenhos: 75 },
      { doc: "PF00000012", nome: "BID - BANCO INTERAMERICANO DE DESENVOLVIMENTO", empenhado: 198105384.71, liquidado: 197288754.26, empenhos: 4 },
      { doc: "00394460040950", nome: "MINISTERIO DA FAZENDA", empenhado: 203557081.44, liquidado: 164413300.91, empenhos: 27 },
      { doc: "PF88888020", nome: "DIARIAS DE SERVIDOR", empenhado: 177751830.72, liquidado: 161870965.83, empenhos: 1400 },
      { doc: "700101", nome: "FUNDO DE APOSENTADORIAS E PENSOES DO ESTADO DE PERNAMBUCO", empenhado: 193014759.48, liquidado: 158325895.65, empenhos: 60 },
      { doc: "03401987000144", nome: "BBC SERVICOS DE VIGILANCIA LTDA EM RECUPERACAO JUDICIAL", empenhado: 195168482.58, liquidado: 154207680.18, empenhos: 191 },
      { doc: "09039744002308", nome: "FUNDACAO GESTAO HOSPITALAR MARTINIANO FERNANDES - FGH", empenhado: 156246990.23, liquidado: 154069033.87, empenhos: 6 },
      { doc: "PF20090902", nome: "DEPOSITOS JUDICIAIS DE VARAS ESTADUAIS - TJPE", empenhado: 157041181.4, liquidado: 151625691.48, empenhos: 238 },
      { doc: "18900523000150", nome: "CONSORCIO CONORTE", empenhado: 152419322.05, liquidado: 139432237.49, empenhos: 11 },
      { doc: "10892164000124", nome: "REAL HOSPITAL PORTUGUES DE BENEFICENCIA EM PERNAMBUCO", empenhado: 152946116.85, liquidado: 138232527.09, empenhos: 44 },
      { doc: "530101", nome: "FUNDACAO DE HEMATOLOGIA E HEMOTERAPIA DE PE - HEMOPE", empenhado: 152659193.03, liquidado: 138164532.23, empenhos: 33 },
      { doc: "08362490000188", nome: "ADSERV EMPREENDIMENTOS E SERVICOS DE MAO DE OBRA LTDA", empenhado: 136718584.64, liquidado: 136342642.27, empenhos: 33 },
      { doc: "28195667000106", nome: "BANCO ABC BRASIL S.A.", empenhado: 137819239.56, liquidado: 135929365.89, empenhos: 6 },
      { doc: "PF99999150", nome: "FOLHA DE PRODUTIVIDADE - SUS", empenhado: 160540000, liquidado: 133678927.76, empenhos: 9 },
      { doc: "05545366000160", nome: "C P M CONSTRUTORA LTDA", empenhado: 241896205.74, liquidado: 132698547.88, empenhos: 218 },
      { doc: "13343833000105", nome: "ALFORGE SEGURANCA PATRIMONIAL LTDA", empenhado: 160706187.99, liquidado: 130163942.04, empenhos: 357 },
      { doc: "11788943000147", nome: "UNIKA TERCEIRIZACAO E SERVICOS LTDA", empenhado: 163644095.42, liquidado: 129934332.57, empenhos: 226 },
      { doc: "09039744000275", nome: "FUNDACAO GESTAO HOSPITALAR MARTINIANO FERNANDES - FGH", empenhado: 125921265.9, liquidado: 123489997.2, empenhos: 11 },
      { doc: "09039744000860", nome: "FUNDACAO GESTAO HOSPITALAR MARTINIANO FERNANDES - FGH", empenhado: 126741774.38, liquidado: 122710544.24, empenhos: 7 },
      { doc: "11187085000185", nome: "COOPERATIVA DOS MEDICOS ANESTESIOLOGISTAS DE PERNAMBUCO COOPANEST PE", empenhado: 125784000.68, liquidado: 114529242.46, empenhos: 124 },
      { doc: "PF00000043", nome: "DEPOSITOS JUDICIAIS - EC 99/2017 INC II", empenhado: 115000000, liquidado: 114000000, empenhos: 1 },
      { doc: "09039744002723", nome: "FUNDACAO GESTAO HOSPITALAR MARTINIANO FERNANDES - FGH", empenhado: 122344432.09, liquidado: 111938556.04, empenhos: 8 },
      { doc: "27284516000161", nome: "MAXIFROTA SERVICOS DE MANUTENCAO DE FROTA LTDA", empenhado: 112955836.19, liquidado: 108901561.11, empenhos: 411 },
      { doc: "27595780000116", nome: "CS BRASIL FROTAS S.A.", empenhado: 116838385.22, liquidado: 107642493.22, empenhos: 546 },
      { doc: "11295284000107", nome: "INDUSTRIA E COMERCIO MOVEIS KUTZ LTDA", empenhado: 147507648.85, liquidado: 107203955.91, empenhos: 61 },
      { doc: "18938887000129", nome: "MOBIBRASIL PERNAMBUCO LTDA", empenhado: 111784504.82, liquidado: 107084346.21, empenhos: 13 },
      { doc: "10739225002323", nome: "INSTITUTO SOCIAL DAS MEDIANEIRAS DA PAZ", empenhado: 112404889.9, liquidado: 105795367.77, empenhos: 14 },
      { doc: "09769035000164", nome: "COMPANHIA PERNAMBUCANA DE SANEAMENTO - COMPESA", empenhado: 120052625.08, liquidado: 104865470.97, empenhos: 303 },
      { doc: "09445502000109", nome: "SOLUCOES SERVICOS TERCEIRIZADOS LTDA.", empenhado: 133257887.02, liquidado: 104225972.19, empenhos: 234 },
      { doc: "03006548000137", nome: "COSAMPA CONSTRUCOES LTDA", empenhado: 155737996.11, liquidado: 103377829.87, empenhos: 36 },
      { doc: "10583920001105", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 107202201.58, liquidado: 97327104.57, empenhos: 11 },
      { doc: "13258693000169", nome: "JSP SERVICOS E TERCEIRIZACAO DE MAO DE OBRA LTDA", empenhado: 119465871.62, liquidado: 97024879.09, empenhos: 147 },
      { doc: "00779059000120", nome: "CONSTRUTORA LUIZ COSTA LTDA", empenhado: 139022905.85, liquidado: 91251206.69, empenhos: 26 },
      { doc: "10583920000990", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 92312019.73, liquidado: 90683451.5, empenhos: 17 },
      { doc: "01514128000136", nome: "SCAVE SERVICOS DE ENGENHARIA E LOCACAO LTDA", empenhado: 132358071.47, liquidado: 89076035.37, empenhos: 61 },
      { doc: "22532706000137", nome: "A V M L CONSTRUCOES E LOCACOES LTDA", empenhado: 98349998.4, liquidado: 86807346.23, empenhos: 151 },
      { doc: "PF00000011", nome: "CONTRATACAO NA AREA DE SAUDE", empenhado: 87047645.02, liquidado: 86780162.8, empenhos: 270 },
      { doc: "32227070000173", nome: "CETUS CONSTRUTORA LTDA", empenhado: 87887995.55, liquidado: 86608321.92, empenhos: 79 },
      { doc: "09767633000447", nome: "FUNDACAO MANOEL DA SILVA ALMEIDA", empenhado: 84540364.2, liquidado: 81968504.64, empenhos: 15 },
      { doc: "05914425000120", nome: "NOCARVEL - NOSSA SENHORA DO CARMO VEICULOS LTDA", empenhado: 93590221.47, liquidado: 81884521.47, empenhos: 17 },
      { doc: "11457039000159", nome: "GESTAO DE TERCEIRIZACAO EM SERVICOS SELECAO E AGENCIAMENTO DE MAO-DE-OBRA LTDA", empenhado: 101997133.21, liquidado: 81365712.99, empenhos: 241 },
      { doc: "PF00000141", nome: "BOLSA DE ESTUDO - FACEPE", empenhado: 100689241.33, liquidado: 80066160, empenhos: 92 },
      { doc: "11683042000190", nome: "UNIAO BENEFICENTE DOS TRABALHADORES DO MORENO", empenhado: 92609772.22, liquidado: 79066448.54, empenhos: 85 },
      { doc: "08059768000142", nome: "CINZEL ENGENHARIA LTDA - EM RECUPERACAO JUDICIAL", empenhado: 91432766.3, liquidado: 78377934.99, empenhos: 25 },
      { doc: "440715", nome: "FUNDACAO UNIVERSIDADE DE PERNAMBUCO", empenhado: 85352532.86, liquidado: 77832069.73, empenhos: 46 },
      { doc: "14056350000184", nome: "SOLSERV SERVICOS LTDA", empenhado: 90604703.6, liquidado: 75868398.91, empenhos: 253 },
      { doc: "440714", nome: "FUNDACAO UNIVERSIDADE DE PERNAMBUCO", empenhado: 94069655.64, liquidado: 74791707.93, empenhos: 16 },
      { doc: "10667814000138", nome: "FUNDACAO ALTINO VENTURA", empenhado: 80065905.9, liquidado: 73461158.27, empenhos: 35 },
      { doc: "10583920000133", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 77883586.16, liquidado: 70448061.18, empenhos: 40 },
      { doc: "58578648000120", nome: "CONSORCIO CRECHES PERNAMBUCO/2024", empenhado: 85213918.08, liquidado: 70357362.63, empenhos: 47 },
      { doc: "00338885000133", nome: "NOVATEC CONSTRUCOES E EMPREENDIMENTOS LTDA", empenhado: 98484523.2, liquidado: 69834653.89, empenhos: 81 },
      { doc: "07408234000111", nome: "L. & R. SANTOS CONSTRUCOES LTDA", empenhado: 85208567.79, liquidado: 69235760.37, empenhos: 40 },
      { doc: "08958628000106", nome: "ONCOEXO DISTRIBUIDORA DE MEDICAMENTOS LTDA", empenhado: 76985348.07, liquidado: 68791721.91, empenhos: 326 },
      { doc: "10572071001003", nome: "SECRETARIA DE EDUCACAO", empenhado: 77525726.33, liquidado: 68559963.41, empenhos: 1371 },
      { doc: "21179250000100", nome: "SHALON SERVICOS DE CONSERVACAO LTDA", empenhado: 83803524.67, liquidado: 68433887.32, empenhos: 185 },
      { doc: "15126437001620", nome: "EMPRESA BRASILEIRA DE SERVICOS HOSPITALARES - EBSERH", empenhado: 83622499.87, liquidado: 67110747.23, empenhos: 8 },
      { doc: "10572071000627", nome: "SECRETARIA DE EDUCACAO", empenhado: 77484448.96, liquidado: 67072785.22, empenhos: 1022 },
      { doc: "60746948000112", nome: "BANCO BRADESCO S.A.", empenhado: 95074761.82, liquidado: 66979219.49, empenhos: 18 },
      { doc: "03651527000174", nome: "MEGA SERVICE CONSTRUTORA E TERCEIRIZACAO DE SERVICOS LTDA", empenhado: 81945709.57, liquidado: 66668097.35, empenhos: 84 },
      { doc: "10894988001105", nome: "SOCIEDADE PERNAMBUCANA DE COMBATE AO CANCER", empenhado: 65531721.65, liquidado: 64986784.74, empenhos: 8 },
      { doc: "10583920000567", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 66548925.45, liquidado: 64740504.53, empenhos: 12 },
      { doc: "PF00000038", nome: "DEPOSITOS JUDICIAIS - LEI COMPLEMENTAR 151/2015", empenhado: 65000001, liquidado: 64000000, empenhos: 2 },
      { doc: "10739225001866", nome: "INSTITUTO SOCIAL DAS MEDIANEIRAS DA PAZ", empenhado: 61660471.18, liquidado: 61136173.69, empenhos: 13 },
      { doc: "10583920000486", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 62784536.61, liquidado: 60875863.66, empenhos: 12 },
      { doc: "20501854000169", nome: "ALCANCE ENGENHARIA E CONSTRUCAO LTDA", empenhado: 82302690.65, liquidado: 60870076.49, empenhos: 39 },
      { doc: "04307650002260", nome: "ONCO PROD DISTRIBUIDORA DE PRODUTOS HOSPITALARES E ONCOLOGICOS LTDA.", empenhado: 66621540.57, liquidado: 60570379.99, empenhos: 56 },
      { doc: "09767633000102", nome: "FUNDACAO MANOEL DA SILVA ALMEIDA", empenhado: 74558965.9, liquidado: 60151098.81, empenhos: 113 },
      { doc: "02633573000188", nome: "AJ SERVICOS DE MAO DE OBRA LTDA", empenhado: 64723307.38, liquidado: 56963683.94, empenhos: 100 },
      { doc: "56322696001360", nome: "ASSOCIACAO BENEFICENTE CISNE", empenhado: 56917349.25, liquidado: 56521207.13, empenhos: 3 },
      { doc: "62016034000121", nome: "CONSORCIO CONSTRUTOR ARCO VIARIO METROPOLITANO", empenhado: 81148799.3, liquidado: 56128847.19, empenhos: 2 },
      { doc: "08100434000175", nome: "NUNES & CAVALCANTI CONSTRUCOES LTDA", empenhado: 85360728.18, liquidado: 54719607.55, empenhos: 179 },
      { doc: "11516861000143", nome: "AGUIA SERVICOS DE VIGILANCIA LTDA - EM RECUPERACAO JUDICIAL", empenhado: 68078863.32, liquidado: 54541202.05, empenhos: 83 },
      { doc: "44467456000131", nome: "NOVA MOBI PERNAMBUCO - SPE S.A.", empenhado: 52933420.14, liquidado: 52928855.98, empenhos: 5 },
      { doc: "02820747000111", nome: "SOCIEDADE COOPERATIVA COOPVITA - COOPERATIVA DE TRABALHO", empenhado: 63281776.99, liquidado: 52203200.76, empenhos: 10 },
      { doc: "62162335000163", nome: "FUNDO DE EQUALIZACAO FEDERATIVA - FEF", empenhado: 51317288.46, liquidado: 51317288.46, empenhos: 1 },
      { doc: "10023653000140", nome: "INOFIL -  ADMINISTRACAO E PARTICIPACAO LTDA", empenhado: 50000000, liquidado: 50000000, empenhos: 2 },
      { doc: "10583920001024", nome: "HOSPITAL DO TRICENTENARIO", empenhado: 54551781.36, liquidado: 49935025.96, empenhos: 14 },
      { doc: "40882060000108", nome: "LIDERMAC CONSTRUCOES E EQUIPAMENTOS LTDA", empenhado: 70258241.56, liquidado: 49076892.2, empenhos: 40 },
      { doc: "40869463000109", nome: "ESSE ENGENHARIA SINALIZACAO E SERVICOS ESPECIAIS LTDA", empenhado: 72790935.78, liquidado: 48915566.98, empenhos: 38 },
      { doc: "00079526000109", nome: "BWS CONSTRUCOES LTDA", empenhado: 53943260.7, liquidado: 48309122.07, empenhos: 54 },
      { doc: "08642026000145", nome: "O K EMPREENDIMENTOS CONSTRUCOES E SERVICOS LTDA", empenhado: 62707438.81, liquidado: 47935420.43, empenhos: 125 },
      { doc: "00758756000102", nome: "CONSTRUTORA ANCAR LTDA", empenhado: 56706034.12, liquidado: 47775474.08, empenhos: 54 },
      { doc: "03595778000189", nome: "HOSPITAL DE ASSISTENCIA DOMICILIAR LTDA ( EM RECUPERACAO JUDICIAL )", empenhado: 47593058.04, liquidado: 47306473, empenhos: 54 },
      { doc: "33657248000189", nome: "BANCO NACIONAL DE DESENVOLVIMENTO ECONOMICO E SOCIAL", empenhado: 57000000, liquidado: 47141582.73, empenhos: 2 },
      { doc: "02760686000144", nome: "POTENZA CONSTRUCOES LTDA", empenhado: 56677666.24, liquidado: 44616980.74, empenhos: 60 },
      { doc: "23742620000100", nome: "INSTTALE ENGENHARIA LTDA", empenhado: 72611539.07, liquidado: 44060807.07, empenhos: 23 },
      { doc: "01062929000108", nome: "ANDELIVROS-ASSOCIACAO DO NORDESTE DE DISTRIBUIDORAS E EDITORAS DE LIVROS", empenhado: 43648335.25, liquidado: 43648335.25, empenhos: 28 },
      { doc: "12077949000179", nome: "ARENA PERNAMBUCO NEGOCIOS E INVESTIMENTOS S.A.", empenhado: 46225036.79, liquidado: 43575381.55, empenhos: 1 },
      { doc: "10572071000970", nome: "SECRETARIA DE EDUCACAO", empenhado: 46471725.67, liquidado: 43398838.45, empenhos: 733 },
      { doc: "09767633000366", nome: "FUNDACAO MANOEL DA SILVA ALMEIDA", empenhado: 45183260.89, liquidado: 42934239.72, empenhos: 13 },
      { doc: "37995880000193", nome: "JWA SA", empenhado: 43066017.03, liquidado: 42311226.61, empenhos: 18 },
      { doc: "12644934000145", nome: "PRISMA EMPREENDIMENTOS LTDA", empenhado: 43789427.58, liquidado: 42277268.06, empenhos: 122 },
      { doc: "18627195000160", nome: "MASTER INDUSTRIA E COMERCIO LTDA", empenhado: 77512794.62, liquidado: 42078097.19, empenhos: 34 },
      { doc: "00401969000174", nome: "QUALITY EMPREENDIMENTOS LTDA", empenhado: 47094592.5, liquidado: 41692871.86, empenhos: 9 },
      { doc: "09192486000181", nome: "HOSPITAL SANTA TERESINHA LTDA", empenhado: 42230975.94, liquidado: 41678288.21, empenhos: 24 },
      { doc: "12576110000185", nome: "ONE OPERADORA DE VIAGENS E INTERCAMBIOS LTDA", empenhado: 92307318.8, liquidado: 41639308.66, empenhos: 10 },
      { doc: "02724778000179", nome: "UNITERRA - UNIAO TERRAPLENAGEM E CONSTRUCOES LTDA", empenhado: 54292938.46, liquidado: 41463269.17, empenhos: 34 },
      { doc: "08593703000344", nome: "PAS - PROJETO, ASSESSORIA E SISTEMA LTDA", empenhado: 47815938.71, liquidado: 41316367.91, empenhos: 9 },
      { doc: "62299901000183", nome: "CONSORCIO MATERNIDADE GARANHUNS.", empenhado: 53271267.72, liquidado: 40429084.32, empenhos: 10 },
      { doc: "53954501000173", nome: "CONSORCIO MUDANDO SEMPRE PERNAMBUCO", empenhado: 52791848.08, liquidado: 40381868.89, empenhos: 20 },
      { doc: "40829988000110", nome: "CAMARA AMBIENTAL LTDA EPP", empenhado: 40702464.27, liquidado: 40024623.02, empenhos: 108 }
    ]
  };

  /* --- Ranking e comparador ----------------------------------
     ESCOPO escolhe o que o ranking e o comparador mostram.
     "municipios" usa dado REAL (transferência estadual por
     município). "orgaos" segue ilustrativo — o portal não
     publica despesa por órgão num painel consultável desta
     forma, então aquele conjunto é exemplo, e está marcado.
     Trocar a palavra abaixo troca tudo.
  ------------------------------------------------------------ */
  var ESCOPO = "municipios";

  var conjuntos = {
    municipios: {
      origem: "oficial",
      rotulo: "município",
      titulo: "Transferência do Estado por município",
      medida: "recebido do Estado",
      nota: "O painel do Estado traz só o IPVA: as colunas de ICMS e IPI estão zeradas em todos os anos. É o que está publicado, não o repasse total.",
      itens: municipios.itens.map(function (m) {
        return { nome: m.n, valor: m.t, pop: m.p, regiao: regioes[m.r] };
      })
    },
    orgaos: {
      origem: "oficial",
      rotulo: "órgão",
      titulo: "Órgãos que mais executam despesa",
      medida: "liquidado",
      nota: "Despesa liquidada de 2026. A soma dos 71 órgãos fecha com o total do painel oficial.",
      itens: [
        { nome: "SECRETARIA DE SAÚDE", valor: 9003009639, empenhado: 10214254550, cod: "23000" },
        { nome: "SECRETARIA DE EDUCAÇÃO", valor: 7626289863, empenhado: 9546267214, cod: "14000" },
        { nome: "FUNDO FINANCEIRO DE APOSENTADORIAS E PENSÕES DOS SERVIDORES DO ESTADO DE PERNAMBUCO - FUNAFIN", valor: 5970720760, empenhado: 7624708276, cod: "210" },
        { nome: "ENCARGOS GERAIS DO ESTADO", valor: 4317157766, empenhado: 4687705130, cod: "29000" },
        { nome: "SECRETARIA DE DEFESA SOCIAL", valor: 3920038765, empenhado: 4219912672, cod: "39000" },
        { nome: "TRIBUNAL DE JUSTIÇA DE PERNAMBUCO", valor: 2424896533, empenhado: 2731395366, cod: "7000" },
        { nome: "FUNDO DE PROTEÇÃO SOCIAL DOS MILITARES DE PERNAMBUCO - FPSM - PE", valor: 2300612284, empenhado: 2818483132, cod: "224" },
        { nome: "COMPANHIA ESTADUAL DE HABITAÇÃO E OBRAS - CEHAB", valor: 1345004274, empenhado: 1824973453, cod: "609" },
        { nome: "DEPARTAMENTO DE ESTRADAS DE RODAGEM DO ESTADO DE PERNAMBUCO - DER-PE", valor: 1094515264, empenhado: 1668199950, cod: "306" },
        { nome: "INSTITUTO DE ATENCAO A SAUDE E BEM-ESTAR DOS SERVIDORES DO ESTADO DE PERNAMBUCO - IASSEPE", valor: 942491024, empenhado: 1047328407, cod: "303" },
        { nome: "ASSEMBLÉIA LEGISLATIVA DO ESTADO DE PERNAMBUCO", valor: 903173086, empenhado: 999417704, cod: "1000" },
        { nome: "UNIVERSIDADE DE PERNAMBUCO - UPE", valor: 889175592, empenhado: 1015016648, cod: "406" },
        { nome: "MINISTÉRIO PÚBLICO DE PERNAMBUCO", valor: 853865327, empenhado: 1019309834, cod: "32000" },
        { nome: "SECRETARIA DA FAZENDA", valor: 661337972, empenhado: 791358000, cod: "15000" },
        { nome: "CONSÓRCIO DE TRANSPORTES DA REGIÃO METROPOLITANA DO RECIFE - CTM", valor: 645418285, empenhado: 749628213, cod: "505" },
        { nome: "TRIBUNAL DE CONTAS DO ESTADO DE PERNAMBUCO", valor: 618527638, empenhado: 761160077, cod: "2000" },
        { nome: "SECRETARIA DE ADMINISTRAÇÃO PENITENCIARIA E RESSOCIALIZAÇÃO", valor: 540313930, empenhado: 683516798, cod: "57000" },
        { nome: "FUNDO ESTADUAL DE ASSISTENCIA  SOCIAL - FEAS", valor: 512784240, empenhado: 561149279, cod: "203" },
        { nome: "SECRETARIA DE DESENVOLVIMENTO URBANO E HABITAÇÃO", valor: 424821490, empenhado: 469404930, cod: "38000" },
        { nome: "DEPARTAMENTO ESTADUAL DE TRÂNSITO - DETRAN-PE", valor: 411143637, empenhado: 539812749, cod: "311" },
        { nome: "PROCURADORIA GERAL DO ESTADO", valor: 327954731, empenhado: 385142171, cod: "37000" },
        { nome: "INSTITUTO AGRONÔMICO DE PERNAMBUCO - IPA", valor: 256639524, empenhado: 309143399, cod: "501" },
        { nome: "DEFENSORIA PÚBLICA DO ESTADO DE PERNAMBUCO", valor: 241526632, empenhado: 291051452, cod: "25000" },
        { nome: "SECRETARIA DE ADMINISTRAÇÃO", valor: 236231861, empenhado: 295031876, cod: "12000" },
        { nome: "EMPRESA DE TURISMO DE PERNAMBUCO S/A - EMPETUR", valor: 208563359, empenhado: 233645875, cod: "603" },
        { nome: "FUNDAÇÃO DO PATRIMÔNIO HISTÓRICO E ARTÍSTICO DE PERNAMBUCO - FUNDARPE", valor: 193594757, empenhado: 226907058, cod: "403" },
        { nome: "SECRETARIA DE PLANEJAMENTO, GESTÃO E DESENVOLVIMENTO REGIONAL", valor: 144598620, empenhado: 208999618, cod: "30000" },
        { nome: "SECRETARIA DE CULTURA", valor: 136387058, empenhado: 144972470, cod: "20000" },
        { nome: "SECRETARIA DE RECURSOS HÍDRICOS E SANEAMENTO", valor: 130126466, empenhado: 189136693, cod: "24000" },
        { nome: "FUNDAÇÃO DE HEMATOLOGIA E HEMOTERAPIA DE PERNAMBUCO - HEMOPE", valor: 129208349, empenhado: 161221302, cod: "404" },
        { nome: "AGÊNCIA ESTADUAL DE TECNOLOGIA DA INFORMAÇÃO - ATI", valor: 127360582, empenhado: 169164049, cod: "304" },
        { nome: "DISTRITO ESTADUAL DE FERNANDO DE NORONHA", valor: 124736295, empenhado: 139915224, cod: "309" },
        { nome: "FUNDAÇÃO DE AMPARO À CIÊNCIA E TECNOLOGIA - FACEPE", valor: 121380413, empenhado: 160601011, cod: "405" },
        { nome: "FUNDAÇÃO DE ATENDIMENTO SÓCIOEDUCATIVO - FUNASE", valor: 116517066, empenhado: 139875267, cod: "402" },
        { nome: "SECRETARIA DE DESENVOLVIMENTO AGRÁRIO, AGRICULTURA, PECUÁRIA E PESCA", valor: 96855157, empenhado: 144352705, cod: "22000" },
        { nome: "PERNAMBUCO PARTICIPAÇÕES E INVESTIMENTOS S/A - PERPART", valor: 88658916, empenhado: 116633913, cod: "601" },
        { nome: "SECRETARIA DE CIÊNCIA, TECNOLOGIA E INOVAÇÃO", valor: 75017370, empenhado: 108017440, cod: "31000" },
        { nome: "SECRETARIA DE ASSISTÊNCIA SOCIAL, COMBATE À FOME E POLÍTICAS SOBRE DROGAS", valor: 74894650, empenhado: 84152993, cod: "13000" },
        { nome: "SECRETARIA DE COMUNICAÇÃO", valor: 74568008, empenhado: 84164597, cod: "16000" },
        { nome: "AGÊNCIA ESTADUAL DE MEIO AMBIENTE - CPRH", valor: 69172792, empenhado: 85383319, cod: "310" },
        { nome: "SECRETARIA DE JUSTIÇA, DIREITOS HUMANOS E PREVENÇÃO À VIOLÊNCIA", valor: 66649510, empenhado: 78036328, cod: "19000" },
        { nome: "SECRETARIA  DA CONTROLADORIA GERAL DO ESTADO", valor: 61458715, empenhado: 80374330, cod: "46000" },
        { nome: "SECRETARIA DE MOBILIDADE E INFRAESTRUTURA", valor: 57736479, empenhado: 74687746, cod: "52000" },
        { nome: "SECRETARIA DE PROJETOS ESTRATÉGICOS", valor: 57162036, empenhado: 73630685, cod: "51000" },
        { nome: "SECRETARIA DE TURISMO E LAZER", valor: 55277843, empenhado: 60193029, cod: "21000" },
        { nome: "SECRETARIA  DA MULHER", valor: 51300527, empenhado: 61625074, cod: "44000" },
        { nome: "SECRETARIA DE MEIO AMBIENTE, SUSTENTABILIDADE E FERNANDO DE NORONHA", valor: 49942272, empenhado: 57349046, cod: "36000" },
        { nome: "AGÊNCIA DE DEFESA E FISCALIZAÇÃO AGROPECUÁRIA DO ESTADO DE PERNAMBUCO - ADAGRO", valor: 49607814, empenhado: 53964262, cod: "314" },
        { nome: "SECRETARIA DA CASA CIVIL", valor: 40366336, empenhado: 52709769, cod: "17000" },
        { nome: "SECRETARIA DE DESENVOLVIMENTO ECONÔMICO", valor: 39603451, empenhado: 42042910, cod: "26000" },
        { nome: "GOVERNADORIA DO ESTADO", valor: 32223112, empenhado: 40610947, cod: "11000" },
        { nome: "SECRETARIA DE ESPORTES", valor: 28461349, empenhado: 33767801, cod: "28000" },
        { nome: "SECRETARIA DE DESENVOLVIMENTO PROFISSIONAL E EMPREENDEDORISMO", valor: 25002169, empenhado: 30066095, cod: "43000" },
        { nome: "JUNTA COMERCIAL DO ESTADO DE PERNAMBUCO - JUCEPE", valor: 23785853, empenhado: 34927411, cod: "307" },
        { nome: "AGENCIA PERNAMBUCANA DE AGUAS E CLIMA - APAC", valor: 20773747, empenhado: 29246007, cod: "313" },
        { nome: "FUNDAÇÃO DE APOSENTADORIAS E PENSÕES DOS SERVIDORES DO ESTADO DE PERNAMBUCO - FUNAPE", valor: 18698678, empenhado: 25174198, cod: "401" },
        { nome: "INSTITUTO DE PESOS E MEDIDAS DO ESTADO DE PERNAMBUCO - IPEM-PE", valor: 17508304, empenhado: 19553908, cod: "305" },
        { nome: "AGÊNCIA DE REGULAÇÃO DOS SERVIÇOS PÚBLICOS DELEGADOS DO ESTADO DE PERNAMBUCO - ARPE", valor: 16524500, empenhado: 23561372, cod: "302" },
        { nome: "INSTITUTO DE TERRAS E REFORMA AGRARIA DO ESTADO DE PERNAMBUCO - ITERPE", valor: 14141530, empenhado: 15666517, cod: "312" },
        { nome: "SECRETARIA DA CRIANÇA E DA JUVENTUDE", valor: 11322165, empenhado: 16457255, cod: "40000" },
        { nome: "EMPRESA PERNAMBUCO DE COMUNICAÇÃO S.A. - EPC", valor: 9140822, empenhado: 11228407, cod: "506" },
        { nome: "FUNDO ESTADUAL DE HABITAÇÃO DE INTERESSE SOCIAL - FEHIS", valor: 7824987, empenhado: 7825838, cod: "215" },
        { nome: "AGÊNCIA ESTADUAL DE PLANEJAMENTO E PESQUISAS DE PERNAMBUCO - CONDEPE/FIDEM", valor: 6916524, empenhado: 8436194, cod: "308" },
        { nome: "EMPRESA PERNAMBUCANA DE TRANSPORTE COLETIVO INTERMUNICIPAL - EPTI", valor: 4946263, empenhado: 6368306, cod: "504" },
        { nome: "ESCOLA DE CONTAS PÚBLICAS PROFESSOR BARRETO GUIMARÃES", valor: 3699793, empenhado: 4610870, cod: "301" },
        { nome: "SECRETARIA DA ASSESSORIA ESPECIAL À GOVERNADORA E RELAÇÕES INTERNACIONAIS", valor: 3521921, empenhado: 5438121, cod: "56000" },
        { nome: "FUNDO ESTADUAL DOS DIREITOS DO IDOSO DE PERNAMBUCO - FEDIPE", valor: 3511220, empenhado: 11609509, cod: "217" },
        { nome: "FUNDO ESTADUAL DE RECURSOS HIDRICOS - FEHIDRO", valor: 1305191, empenhado: 4811242, cod: "209" },
        { nome: "FUNDO PARA FOMENTO A PROGRAMAS ESPECIAIS DE PERNAMBUCO - FUPES-PE", valor: 1217305, empenhado: 1576500, cod: "218" },
        { nome: "FUNDO DE APOSENTADORIAS E PENSÕES DOS SERV. DO ESTADO DE PERNAMBUCO - FUNAPREV", valor: 960198, empenhado: 3396000, cod: "223" },
        { nome: "FUNDO ESTADUAL DE DEFESA DOS DIREITOS DA CRIANÇA E DO ADOLESCENTE", valor: 567465, empenhado: 1548361, cod: "201" }
      ]
    }
  };

  var ranking = conjuntos[ESCOPO];

  /* --- população, para o valor por habitante -----------------
     Censo 2022, somado dos 185 municípios. Uso a mesma base do
     dado municipal para que o "por habitante" do Estado e o do
     município saiam da mesma régua.
  ------------------------------------------------------------ */
  var populacao = {
    origem: "oficial",
    valor: 9058931,
    fonte: FONTE_IBGE
  };

  /* --- formatação --------------------------------------------- */

  function moeda(v) {
    if (v < 0) return "−" + moeda(-v);
    if (v >= 1e9) return "R$ " + (v / 1e9).toFixed(2).replace(".", ",") + " bi";
    if (v >= 1e6) return "R$ " + (v / 1e6).toFixed(1).replace(".", ",") + " mi";
    if (v >= 1e3) return "R$ " + (v / 1e3).toFixed(1).replace(".", ",") + " mil";
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function pct(v) {
    return v.toFixed(2).replace(".", ",") + "%";
  }

  function inteiro(v) {
    return v.toLocaleString("pt-BR");
  }

  // quanto aquele montante representa por habitante. a precisão
  // acompanha a ordem de grandeza: arredondar para inteiro serve
  // para os bilhões do Estado, mas transformaria "R$ 1,58" e
  // "R$ 1,56" no mesmo "R$ 2" na comparação entre municípios.
  function porHabitante(v, pop) {
    var r = v / (pop || populacao.valor);
    var casas = Math.abs(r) < 10 ? 2 : (Math.abs(r) < 100 ? 1 : 0);
    return "R$ " + r.toLocaleString("pt-BR", {
      minimumFractionDigits: casas, maximumFractionDigits: casas
    });
  }

  // acha um município por nome, ignorando acento e caixa
  function acharMunicipio(texto) {
    var t = String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    if (!t) return null;
    var achado = null;
    municipios.itens.forEach(function (m) {
      var n = m.n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (n === t) achado = m;
    });
    if (achado) return achado;
    municipios.itens.forEach(function (m) {
      if (achado) return;
      var n = m.n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (n.indexOf(t) === 0 && t.length >= 3) achado = m;
    });
    return achado;
  }

  function municipiosDaRegiao(nome) {
    var i = regioes.indexOf(nome);
    if (i === -1) return [];
    return municipios.itens.filter(function (m) { return m.r === i; });
  }

  return {
    execucao: execucao,
    receita: receita,
    serie: serie,
    areas: areas,
    funcoes: funcoes,
    credores: credores,
    municipios: municipios,
    regioes: regioes,
    ranking: ranking,
    conjuntos: conjuntos,
    escopo: ESCOPO,
    populacao: populacao,
    porHabitante: porHabitante,
    acharMunicipio: acharMunicipio,
    municipiosDaRegiao: municipiosDaRegiao,
    moeda: moeda,
    pct: pct,
    inteiro: inteiro
  };
})();
