const STORAGE_KEY = "biblioteca_front_v1";
const MAX_HISTORY_ITEMS = 8;

const USER = {
  name: "aquele cara",
  email: "google@gmail.com"
};

function getCurrentHistoryDate() {
  return new Date().toISOString();
}

function formatHistoryDate(date) {
  if (!date) {
    return "Data não registrada";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não registrada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(parsedDate);
}

const initialState = {
  categories: [
    {
      id: "ACAO",
      name: "Ação",
      emoji: "💥",
      books: [
        { id: 1, title: "Missão Secreta", author: "M. Andrade", borrowed: false },
        { id: 2, title: "Alvo Noturno", author: "R. Prado", borrowed: true }
      ]
    },
    {
      id: "FICCAO",
      name: "Ficção",
      emoji: "🛸",
      books: [
        { id: 3, title: "Cidade Nebulosa", author: "I. Rocha", borrowed: false },
        { id: 4, title: "Estação Lunar", author: "P. Teles", borrowed: false }
      ]
    },
    {
      id: "TERROR",
      name: "Terror",
      emoji: "🦇",
      books: [
        { id: 5, title: "Casa da Colina", author: "L. Mota", borrowed: true },
        { id: 6, title: "Sussurros", author: "A. Nunes", borrowed: false }
      ]
    },
    {
      id: "ROMANCE",
      name: "Romance",
      emoji: "🌹",
      books: [
        { id: 7, title: "Cartas de Verão", author: "S. Brito", borrowed: false },
        { id: 8, title: "Dois Destinos", author: "V. Costa", borrowed: false }
      ]
    },
    {
      id: "EDUCACIONAL",
      name: "Educacional",
      emoji: "🎓",
      books: [
        { id: 9, title: "História Antiga", author: "C. Almeida", borrowed: false },
        { id: 10, title: "Introdução à Física", author: "E. Vaz", borrowed: false }
      ]
    },
    {
      id: "FANTASIA",
      name: "Fantasia",
      emoji: "🧙‍♂️",
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
let editingBookId = null;

const homeView = document.getElementById("home-view");
const categoryView = document.getElementById("category-view");
const categoriesGrid = document.getElementById("categories-grid");
const loanHistory = document.getElementById("loan-history");
const returnHistory = document.getElementById("return-history");
const categoryTitle = document.getElementById("category-title");
const bookList = document.getElementById("book-list");
const backBtn = document.getElementById("back-btn");
const resetBtn = document.getElementById("reset-btn");

const bookForm = document.getElementById("book-form");
const bookTitleInput = document.getElementById("book-title-input");
const bookAuthorInput = document.getElementById("book-author-input");
const saveBookBtn = document.getElementById("save-book-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

const userNameEl = document.querySelector(".user-name");
const userEmailEl = document.querySelector(".user-email");

const CATEGORY_EMOJIS = {
  ACAO: "💥",
  FICCAO: "🛸",
  TERROR: "🦇",
  ROMANCE: "🌹",
  EDUCACIONAL: "🎓",
  FANTASIA: "🧙‍♂️"
};

const deleteModal = document.getElementById("delete-modal");
const deleteModalText = document.getElementById("delete-modal-text");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

let bookPendingDelete = null;

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
  editingBookId = null;
  saveState();
  render();
}

function openCategory(categoryId) {
  state.selectedCategoryId = categoryId;
  editingBookId = null;
  clearBookForm();
  saveState();
  render();
}

function backToHome() {
  state.selectedCategoryId = null;
  editingBookId = null;
  clearBookForm();
  saveState();
  render();
}

function getSelectedCategory() {
  return state.categories.find((category) => category.id === state.selectedCategoryId);
}

function getNextBookId() {
  const allBooks = state.categories.flatMap((category) => category.books);
  const lastId = allBooks.reduce((max, book) => Math.max(max, book.id), 0);
  return lastId + 1;
}

function clearBookForm() {
  if (bookTitleInput) bookTitleInput.value = "";
  if (bookAuthorInput) bookAuthorInput.value = "";
  if (saveBookBtn) saveBookBtn.textContent = "Adicionar livro";
  if (cancelEditBtn) cancelEditBtn.classList.add("hidden");

  editingBookId = null;
}

function handleBookSubmit(event) {
  event.preventDefault();

  const category = getSelectedCategory();
  if (!category) return;

  const title = bookTitleInput.value.trim();
  const author = bookAuthorInput.value.trim();

  if (!title || !author) {
    alert("Preencha o título e o autor do livro.");
    return;
  }

  if (editingBookId) {
    const book = category.books.find((item) => item.id === editingBookId);

    if (!book) {
      clearBookForm();
      return;
    }

    book.title = title;
    book.author = author;
  } else {
    category.books.push({
      id: getNextBookId(),
      title,
      author,
      borrowed: false
    });
  }

  clearBookForm();
  saveState();
  render();
}

function startEditBook(categoryId, bookId) {
  const category = state.categories.find((item) => item.id === categoryId);
  if (!category) return;

  const book = category.books.find((item) => item.id === bookId);
  if (!book) return;

  editingBookId = book.id;
  bookTitleInput.value = book.title;
  bookAuthorInput.value = book.author;
  saveBookBtn.textContent = "Salvar edição";
  cancelEditBtn.classList.remove("hidden");
  bookTitleInput.focus();
}

function deleteBook(categoryId, bookId) {
  const category = state.categories.find((item) => item.id === categoryId);
  if (!category) return;

  const book = category.books.find((item) => item.id === bookId);
  if (!book) return;

  bookPendingDelete = {
    categoryId,
    bookId
  };

  deleteModalText.textContent = `Tem certeza que deseja excluir o livro "${book.title}"?`;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  bookPendingDelete = null;
  deleteModal.classList.add("hidden");
}

function confirmDeleteBook() {
  if (!bookPendingDelete) {
    closeDeleteModal();
    return;
  }

  const category = state.categories.find(
    (item) => item.id === bookPendingDelete.categoryId
  );

  if (!category) {
    closeDeleteModal();
    return;
  }

  category.books = category.books.filter(
    (item) => item.id !== bookPendingDelete.bookId
  );

  if (editingBookId === bookPendingDelete.bookId) {
    clearBookForm();
  }

  saveState();
  closeDeleteModal();
  render();
}

function pushHistory(type, text) {
  state.history[type].unshift({
    text,
    date: getCurrentHistoryDate()
  });

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
    button.innerHTML = `
      <span class="category-emoji">${CATEGORY_EMOJIS[category.id] || "📚"}</span>
      <span>${category.name}</span>
    `;
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

    const historyInfo = document.createElement("div");
    historyInfo.className = "history-info";

    const historyText = document.createElement("span");
    const historyDate = document.createElement("small");

    if (typeof item === "string") {
      historyText.textContent = item;
      historyDate.textContent = "Data não registrada";
    } else {
      historyText.textContent = item.text;
      historyDate.textContent = formatHistoryDate(item.date);
    }

    historyInfo.append(historyText, historyDate);
    li.appendChild(historyInfo);
    element.appendChild(li);
  });
}

function renderCategoryView() {
  const category = getSelectedCategory();

  if (!category) {
    backToHome();
    return;
  }

  categoryTitle.textContent = `Categoria: ${category.name}`;
  bookList.innerHTML = "";

  if (!category.books.length) {
    const li = document.createElement("li");
    li.className = "book-item";
    li.textContent = "Nenhum livro cadastrado nesta categoria.";
    bookList.appendChild(li);
    return;
  }

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

    const editBtn = document.createElement("button");
    editBtn.className = "btn edit";
    editBtn.type = "button";
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => startEditBook(category.id, book.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn delete";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => deleteBook(category.id, book.id));

    actions.append(loanBtn, returnBtn, editBtn, deleteBtn);
    li.append(meta, actions);
    bookList.appendChild(li);
  });
}

function renderUserProfile() {
  if (userNameEl) {
    userNameEl.textContent = USER.name;
  }

  if (userEmailEl) {
    userEmailEl.textContent = USER.email;
  }
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

if (backBtn) {
  backBtn.addEventListener("click", backToHome);
}

if (resetBtn) {
  resetBtn.addEventListener("click", resetState);
}

if (bookForm) {
  bookForm.addEventListener("submit", handleBookSubmit);
}

if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", () => {
    clearBookForm();
  });
}

if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", confirmDeleteBook);
}

if (deleteModal) {
  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      closeDeleteModal();
    }
  });
}

render();