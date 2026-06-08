const API = "http://localhost:9090/livros";
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
  if (!date) return "Data não registrada";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Data não registrada";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(parsedDate);
}

const CATEGORIES = [
  { id: "ACAO", name: "Ação", emoji: "💥" },
  { id: "FICCAO", name: "Ficção", emoji: "🛸" },
  { id: "TERROR", name: "Terror", emoji: "🦇" },
  { id: "ROMANCE", name: "Romance", emoji: "🌹" },
  { id: "EDUCACIONAL", name: "Educacional", emoji: "🎓" },
  { id: "FANTASIA", name: "Fantasia", emoji: "🧙‍♂️" }
];

let livros = [];
let selectedCategoryId = null;
let editingBookId = null;

const homeView = document.getElementById("home-view");
const categoryView = document.getElementById("category-view");
const categoriesGrid = document.getElementById("categories-grid");
const loanHistory = document.getElementById("loan-history");
const returnHistory = document.getElementById("return-history");
const categoryTitle = document.getElementById("category-title");
const bookList = document.getElementById("book-list");
const backBtn = document.getElementById("back-btn");
const bookForm = document.getElementById("book-form");
const bookTitleInput = document.getElementById("book-title-input");
const bookAuthorInput = document.getElementById("book-author-input");
const saveBookBtn = document.getElementById("save-book-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

const deleteModal = document.getElementById("delete-modal");
const deleteModalText = document.getElementById("delete-modal-text");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

let bookPendingDelete = null;
let history = { loaned: [], returned: [] };

// ===== API =====

async function loadBooks() {
  try {
    const res = await fetch(API);
    livros = await res.json();
  } catch (err) {
    console.error("Erro ao carregar livros:", err);
    livros = [];
  }
  render();
}

async function apiAddBook(nome, autor, categoria) {
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, autor, categoria })
  });
  await loadBooks();
}

async function apiDeleteBook(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  await loadBooks();
}

// ===== HELPERS =====

function getBooksByCategory(categoryName) {
  return livros.filter(l => l.categoria === categoryName);
}

function getSelectedCategory() {
  return CATEGORIES.find(c => c.id === selectedCategoryId);
}

function clearBookForm() {
  if (bookTitleInput) bookTitleInput.value = "";
  if (bookAuthorInput) bookTitleInput.value = "";
  if (saveBookBtn) saveBookBtn.textContent = "Adicionar livro";
  if (cancelEditBtn) cancelEditBtn.classList.add("hidden");
  editingBookId = null;
}

function pushHistory(type, text) {
  history[type].unshift({ text, date: getCurrentHistoryDate() });
  history[type] = history[type].slice(0, MAX_HISTORY_ITEMS);
}

// ===== AÇÕES =====

function openCategory(categoryId) {
  selectedCategoryId = categoryId;
  editingBookId = null;
  clearBookForm();
  render();
}

function backToHome() {
  selectedCategoryId = null;
  editingBookId = null;
  clearBookForm();
  render();
}

async function handleBookSubmit(event) {
  event.preventDefault();
  const category = getSelectedCategory();
  if (!category) return;

  const title = bookTitleInput.value.trim();
  const author = bookAuthorInput.value.trim();
  if (!title || !author) {
    alert("Preencha o título e o autor do livro.");
    return;
  }

  await apiAddBook(title, author, category.name);
  clearBookForm();
}

function startEditBook(bookId) {
  const book = livros.find(b => b.id === bookId);
  if (!book) return;
  editingBookId = book.id;
  bookTitleInput.value = book.nome;
  bookAuthorInput.value = book.autor;
  saveBookBtn.textContent = "Salvar edição";
  cancelEditBtn.classList.remove("hidden");
  bookTitleInput.focus();
}

function deleteBook(bookId) {
  const book = livros.find(b => b.id === bookId);
  if (!book) return;
  bookPendingDelete = bookId;
  deleteModalText.textContent = `Tem certeza que deseja excluir o livro "${book.nome}"?`;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  bookPendingDelete = null;
  deleteModal.classList.add("hidden");
}

async function confirmDeleteBook() {
  if (!bookPendingDelete) { closeDeleteModal(); return; }
  await apiDeleteBook(bookPendingDelete);
  closeDeleteModal();
}

function markLoan(bookId) {
  const book = livros.find(b => b.id === bookId);
  if (!book || book.emprestado) return;
  book.emprestado = true;
  pushHistory("loaned", `${book.nome} (${book.categoria})`);
  render();
}

function markReturn(bookId) {
  const book = livros.find(b => b.id === bookId);
  if (!book || !book.emprestado) return;
  book.emprestado = false;
  pushHistory("returned", `${book.nome} (${book.categoria})`);
  render();
}

// ===== RENDER =====

function renderCategoriesGrid() {
  categoriesGrid.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const count = getBooksByCategory(cat.name).length;
    const button = document.createElement("button");
    button.className = "category-tile";
    button.type = "button";
    button.innerHTML = `
      <span class="category-emoji">${cat.emoji}</span>
      <span>${cat.name}</span>
      <small>${count} livro(s)</small>
    `;
    button.addEventListener("click", () => openCategory(cat.id));
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
  if (!category) { backToHome(); return; }

  categoryTitle.textContent = `Categoria: ${category.name}`;
  bookList.innerHTML = "";

  const books = getBooksByCategory(category.name);
  if (!books.length) {
    const li = document.createElement("li");
    li.className = "book-item";
    li.textContent = "Nenhum livro cadastrado nesta categoria.";
    bookList.appendChild(li);
    return;
  }

  books.forEach((book) => {
    const li = document.createElement("li");
    li.className = "book-item";

    const meta = document.createElement("div");
    meta.className = "book-meta";
    meta.innerHTML = `
      <strong>${book.nome}</strong>
      <span>Autor: ${book.autor}</span>
      <span class="status">Status: ${book.emprestado ? "Emprestado" : "Disponível"}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "book-actions";

    const loanBtn = document.createElement("button");
    loanBtn.className = "btn loan";
    loanBtn.type = "button";
    loanBtn.textContent = "Emprestar";
    loanBtn.disabled = book.emprestado;
    loanBtn.addEventListener("click", () => markLoan(book.id));

    const returnBtn = document.createElement("button");
    returnBtn.className = "btn return";
    returnBtn.type = "button";
    returnBtn.textContent = "Devolver";
    returnBtn.disabled = !book.emprestado;
    returnBtn.addEventListener("click", () => markReturn(book.id));

    const editBtn = document.createElement("button");
    editBtn.className = "btn edit";
    editBtn.type = "button";
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => startEditBook(book.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn delete";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Excluir";
    deleteBtn.addEventListener("click", () => deleteBook(book.id));

    actions.append(loanBtn, returnBtn, editBtn, deleteBtn);
    li.append(meta, actions);
    bookList.appendChild(li);
  });
}

function render() {
  renderCategoriesGrid();
  renderHistoryList(loanHistory, history.loaned, "Nenhum empréstimo registrado.");
  renderHistoryList(returnHistory, history.returned, "Nenhuma devolução registrada.");

  const showingCategory = !!selectedCategoryId;
  homeView.classList.toggle("hidden", showingCategory);
  categoryView.classList.toggle("hidden", !showingCategory);
  if (showingCategory) renderCategoryView();
}

// ===== EVENTOS =====

if (backBtn) backBtn.addEventListener("click", backToHome);
if (bookForm) bookForm.addEventListener("submit", handleBookSubmit);
if (cancelEditBtn) cancelEditBtn.addEventListener("click", clearBookForm);
if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);
if (confirmDeleteBtn) confirmDeleteBtn.addEventListener("click", confirmDeleteBook);

// ===== INICIAR =====
render();
loadBooks();
