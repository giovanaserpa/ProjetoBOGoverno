# Portal de Custos e Transparência de Pernambuco

Protótipo da squad **Datavix** para o desafio da SEFAZ-PE publicado no
Desafios.Day (Usina Pernambucana de Inovação): uma plataforma que consolide
e apresente de forma clara os custos do Estado, com acesso público,
comparação entre órgãos e períodos, e apoio à decisão baseada em evidências.

## Como abrir

Abra `index.html` no navegador. Não precisa de servidor, build nem instalar nada.

## Estrutura

```
index.html              página inicial
educacao.html           páginas de setor, uma por área
saude.html
politica.html
cultura.html
seguranca.html
assets/css/style.css    folha de estilo única, com tema por setor
assets/js/dados.js      TODOS os números do portal
assets/js/layout.js     cabeçalho, rodapé e montagem dos blocos
assets/img/             brasão do Estado
```

O cabeçalho, o menu e o rodapé são montados por `layout.js` e existem uma
vez só. Mexer neles muda as seis páginas de uma vez.

O tema por área é trocado pelo atributo `data-sector` no `<body>`:

```html
<body data-sector="saude">
```

O CSS redefine `--sector` e `--sector-tint` para cada valor. Uma folha de
estilo, cinco identidades visuais.

## Onde ficam os números

Só em `assets/js/dados.js`. Cada bloco tem um campo `origem`:

- `"oficial"` — valor conferido no Portal da Transparência de PE
- `"ilustrativo"` — número de exemplo, ainda a substituir

**Hoje só a régua de execução orçamentária é `oficial`.** Os quatro valores
(fixado, empenhado, liquidado e pago) vieram de
transparencia.pe.gov.br → Despesas → Despesas Gerais, exercício 2026,
consultados em 20/11/2026, com fonte no sistema E-Fisco da SEFAZ/PE.

As séries por setor e o ranking continuam ilustrativos, e a interface
avisa isso na legenda de cada bloco. Nenhum número inventado é apresentado
como real.

### Para substituir por dado real

1. Abra `assets/js/dados.js`
2. Troque os valores do bloco correspondente
3. Mude `origem` de `"ilustrativo"` para `"oficial"` e preencha `fonte` e
   `consultaEm`
4. Apague a frase "Número ilustrativo..." da legenda daquele bloco no HTML

## O que diferencia do portal do Estado

Levantamento feito no portal oficial em 20/11/2026:

| | Portal PE | Aqui |
|---|---|---|
| Interface consistente entre as seções | não | sim |
| Comparação lado a lado | não | sim |
| Gráficos legíveis no celular | não | sim |
| Relação entre as etapas do gasto | quatro caixas soltas | régua proporcional |
| Busca por "custos" | 1 resultado, irrelevante | — |

## Pendências conhecidas

- O comparador ainda é de municípios. O cliente (SEFAZ) declarou não ter
  autoridade sobre dado de prefeitura e apontou risco reputacional de
  publicar dado municipal incorreto com a marca do Estado. Trocar para
  órgãos do Executivo estadual é mudar a lista em `dados.js`.
- As fontes (Source Serif 4 e IBM Plex Sans) vêm do Google por rede. Sem
  internet, o site cai para Georgia e a fonte do sistema.
- O campo de busca do cabeçalho ainda não faz nada.
- O site usa o brasão e a assinatura do Governo do Estado. Serve para
  apresentação; antes de publicar em qualquer lugar aberto, trocar por
  identidade própria da squad.

## Squad

Beatriz de Souza · Caio Porto · Giovana Serpa · João Augusto Vieira · Vanessa Cavalcanti
