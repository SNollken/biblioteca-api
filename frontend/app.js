const STORAGE_KEY = "biblioteca_front_v1";
const MAX_HISTORY_ITEMS = 8;

const USER = {
  name: "aquele cara",
  email: "google@gmail.com"
};

const initialState = {
  categories: [
    {
      id: "ACAO",
      name: "Ação",
      books: [
        { id: 1, title: "Missão Secreta", author: "M. Andrade", borrowed: false },
        { id: 2, title: "Alvo Noturno", author: "R. Prado", borrowed: true }
      ]
    },
    {
      id: "FICCAO",
      name: "Ficção",
      books: [
        { id: 3, title: "Cidade Nebulosa", author: "I. Rocha", borrowed: false },
        { id: 4, title: "Estação Lunar", author: "P. Teles", borrowed: false }
      ]
    },
    {
      id: "TERROR",
      name: "Terror",
      books: [
        { id: 5, title: "Casa da Colina", author: "L. Mota", borrowed: true },
        { id: 6, title: "Sussurros", author: "A. Nunes", borrowed: false }
      ]
    },
    {
      id: "ROMANCE",
      name: "Romance",
      books: [
        { id: 7, title: "Cartas de Verão", author: "S. Brito", borrowed: false },
        { id: 8, title: "Dois Destinos", author: "V. Costa", borrowed: false }
      ]
    },
    {
      id: "EDUCACIONAL",
      name: "Educacional",
      books: [
        { id: 9, title: "História Antiga", author: "C. Almeida", borrowed: false },
        { id: 10, title: "Introdução à Física", author: "E. Vaz", borrowed: false }
      ]
    },
    {
      id: "FANTASIA",
      name: "Fantasia",
      books: [
        { id: 11, title: "Reino de Bronze", author: "J. Leme", borrowed: true },
        { id: 12, title: "A Floresta Azul", author: "N. Faria", borrowed: false }
      ]
    }
  ],
  history: {
    loaned: [
      "Alvo Noturno (Ação)",
      "Casa da Colina (Terror)",
      "Reino de Bronze (Fantasia)"
    ],
    returned: [
      "Noite de Inverno (Romance)",
      "Aventuras do Sul (Ficção)"
    ]
  },
  selectedCategoryId: null
};

let state = loadState();

const homeView = document.getElementById("home-view");
const categoryView = document.getElementById("category-view");
const categoriesGrid = document.getElementById("categories-grid");
const loanHistory = document.getElementById("loan-history");
const returnHistory = document.getElementById("return-history");
const categoryTitle = document.getElementById("category-title");
const bookList = document.getElementById("book-list");
const backBtn = document.getElementById("back-btn");
const resetBtn = document.getElementById("reset-btn");
const userNameEl = document.querySelector(".user-name");
const userEmailEl = document.querySelector(".user-email");

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(initialState);

  try {
    const parsed = JSON.parse(raw);
    if (!parsed.categories || !parsed.history) return structuredClone(initialState);
    return parsed;
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetState() {
  const confirmed = window.confirm("Deseja apagar os dados locais e restaurar os dados iniciais?");
  if (!confirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  state = structuredClone(initialState);
  saveState();
  render();
}

function openCategory(categoryId) {
  state.selectedCategoryId = categoryId;
  saveState();
  render();
}

function backToHome() {
  state.selectedCategoryId = null;
  saveState();
  render();
}

function pushHistory(type, text) {
  state.history[type].unshift(text);
  state.history[type] = state.history[type].slice(0, MAX_HISTORY_ITEMS);
}

function markLoan(categoryId, bookId) {
  const category = state.categories.find((c) => c.id === categoryId);
  if (!category) return;

  const book = category.books.find((b) => b.id === bookId);
  if (!book || book.borrowed) return;

  book.borrowed = true;
  pushHistory("loaned", `${book.title} (${category.name})`);
  saveState();
  render();
}

function markReturn(categoryId, bookId) {
  const category = state.categories.find((c) => c.id === categoryId);
  if (!category) return;

  const book = category.books.find((b) => b.id === bookId);
  if (!book || !book.borrowed) return;

  book.borrowed = false;
  pushHistory("returned", `${book.title} (${category.name})`);
  saveState();
  render();
}

function renderCategoriesGrid() {
  categoriesGrid.innerHTML = "";

  state.categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-tile";
    button.type = "button";
    button.textContent = category.name;
    button.addEventListener("click", () => openCategory(category.id));
    categoriesGrid.appendChild(button);
  });
}

function renderHistoryList(element, items, emptyText) {
  element.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    element.appendChild(li);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function renderCategoryView() {
  const category = state.categories.find((c) => c.id === state.selectedCategoryId);
  if (!category) {
    backToHome();
    return;
  }

  categoryTitle.textContent = `Categoria: ${category.name}`;
  bookList.innerHTML = "";

  category.books.forEach((book) => {
    const li = document.createElement("li");
    li.className = "book-item";

    const meta = document.createElement("div");
    meta.className = "book-meta";
    meta.innerHTML = `
      <strong>${book.title}</strong>
      <span>Autor: ${book.author}</span>
      <span class="status">Status: ${book.borrowed ? "Emprestado" : "Disponível"}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const loanBtn = document.createElement("button");
    loanBtn.className = "btn loan";
    loanBtn.type = "button";
    loanBtn.textContent = "Emprestar";
    loanBtn.disabled = book.borrowed;
    loanBtn.addEventListener("click", () => markLoan(category.id, book.id));

    const returnBtn = document.createElement("button");
    returnBtn.className = "btn return";
    returnBtn.type = "button";
    returnBtn.textContent = "Devolver";
    returnBtn.disabled = !book.borrowed;
    returnBtn.addEventListener("click", () => markReturn(category.id, book.id));

    actions.append(loanBtn, returnBtn);
    li.append(meta, actions);
    bookList.appendChild(li);
  });
}

function renderUserProfile() {
  userNameEl.textContent = USER.name;
  userEmailEl.textContent = USER.email;
}

function render() {
  renderUserProfile();
  renderCategoriesGrid();
  renderHistoryList(loanHistory, state.history.loaned, "Nenhum empréstimo registrado.");
  renderHistoryList(returnHistory, state.history.returned, "Nenhuma devolução registrada.");

  const showingCategory = !!state.selectedCategoryId;
  homeView.classList.toggle("hidden", showingCategory);
  categoryView.classList.toggle("hidden", !showingCategory);

  if (showingCategory) {
    renderCategoryView();
  }
}

backBtn.addEventListener("click", backToHome);
resetBtn.addEventListener("click", resetState);
render();
