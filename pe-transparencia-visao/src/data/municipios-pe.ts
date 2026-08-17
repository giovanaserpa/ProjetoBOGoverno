/**
 * Base de municípios de Pernambuco (184 municípios + o distrito estadual de
 * Fernando de Noronha).
 *
 * Estrutura pronta para virar uma tabela no Lovable Cloud:
 *   municipios(id text pk, nome text, populacao int, seed int)
 */
export type MunicipioBase = {
  id: string;
  nome: string;
  populacao: number;
  /** semente determinística usada apenas pelo mock de indicadores */
  seed: number;
};

export const MUNICIPIOS_PE: MunicipioBase[] = [
  {
    "id": "abreu-e-lima",
    "nome": "Abreu e Lima",
    "populacao": 100346,
    "seed": 854
  },
  {
    "id": "afogados-da-ingazeira",
    "nome": "Afogados da Ingazeira",
    "populacao": 12724,
    "seed": 156
  },
  {
    "id": "afranio",
    "nome": "Afrânio",
    "populacao": 42143,
    "seed": 856
  },
  {
    "id": "agrestina",
    "nome": "Agrestina",
    "populacao": 10705,
    "seed": 731
  },
  {
    "id": "alagoinha",
    "nome": "Alagoinha",
    "populacao": 38920,
    "seed": 161
  },
  {
    "id": "alianca",
    "nome": "Aliança",
    "populacao": 39983,
    "seed": 408
  },
  {
    "id": "altinho",
    "nome": "Altinho",
    "populacao": 45439,
    "seed": 856
  },
  {
    "id": "amaraji",
    "nome": "Amaraji",
    "populacao": 47353,
    "seed": 779
  },
  {
    "id": "angelim",
    "nome": "Angelim",
    "populacao": 29273,
    "seed": 150
  },
  {
    "id": "araripina",
    "nome": "Araripina",
    "populacao": 84470,
    "seed": 439
  },
  {
    "id": "aracoiaba",
    "nome": "Araçoiaba",
    "populacao": 41319,
    "seed": 607
  },
  {
    "id": "arcoverde",
    "nome": "Arcoverde",
    "populacao": 74691,
    "seed": 694
  },
  {
    "id": "barra-de-guabiraba",
    "nome": "Barra de Guabiraba",
    "populacao": 32192,
    "seed": 898
  },
  {
    "id": "barreiros",
    "nome": "Barreiros",
    "populacao": 42298,
    "seed": 178
  },
  {
    "id": "belo-jardim",
    "nome": "Belo Jardim",
    "populacao": 75746,
    "seed": 504
  },
  {
    "id": "belem-de-maria",
    "nome": "Belém de Maria",
    "populacao": 11620,
    "seed": 404
  },
  {
    "id": "belem-do-sao-francisco",
    "nome": "Belém do São Francisco",
    "populacao": 17374,
    "seed": 546
  },
  {
    "id": "betania",
    "nome": "Betânia",
    "populacao": 10605,
    "seed": 227
  },
  {
    "id": "bezerros",
    "nome": "Bezerros",
    "populacao": 62009,
    "seed": 763
  },
  {
    "id": "bodoco",
    "nome": "Bodocó",
    "populacao": 40912,
    "seed": 393
  },
  {
    "id": "bom-conselho",
    "nome": "Bom Conselho",
    "populacao": 47184,
    "seed": 105
  },
  {
    "id": "bom-jardim",
    "nome": "Bom Jardim",
    "populacao": 40753,
    "seed": 888
  },
  {
    "id": "bonito",
    "nome": "Bonito",
    "populacao": 44613,
    "seed": 558
  },
  {
    "id": "brejinho",
    "nome": "Brejinho",
    "populacao": 38052,
    "seed": 426
  },
  {
    "id": "brejo-da-madre-de-deus",
    "nome": "Brejo da Madre de Deus",
    "populacao": 36979,
    "seed": 362
  },
  {
    "id": "brejao",
    "nome": "Brejão",
    "populacao": 37712,
    "seed": 451
  },
  {
    "id": "buenos-aires",
    "nome": "Buenos Aires",
    "populacao": 15318,
    "seed": 245
  },
  {
    "id": "buique",
    "nome": "Buíque",
    "populacao": 58269,
    "seed": 245
  },
  {
    "id": "cabo-de-santo-agostinho",
    "nome": "Cabo de Santo Agostinho",
    "populacao": 208944,
    "seed": 26
  },
  {
    "id": "cabrobo",
    "nome": "Cabrobó",
    "populacao": 41660,
    "seed": 994
  },
  {
    "id": "cachoeirinha",
    "nome": "Cachoeirinha",
    "populacao": 13153,
    "seed": 960
  },
  {
    "id": "caetes",
    "nome": "Caetés",
    "populacao": 24171,
    "seed": 516
  },
  {
    "id": "calumbi",
    "nome": "Calumbi",
    "populacao": 17380,
    "seed": 273
  },
  {
    "id": "calcado",
    "nome": "Calçado",
    "populacao": 11061,
    "seed": 770
  },
  {
    "id": "camaragibe",
    "nome": "Camaragibe",
    "populacao": 144466,
    "seed": 235
  },
  {
    "id": "camocim-de-sao-felix",
    "nome": "Camocim de São Félix",
    "populacao": 15139,
    "seed": 338
  },
  {
    "id": "camutanga",
    "nome": "Camutanga",
    "populacao": 41762,
    "seed": 779
  },
  {
    "id": "canhotinho",
    "nome": "Canhotinho",
    "populacao": 14622,
    "seed": 977
  },
  {
    "id": "capoeiras",
    "nome": "Capoeiras",
    "populacao": 29128,
    "seed": 901
  },
  {
    "id": "carnaubeira-da-penha",
    "nome": "Carnaubeira da Penha",
    "populacao": 32436,
    "seed": 10
  },
  {
    "id": "carnaiba",
    "nome": "Carnaíba",
    "populacao": 38912,
    "seed": 426
  },
  {
    "id": "carpina",
    "nome": "Carpina",
    "populacao": 82348,
    "seed": 807
  },
  {
    "id": "caruaru",
    "nome": "Caruaru",
    "populacao": 373671,
    "seed": 48
  },
  {
    "id": "casinhas",
    "nome": "Casinhas",
    "populacao": 14147,
    "seed": 840
  },
  {
    "id": "catende",
    "nome": "Catende",
    "populacao": 40940,
    "seed": 450
  },
  {
    "id": "cedro",
    "nome": "Cedro",
    "populacao": 40130,
    "seed": 216
  },
  {
    "id": "cha-grande",
    "nome": "Chã Grande",
    "populacao": 8110,
    "seed": 279
  },
  {
    "id": "cha-de-alegria",
    "nome": "Chã de Alegria",
    "populacao": 27185,
    "seed": 600
  },
  {
    "id": "condado",
    "nome": "Condado",
    "populacao": 6559,
    "seed": 427
  },
  {
    "id": "correntes",
    "nome": "Correntes",
    "populacao": 40475,
    "seed": 698
  },
  {
    "id": "cortes",
    "nome": "Cortês",
    "populacao": 11264,
    "seed": 996
  },
  {
    "id": "cumaru",
    "nome": "Cumaru",
    "populacao": 8453,
    "seed": 994
  },
  {
    "id": "cupira",
    "nome": "Cupira",
    "populacao": 26107,
    "seed": 350
  },
  {
    "id": "custodia",
    "nome": "Custódia",
    "populacao": 10357,
    "seed": 659
  },
  {
    "id": "dormentes",
    "nome": "Dormentes",
    "populacao": 43000,
    "seed": 774
  },
  {
    "id": "escada",
    "nome": "Escada",
    "populacao": 66494,
    "seed": 273
  },
  {
    "id": "exu",
    "nome": "Exu",
    "populacao": 37256,
    "seed": 899
  },
  {
    "id": "feira-nova",
    "nome": "Feira Nova",
    "populacao": 12411,
    "seed": 307
  },
  {
    "id": "fernando-de-noronha",
    "nome": "Fernando de Noronha",
    "populacao": 3140,
    "seed": 603
  },
  {
    "id": "ferreiros",
    "nome": "Ferreiros",
    "populacao": 39304,
    "seed": 298
  },
  {
    "id": "flores",
    "nome": "Flores",
    "populacao": 40818,
    "seed": 813
  },
  {
    "id": "floresta",
    "nome": "Floresta",
    "populacao": 43842,
    "seed": 117
  },
  {
    "id": "frei-miguelinho",
    "nome": "Frei Miguelinho",
    "populacao": 32619,
    "seed": 697
  },
  {
    "id": "gameleira",
    "nome": "Gameleira",
    "populacao": 12679,
    "seed": 213
  },
  {
    "id": "garanhuns",
    "nome": "Garanhuns",
    "populacao": 139788,
    "seed": 653
  },
  {
    "id": "gloria-do-goita",
    "nome": "Glória do Goitá",
    "populacao": 19234,
    "seed": 541
  },
  {
    "id": "goiana",
    "nome": "Goiana",
    "populacao": 80426,
    "seed": 160
  },
  {
    "id": "granito",
    "nome": "Granito",
    "populacao": 8191,
    "seed": 965
  },
  {
    "id": "gravata",
    "nome": "Gravatá",
    "populacao": 83686,
    "seed": 634
  },
  {
    "id": "iati",
    "nome": "Iati",
    "populacao": 24459,
    "seed": 244
  },
  {
    "id": "ibimirim",
    "nome": "Ibimirim",
    "populacao": 27945,
    "seed": 160
  },
  {
    "id": "ibirajuba",
    "nome": "Ibirajuba",
    "populacao": 15279,
    "seed": 601
  },
  {
    "id": "igarassu",
    "nome": "Igarassu",
    "populacao": 117019,
    "seed": 597
  },
  {
    "id": "iguaracy",
    "nome": "Iguaracy",
    "populacao": 20166,
    "seed": 806
  },
  {
    "id": "ilha-de-itamaraca",
    "nome": "Ilha de Itamaracá",
    "populacao": 27742,
    "seed": 202
  },
  {
    "id": "inaja",
    "nome": "Inajá",
    "populacao": 14137,
    "seed": 844
  },
  {
    "id": "ingazeira",
    "nome": "Ingazeira",
    "populacao": 30019,
    "seed": 826
  },
  {
    "id": "ipojuca",
    "nome": "Ipojuca",
    "populacao": 95702,
    "seed": 241
  },
  {
    "id": "ipubi",
    "nome": "Ipubi",
    "populacao": 22818,
    "seed": 726
  },
  {
    "id": "itacuruba",
    "nome": "Itacuruba",
    "populacao": 35077,
    "seed": 80
  },
  {
    "id": "itambe",
    "nome": "Itambé",
    "populacao": 34910,
    "seed": 807
  },
  {
    "id": "itapetim",
    "nome": "Itapetim",
    "populacao": 7319,
    "seed": 592
  },
  {
    "id": "itapissuma",
    "nome": "Itapissuma",
    "populacao": 20837,
    "seed": 633
  },
  {
    "id": "itaquitinga",
    "nome": "Itaquitinga",
    "populacao": 17347,
    "seed": 579
  },
  {
    "id": "itaiba",
    "nome": "Itaíba",
    "populacao": 6298,
    "seed": 359
  },
  {
    "id": "jaboatao-dos-guararapes",
    "nome": "Jaboatão dos Guararapes",
    "populacao": 644620,
    "seed": 880
  },
  {
    "id": "jaqueira",
    "nome": "Jaqueira",
    "populacao": 12886,
    "seed": 42
  },
  {
    "id": "jatauba",
    "nome": "Jataúba",
    "populacao": 38853,
    "seed": 627
  },
  {
    "id": "jatoba",
    "nome": "Jatobá",
    "populacao": 46913,
    "seed": 85
  },
  {
    "id": "joaquim-nabuco",
    "nome": "Joaquim Nabuco",
    "populacao": 7048,
    "seed": 251
  },
  {
    "id": "joao-alfredo",
    "nome": "João Alfredo",
    "populacao": 36008,
    "seed": 282
  },
  {
    "id": "jucati",
    "nome": "Jucati",
    "populacao": 22316,
    "seed": 781
  },
  {
    "id": "jupi",
    "nome": "Jupi",
    "populacao": 44268,
    "seed": 706
  },
  {
    "id": "jurema",
    "nome": "Jurema",
    "populacao": 24126,
    "seed": 784
  },
  {
    "id": "lagoa-grande",
    "nome": "Lagoa Grande",
    "populacao": 40809,
    "seed": 655
  },
  {
    "id": "lagoa-do-carro",
    "nome": "Lagoa do Carro",
    "populacao": 45080,
    "seed": 23
  },
  {
    "id": "lagoa-do-itaenga",
    "nome": "Lagoa do Itaenga",
    "populacao": 17337,
    "seed": 280
  },
  {
    "id": "lagoa-do-ouro",
    "nome": "Lagoa do Ouro",
    "populacao": 12098,
    "seed": 464
  },
  {
    "id": "lagoa-dos-gatos",
    "nome": "Lagoa dos Gatos",
    "populacao": 41131,
    "seed": 587
  },
  {
    "id": "lajedo",
    "nome": "Lajedo",
    "populacao": 20631,
    "seed": 515
  },
  {
    "id": "limoeiro",
    "nome": "Limoeiro",
    "populacao": 56390,
    "seed": 138
  },
  {
    "id": "macaparana",
    "nome": "Macaparana",
    "populacao": 45828,
    "seed": 109
  },
  {
    "id": "machados",
    "nome": "Machados",
    "populacao": 6910,
    "seed": 320
  },
  {
    "id": "manari",
    "nome": "Manari",
    "populacao": 28362,
    "seed": 718
  },
  {
    "id": "maraial",
    "nome": "Maraial",
    "populacao": 20681,
    "seed": 639
  },
  {
    "id": "mirandiba",
    "nome": "Mirandiba",
    "populacao": 21394,
    "seed": 983
  },
  {
    "id": "moreilandia",
    "nome": "Moreilândia",
    "populacao": 16540,
    "seed": 260
  },
  {
    "id": "moreno",
    "nome": "Moreno",
    "populacao": 62888,
    "seed": 605
  },
  {
    "id": "nazare-da-mata",
    "nome": "Nazaré da Mata",
    "populacao": 35584,
    "seed": 167
  },
  {
    "id": "olinda",
    "nome": "Olinda",
    "populacao": 393115,
    "seed": 613
  },
  {
    "id": "orobo",
    "nome": "Orobó",
    "populacao": 28671,
    "seed": 407
  },
  {
    "id": "oroco",
    "nome": "Orocó",
    "populacao": 14501,
    "seed": 406
  },
  {
    "id": "ouricuri",
    "nome": "Ouricuri",
    "populacao": 69644,
    "seed": 545
  },
  {
    "id": "palmares",
    "nome": "Palmares",
    "populacao": 61432,
    "seed": 51
  },
  {
    "id": "palmeirina",
    "nome": "Palmeirina",
    "populacao": 39829,
    "seed": 723
  },
  {
    "id": "panelas",
    "nome": "Panelas",
    "populacao": 8931,
    "seed": 665
  },
  {
    "id": "paranatama",
    "nome": "Paranatama",
    "populacao": 34219,
    "seed": 276
  },
  {
    "id": "parnamirim",
    "nome": "Parnamirim",
    "populacao": 7173,
    "seed": 42
  },
  {
    "id": "passira",
    "nome": "Passira",
    "populacao": 13323,
    "seed": 932
  },
  {
    "id": "paudalho",
    "nome": "Paudalho",
    "populacao": 14500,
    "seed": 530
  },
  {
    "id": "paulista",
    "nome": "Paulista",
    "populacao": 331774,
    "seed": 557
  },
  {
    "id": "pedra",
    "nome": "Pedra",
    "populacao": 44449,
    "seed": 955
  },
  {
    "id": "pesqueira",
    "nome": "Pesqueira",
    "populacao": 65087,
    "seed": 961
  },
  {
    "id": "petrolina",
    "nome": "Petrolina",
    "populacao": 373683,
    "seed": 883
  },
  {
    "id": "petrolandia",
    "nome": "Petrolândia",
    "populacao": 46902,
    "seed": 985
  },
  {
    "id": "pombos",
    "nome": "Pombos",
    "populacao": 21409,
    "seed": 556
  },
  {
    "id": "pocao",
    "nome": "Poção",
    "populacao": 27661,
    "seed": 521
  },
  {
    "id": "primavera",
    "nome": "Primavera",
    "populacao": 15748,
    "seed": 190
  },
  {
    "id": "quipapa",
    "nome": "Quipapá",
    "populacao": 8124,
    "seed": 35
  },
  {
    "id": "quixaba",
    "nome": "Quixaba",
    "populacao": 36816,
    "seed": 807
  },
  {
    "id": "recife",
    "nome": "Recife",
    "populacao": 1488920,
    "seed": 402
  },
  {
    "id": "riacho-das-almas",
    "nome": "Riacho das Almas",
    "populacao": 28047,
    "seed": 447
  },
  {
    "id": "ribeirao",
    "nome": "Ribeirão",
    "populacao": 19392,
    "seed": 997
  },
  {
    "id": "rio-formoso",
    "nome": "Rio Formoso",
    "populacao": 46351,
    "seed": 5
  },
  {
    "id": "saire",
    "nome": "Sairé",
    "populacao": 31373,
    "seed": 619
  },
  {
    "id": "salgadinho",
    "nome": "Salgadinho",
    "populacao": 26929,
    "seed": 629
  },
  {
    "id": "salgueiro",
    "nome": "Salgueiro",
    "populacao": 61438,
    "seed": 13
  },
  {
    "id": "saloa",
    "nome": "Saloá",
    "populacao": 16841,
    "seed": 511
  },
  {
    "id": "sanharo",
    "nome": "Sanharó",
    "populacao": 12155,
    "seed": 618
  },
  {
    "id": "santa-cruz",
    "nome": "Santa Cruz",
    "populacao": 14084,
    "seed": 981
  },
  {
    "id": "santa-cruz-da-baixa-verde",
    "nome": "Santa Cruz da Baixa Verde",
    "populacao": 23348,
    "seed": 235
  },
  {
    "id": "santa-cruz-do-capibaribe",
    "nome": "Santa Cruz do Capibaribe",
    "populacao": 112443,
    "seed": 279
  },
  {
    "id": "santa-filomena",
    "nome": "Santa Filomena",
    "populacao": 39162,
    "seed": 95
  },
  {
    "id": "santa-maria-da-boa-vista",
    "nome": "Santa Maria da Boa Vista",
    "populacao": 34720,
    "seed": 96
  },
  {
    "id": "santa-maria-do-cambuca",
    "nome": "Santa Maria do Cambucá",
    "populacao": 22521,
    "seed": 409
  },
  {
    "id": "santa-terezinha",
    "nome": "Santa Terezinha",
    "populacao": 39959,
    "seed": 245
  },
  {
    "id": "serra-talhada",
    "nome": "Serra Talhada",
    "populacao": 86350,
    "seed": 469
  },
  {
    "id": "serrita",
    "nome": "Serrita",
    "populacao": 33757,
    "seed": 980
  },
  {
    "id": "sertania",
    "nome": "Sertânia",
    "populacao": 11932,
    "seed": 314
  },
  {
    "id": "sirinhaem",
    "nome": "Sirinhaém",
    "populacao": 44890,
    "seed": 758
  },
  {
    "id": "solidao",
    "nome": "Solidão",
    "populacao": 28094,
    "seed": 617
  },
  {
    "id": "surubim",
    "nome": "Surubim",
    "populacao": 61815,
    "seed": 747
  },
  {
    "id": "sao-benedito-do-sul",
    "nome": "São Benedito do Sul",
    "populacao": 47957,
    "seed": 228
  },
  {
    "id": "sao-bento-do-una",
    "nome": "São Bento do Una",
    "populacao": 58316,
    "seed": 516
  },
  {
    "id": "sao-caitano",
    "nome": "São Caitano",
    "populacao": 19038,
    "seed": 265
  },
  {
    "id": "sao-joaquim-do-monte",
    "nome": "São Joaquim do Monte",
    "populacao": 44001,
    "seed": 853
  },
  {
    "id": "sao-jose-da-coroa-grande",
    "nome": "São José da Coroa Grande",
    "populacao": 25845,
    "seed": 760
  },
  {
    "id": "sao-jose-do-belmonte",
    "nome": "São José do Belmonte",
    "populacao": 24460,
    "seed": 674
  },
  {
    "id": "sao-jose-do-egito",
    "nome": "São José do Egito",
    "populacao": 17715,
    "seed": 286
  },
  {
    "id": "sao-joao",
    "nome": "São João",
    "populacao": 45300,
    "seed": 315
  },
  {
    "id": "sao-lourenco-da-mata",
    "nome": "São Lourenço da Mata",
    "populacao": 114079,
    "seed": 828
  },
  {
    "id": "sao-vicente-ferrer",
    "nome": "São Vicente Férrer",
    "populacao": 22988,
    "seed": 328
  },
  {
    "id": "tabira",
    "nome": "Tabira",
    "populacao": 21281,
    "seed": 563
  },
  {
    "id": "tacaimbo",
    "nome": "Tacaimbó",
    "populacao": 21228,
    "seed": 158
  },
  {
    "id": "tacaratu",
    "nome": "Tacaratu",
    "populacao": 6000,
    "seed": 648
  },
  {
    "id": "tamandare",
    "nome": "Tamandaré",
    "populacao": 22944,
    "seed": 356
  },
  {
    "id": "taquaritinga-do-norte",
    "nome": "Taquaritinga do Norte",
    "populacao": 10375,
    "seed": 737
  },
  {
    "id": "terezinha",
    "nome": "Terezinha",
    "populacao": 27232,
    "seed": 23
  },
  {
    "id": "terra-nova",
    "nome": "Terra Nova",
    "populacao": 46236,
    "seed": 824
  },
  {
    "id": "timbauba",
    "nome": "Timbaúba",
    "populacao": 53498,
    "seed": 852
  },
  {
    "id": "toritama",
    "nome": "Toritama",
    "populacao": 47547,
    "seed": 581
  },
  {
    "id": "tracunhaem",
    "nome": "Tracunhaém",
    "populacao": 39962,
    "seed": 994
  },
  {
    "id": "trindade",
    "nome": "Trindade",
    "populacao": 33739,
    "seed": 492
  },
  {
    "id": "triunfo",
    "nome": "Triunfo",
    "populacao": 20971,
    "seed": 37
  },
  {
    "id": "tupanatinga",
    "nome": "Tupanatinga",
    "populacao": 33981,
    "seed": 783
  },
  {
    "id": "tuparetama",
    "nome": "Tuparetama",
    "populacao": 45310,
    "seed": 496
  },
  {
    "id": "venturosa",
    "nome": "Venturosa",
    "populacao": 44293,
    "seed": 72
  },
  {
    "id": "verdejante",
    "nome": "Verdejante",
    "populacao": 14216,
    "seed": 841
  },
  {
    "id": "vertente-do-lerio",
    "nome": "Vertente do Lério",
    "populacao": 7470,
    "seed": 644
  },
  {
    "id": "vertentes",
    "nome": "Vertentes",
    "populacao": 10342,
    "seed": 629
  },
  {
    "id": "vicencia",
    "nome": "Vicência",
    "populacao": 33512,
    "seed": 222
  },
  {
    "id": "vitoria-de-santo-antao",
    "nome": "Vitória de Santo Antão",
    "populacao": 139559,
    "seed": 482
  },
  {
    "id": "xexeu",
    "nome": "Xexéu",
    "populacao": 7748,
    "seed": 802
  },
  {
    "id": "agua-preta",
    "nome": "Água Preta",
    "populacao": 27243,
    "seed": 959
  },
  {
    "id": "aguas-belas",
    "nome": "Águas Belas",
    "populacao": 6811,
    "seed": 656
  }
];
