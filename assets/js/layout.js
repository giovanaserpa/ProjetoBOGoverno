/* ============================================================
   layout.js
   Cabeçalho, menu e rodapé ÚNICOS do portal.
    qualquer coisinha mudada aqui mexe em todas os menus e rodape
    DE PREFERENCIA NAO MECHER MUITO, POIS PODE DAR CACAS
   ============================================================ */

(function () {
  var MENU = [
    { label: "Início",     href: "index.html" },
    { label: "Educação",   href: "educacao.html" },
    { label: "Saúde",      href: "saude.html" },
    { label: "Política",   href: "politica.html" },
    { label: "Cultura",    href: "cultura.html" },
    { label: "Segurança",  href: "seguranca.html" }
  ];

  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  function renderHeader() {
    var page = currentPage();
    var links = MENU.map(function (item) {
      var current = item.href === page ? ' aria-current="page"' : "";
      return '<li><a href="' + item.href + '"' + current + ">" + item.label + "</a></li>";
    }).join("");

    return (
      '<header class="site-header">' +
        '<div class="site-header__inner">' +
          '<img class="brasao" src="assets/img/logo-pernambuco.png" alt="Governo do Estado de Pernambuco">' + // logo do governo
          '<span class="wordmark__sub">PORTAL DA TRANSPARÊNCIA</span>' +
        "</div>" +
      "</header>" +
      '<nav class="site-nav" aria-label="Menu principal">' +
        '<div class="container site-nav__inner">' +
          '<ul class="site-nav__list">' + links + "</ul>" +
          '<form class="site-search" role="search" onsubmit="return false;">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
            '<input type="search" placeholder="Buscar no portal" aria-label="Buscar no portal">' +
          "</form>" +
        "</div>" +
      "</nav>"
    );
  }

  function renderFooter() {
    return (
      '<footer class="site-footer">' +
        '<div class="container site-footer__inner">' +
          "<div>" +
            "<h3>PORTAL DA TRANSPARÊNCIA</h3>" +
            "<p>Governo do Estado de Pernambuco. Dados abertos sobre educação, saúde, política, cultura e segurança pública.</p>" +
          "</div>" +
          "<div><h3>Navegue</h3><ul>" +
            MENU.map(function (i) { return '<li><a href="' + i.href + '">' + i.label + "</a></li>"; }).join("") +
          "</ul></div>" +
          "<div><h3>Acesso</h3><ul>" +
            '<li><a href="#">Lei de Acesso à Informação</a></li>' +
            '<li><a href="#">Dados abertos (CSV/API)</a></li>' +
            '<li><a href="#">Perguntas frequentes</a></li>' +
          "</ul></div>" +
          "<div><h3>Contato</h3><ul>" +
            '<li><a href="#">Fale conosco</a></li>' +
            '<li><a href="#">Ouvidoria</a></li>' +
          "</ul></div>" +
        "</div>" +
        '<div class="site-footer__stripes"><span></span><span></span></div>' +
        '<div class="site-footer__base container">' +
          "<span>© " + new Date().getFullYear() + " Governo do Estado de Pernambuco</span>" +
          "<span>Portal da Transparência</span>" +
        "</div>" +
      "</footer>"
    );
  }

  function mount() {
    var headerSlot = document.getElementById("site-header");
    var footerSlot = document.getElementById("site-footer");
    if (headerSlot) headerSlot.outerHTML = renderHeader();
    if (footerSlot) footerSlot.outerHTML = renderFooter();
  }

  document.addEventListener("DOMContentLoaded", mount);
})();

/* exemplos (tirar depois)*/
document.addEventListener("DOMContentLoaded", function () {
  // barras do gráfico com alturas variadas, só para simular dados
  document.querySelectorAll(".chart-placeholder").forEach(function (chart) {
    for (var i = 0; i < 8; i++) {
      var bar = document.createElement("i");
      bar.style.height = (30 + Math.random() * 65) + "%";
      chart.appendChild(bar);
    }
  });

  //expandir a área do gráfico
  document.querySelectorAll(".js-toggle-grafico").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".card");
      var painel = card.querySelector(".chart-expanded");
      var abrindo = painel.hasAttribute("hidden");

      if (abrindo) {
        painel.removeAttribute("hidden");
        card.classList.add("card--full");
        btn.textContent = "Ocultar dados completos";
      } else {
        painel.setAttribute("hidden", "");
        card.classList.remove("card--full");
        btn.textContent = "Ver dados completos";
      }
      btn.setAttribute("aria-expanded", String(abrindo));
    });
  });

  //  exemplo ao clicar no Comparar
  document.querySelectorAll(".comparador button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var result = btn.closest(".card").querySelector(".comparador__result");
      var selects = btn.closest(".card").querySelectorAll("select");
      var a = selects[0].value, b = selects[1].value;
      if (result) {
        result.textContent = a && b
          ? "Comparação entre " + a + " e " + b + " — conteúdo de exemplo, a substituir pelos dados reais."
          : "Selecione dois municípios para comparar.";
      }
    });
  });
});
