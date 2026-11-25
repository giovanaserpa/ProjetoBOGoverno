/* ============================================================
   componentes.js — modal, toast, skeleton e tooltip

   Cada um existe por uma necessidade do portal, não por catálogo:

   tooltip   explica o vocabulário orçamentário onde ele aparece
   modal     abre lista completa e detalhe sem trocar de página
   toast     confirma ação que não tem retorno visível
   skeleton  segura o lugar enquanto um bloco é remontado

   Todos funcionam por teclado e respeitam prefers-reduced-motion.
   ============================================================ */

var UI = (function () {

  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================
     TOAST
     Fila no canto inferior. aria-live polite para o leitor de
     tela anunciar sem interromper o que a pessoa está fazendo.
     ========================================================== */

  var pilha = null;

  function pilhaToast() {
    if (pilha) return pilha;
    pilha = document.createElement("div");
    pilha.className = "toasts";
    pilha.setAttribute("role", "status");
    pilha.setAttribute("aria-live", "polite");
    document.body.appendChild(pilha);
    return pilha;
  }

  function toast(texto, tipo) {
    var el = document.createElement("div");
    el.className = "toast" + (tipo ? " toast--" + tipo : "");
    el.innerHTML =
      '<span class="toast__marca" aria-hidden="true"></span>' +
      '<span class="toast__texto"></span>' +
      '<button class="toast__fechar" type="button" aria-label="Dispensar aviso">&times;</button>';
    el.querySelector(".toast__texto").textContent = texto;

    pilhaToast().appendChild(el);

    var tempo = window.setTimeout(sair, 4200);
    function sair() {
      window.clearTimeout(tempo);
      if (reduzMovimento) { el.remove(); return; }
      el.classList.add("toast--saindo");
      window.setTimeout(function () { el.remove(); }, 200);
    }
    el.querySelector(".toast__fechar").addEventListener("click", sair);
    return el;
  }

  /* ==========================================================
     MODAL
     Prende o foco, fecha no Esc e no clique fora, e devolve o
     foco para quem abriu.
     ========================================================== */

  var aberto = null;

  function modal(opcoes) {
    // fecha o que já estiver aberto ANTES de montar o novo. antes
    // isto chamava o fecharModal() desta mesma execução, cujo
    // "fundo" ainda não existia, e quebrava ao abrir o segundo.
    if (typeof aberto === "function") { aberto(); aberto = null; }

    var voltarPara = document.activeElement;

    var fundo = document.createElement("div");
    fundo.className = "modal-fundo";
    fundo.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">' +
        '<div class="modal__topo">' +
          '<h2 class="modal__titulo" id="modal-titulo"></h2>' +
          '<button class="modal__fechar" type="button" aria-label="Fechar">&times;</button>' +
        "</div>" +
        '<div class="modal__corpo"></div>' +
      "</div>";

    fundo.querySelector(".modal__titulo").textContent = opcoes.titulo || "";
    fundo.querySelector(".modal__corpo").innerHTML = opcoes.corpo || "";
    document.body.appendChild(fundo);
    document.body.style.overflow = "hidden";

    var caixa = fundo.querySelector(".modal");
    var focaveis = caixa.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focaveis.length) focaveis[0].focus();

    function naTecla(ev) {
      if (ev.key === "Escape") { ev.preventDefault(); fecharModal(); return; }
      if (ev.key !== "Tab" || !focaveis.length) return;
      var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
      if (ev.shiftKey && document.activeElement === primeiro) {
        ev.preventDefault(); ultimo.focus();
      } else if (!ev.shiftKey && document.activeElement === ultimo) {
        ev.preventDefault(); primeiro.focus();
      }
    }

    function fecharModal() {
      document.removeEventListener("keydown", naTecla, true);
      document.body.style.overflow = "";
      fundo.remove();
      aberto = null;
      if (voltarPara && voltarPara.focus) voltarPara.focus();
    }

    document.addEventListener("keydown", naTecla, true);
    fundo.querySelector(".modal__fechar").addEventListener("click", fecharModal);
    fundo.addEventListener("click", function (ev) {
      if (ev.target === fundo) fecharModal();
    });

    aberto = fecharModal;
    return fecharModal;
  }

  /* ==========================================================
     SKELETON
     Ocupa o lugar do conteúdo enquanto ele é remontado, para a
     página não dar um salto. aria-busy avisa o leitor de tela.
     ========================================================== */

  function skeleton(alvo, forma) {
    if (!alvo) return function () {};
    var linhas = {
      grafico: '<div class="sk sk--grafico"></div>',
      lista: '<div class="sk sk--linha"></div><div class="sk sk--linha"></div>' +
             '<div class="sk sk--linha"></div><div class="sk sk--linha"></div>',
      painel: '<div class="sk sk--bloco"></div>'
    };
    alvo.setAttribute("aria-busy", "true");
    alvo.innerHTML = '<div class="sk-area">' + (linhas[forma] || linhas.painel) + "</div>";
    return function pronto() { alvo.removeAttribute("aria-busy"); };
  }

  /* ==========================================================
     TOOLTIP
     Abre no hover e também no foco por teclado, fecha no Esc.
     Ligado por aria-describedby, então o leitor de tela lê a
     explicação junto com o termo.
     ========================================================== */

  var GLOSSARIO = {
    fixado: "O teto autorizado pela Lei Orçamentária para o ano, já com os ajustes feitos ao longo do exercício.",
    empenhado: "O Estado reservou o dinheiro para um contrato. O recurso fica comprometido, mas ainda não saiu do caixa.",
    liquidado: "O serviço foi entregue e conferido pelo órgão. É o passo que autoriza o pagamento.",
    pago: "O dinheiro saiu efetivamente do caixa do Estado.",
    custo: "Quanto consome manter um serviço, um órgão ou uma política funcionando. Diferente de despesa, que é o que saiu do caixa.",
    "por habitante": "O valor dividido pela população estimada de Pernambuco, para dar escala ao número."
  };

  var balao = null, contador = 0;

  function montarTooltips(raiz) {
    (raiz || document).querySelectorAll("[data-termo]").forEach(function (el) {
      if (el.dataset.tipPronto) return;
      var chave = el.getAttribute("data-termo").toLowerCase();
      var texto = GLOSSARIO[chave];
      if (!texto) return;

      el.dataset.tipPronto = "1";
      el.classList.add("termo");
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");

      var id = "tip-" + (++contador);

      function abrir() {
        fechar();
        balao = document.createElement("div");
        balao.className = "tooltip";
        balao.id = id;
        balao.setAttribute("role", "tooltip");
        balao.textContent = texto;
        document.body.appendChild(balao);
        el.setAttribute("aria-describedby", id);

        var r = el.getBoundingClientRect();
        var b = balao.getBoundingClientRect();
        var x = r.left + r.width / 2 - b.width / 2;
        x = Math.max(12, Math.min(x, window.innerWidth - b.width - 12));
        var acima = r.top > b.height + 16;
        balao.style.left = x + "px";
        balao.style.top = (acima ? r.top - b.height - 9 : r.bottom + 9) + window.scrollY + "px";
        balao.classList.add(acima ? "tooltip--acima" : "tooltip--abaixo");
      }

      function fechar() {
        if (balao) { balao.remove(); balao = null; }
        el.removeAttribute("aria-describedby");
      }

      el.addEventListener("mouseenter", abrir);
      el.addEventListener("mouseleave", fechar);
      el.addEventListener("focus", abrir);
      el.addEventListener("blur", fechar);
      el.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") fechar();
      });
    });
  }

  return {
    toast: toast,
    modal: modal,
    skeleton: skeleton,
    tooltips: montarTooltips,
    glossario: GLOSSARIO
  };
})();
