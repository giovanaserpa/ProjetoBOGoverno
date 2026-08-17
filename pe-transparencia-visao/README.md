<div align="center">
  <h1>☀️ Transparência PE</h1>
  <p><em>Um Dashboard moderno e interativo para análise de dados públicos dos municípios de Pernambuco.</em></p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Lovable-FF0000?style=for-the-badge&logo=lovable&logoColor=white" alt="Lovable" />
</div>

<br/>

## 📖 Sobre o Projeto

O **Transparência PE** é uma aplicação web voltada para a visualização clara e objetiva dos dados financeiros e de gestão pública do estado de Pernambuco. Através de uma interface limpa e amigável, o sistema permite que cidadãos e gestores acompanhem métricas cruciais de arrecadação, despesas e investimentos (como saúde e educação).

O design foi rigorosamente pensado para refletir a identidade do estado, utilizando a paleta de cores da bandeira pernambucana de forma funcional para guiar a atenção do usuário.

## 🚀 Funcionalidades

### 1. Visão Geral (Dashboard Macro)
Uma visão unificada das contas públicas do estado contendo:
- **Cards de Métricas:** Resumo rápido de *Receita Total* (Verde), *Despesa Liquidada* (Vermelho), *Investimentos em Saúde* e *Educação*.
- **Gráfico Histórico:** Visualização em linha/área cruzando dados de Receitas vs. Despesas ao longo dos meses.
- **Ranking de Transparência:** Uma tabela listando o Top 5 municípios com as melhores práticas de transparência.

### 2. Comparador de Municípios (Side-by-Side)
Ferramenta analítica que permite selecionar duas cidades pernambucanas (ex: *Recife* e *Caruaru*) para um confronto direto de dados:
- **Métricas Lado a Lado:** População, receita per capita e índice de transparência.
- **Gráficos Comparativos:** Utiliza a biblioteca `Recharts` para plotar gráficos de barras emparelhados, facilitando a comparação visual dos gastos em Saúde, Educação e Saneamento entre os dois municípios.

## 🎨 Design & Paleta de Cores

A interface utiliza estritamente as cores da bandeira de Pernambuco com propósitos semânticos:
- 🔵 **Azul Marinho (`#002B49`)**: Cor primária (Sidebar, headers, navegação).
- ⚪ **Branco & Cinza Claro (`#FFFFFF`)**: Fundos e cards, garantindo um contraste limpo.
- 🟡 **Amarelo Ouro (`#FFC72C`)**: Alertas, destaques secundários e o "sol" do dashboard.
- 🟢 **Verde (`#008751`)**: Indicadores positivos (Receitas, superávit).
- 🔴 **Vermelho (`#D52B1E`)**: Indicadores de atenção (Despesas, déficit).

---

## 💻 Desenvolvimento Local

Este projeto requer o [Node.js](https://nodejs.org/) e o `npm` (ou `yarn`/`pnpm`) instalados na sua máquina. Caso não tenha o Node, recomendamos instalar através do [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm#installing-and-updating).

Siga os passos abaixo para rodar o projeto na sua máquina:

```bash
# 1. Clone este repositório
git clone <url-deste-repositorio>

# 2. Acesse a pasta do projeto
cd <nome-do-repositorio>

# 3. Instale as dependências do Node
npm install
# ou yarn install / pnpm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
# ou yarn dev / pnpm dev