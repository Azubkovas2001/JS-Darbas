const addBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const bookContainer = document.querySelector(".record-container");
const deleteBtn = document.getElementById("delete-btn");
const url = document.getElementById("url");
const title = document.getElementById("title");
const author = document.getElementById("author");
const year = document.getElementById("year");
const price = document.getElementById("price");
const category = document.getElementById("category");

let BookArray = [];
let id = 0;

function Book(id, url, title, author, year, price, category) {
  this.id = id;
  this.url = url;
  this.title = title;
  this.author = author;
  this.year = year;
  this.price = price;
  this.category = category;
}
//uzkrauna knygas is localstorage
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("books") == null) {
    BookArray = [];
  } else {
    BookArray = JSON.parse(localStorage.getItem("books"));
  }
  displayBook();
});
function displayBook() {
  BookArray.forEach(function (singleBook) {
    addToList(singleBook);
  });
}
//sukuria knyga ir prideda i localstorage
addBtn.addEventListener("click", function () {
  if (checkInputFields([url, title, author, year, price, category])) {
    setMessage("pavyko", "sekmingai pridejote knyga");
    id++;
    const book = new Book(
      id,
      url.value,
      title.value,
      author.value,
      year.value,
      price.value,
      category.value
    );
    BookArray.push(book);
    localStorage.setItem("books", JSON.stringify(BookArray));
    clearInputFields();
    addToList(book);
  } else {
    setMessage("nepavyko", "uzpildikite laukelius");
  }
});

//atspausdina knyga is input laukeliu
function addToList(item) {
  const newBookDiv = document.createElement("div");
  newBookDiv.classList.add("record-item");
  newBookDiv.innerHTML = `
            <div class="record-el">
              <span id="img-content"
                ><img
                  src="${item.url}"
                  alt=""
              /></span>
            </div>
            <div class="record-el">
              <span id="labelling">ID:</span>
              <span id="book-id-content">${item.id}</span>
            </div>

            <div class="record-el">
              <span id="labelling">Knygos autorius:</span>
              <span id="name-content">${item.author}</span>
            </div>
            <div class="record-el">
              <span id="labelling">Knygos pavadinimas:</span>
              <span id="book-content" class="book-title">${item.title}</span>
            </div>
            <div class="record-el">
              <span id="labelling">Knygos metai:</span>
              <span id="year-content">${item.year}</span>
            </div>
            <div class="record-el">
              <span id="labelling">Knygos kaina:</span>
              <span id="price-content">${item.price}$</span>
            </div>
            <div class="record-el">
              <span id="labelling">Knygos kategorija:</span>
              <span id="category-content">${item.category}</span>
            </div>
            <button type="button" id="delete-btn">
              <span>
                <i class="fas fa-trash"></i>
                Delete
              </span>
            </button>
            <button type="button" id="edit-btn">
              <span>
                <i class="fas fa-edit"></i>
                Edit
              </span>
            </button>
    `;

  bookContainer.appendChild(newBookDiv);

  // rodo knygas kuria irasiau i inputa
  const searchInput = document.getElementById("search-input");
  const bookTitles = document.querySelectorAll(".book-title");

  function boldTitle(title) {
    bookTitles.forEach((bookTitle) => {
      if (bookTitle.textContent.toLowerCase().includes(title.toLowerCase())) {
        bookTitle.innerHTML = bookTitle.textContent.replace(
          new RegExp(title, "gi"),
          "<span style='color:black'>$&</span>"
        );
        bookTitle.parentElement.parentElement.style.display = "block"; // rodo knyga kurios pasiryskina
      } else {
        bookTitle.innerHTML = bookTitle.textContent;
        bookTitle.parentElement.parentElement.style.display = "none";
      }
    });
  }

  function removeBold() {
    bookTitles.forEach((bookTitle) => {
      bookTitle.innerHTML = bookTitle.textContent;
      bookTitle.parentElement.parentElement.style.display = "block"; // Rodo visas knygas
    });
  }

  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value;
    removeBold();
    if (searchValue) {
      boldTitle(searchValue);
    }
  });
}

// Knygos istrinimas
bookContainer.addEventListener("click", removeBook);
function removeBook(event) {
  if (event.target.id === "delete-btn") {
    const bookItem = event.target.closest(".record-item");
    const bookId = bookItem.querySelector("#book-id-content").textContent;

    BookArray = BookArray.filter(function (book) {
      return book.id != bookId;
    });

    bookItem.remove();
    localStorage.setItem("books", JSON.stringify(BookArray));
  }
}
// uzdeda zalia arba raudona laukeli pridejus arba nesekmingai suvedus duomenis apie knyga
function setMessage(status, message) {
  let messageBox = document.querySelector(".message");
  if (status == "nepavyko") {
    messageBox.innerHTML = message;
    messageBox.classList.add("error");
    removeMessage(status, messageBox);
  }
  if (status == "pavyko") {
    messageBox.innerHTML = message;
    messageBox.classList.add("success");
    removeMessage(status, messageBox);
  }
}
//istrina visus input values kai paspaudzia cancel mygtuka
cancelBtn.addEventListener("click", function () {
  clearInputFields();
});
function clearInputFields() {
  url.value = "";
  author.value = "";
  title.value = "";
  year.value = "";
  price.value = "";
  category.value = "";
}
//panaikina po laiko zalia arba raudona laukeli
function removeMessage(status, messageBox) {
  setTimeout(function () {
    messageBox.classList.remove(status);
  }, 500);
}
//privalo buti uzpilditi visi laukeliai norint kad suveiktu arba nesuveiktu kodas jaigu nera pilnai uzpildita
function checkInputFields(inputArr) {
  for (let i = 0; i < inputArr.length; i++) {
    if (inputArr[i].value === "") return false;
  }
  return true;
}
//paspaudus prideti knyga atidaro html elementa
const appendBtn = document.getElementById("add-book");
appendBtn.addEventListener("click", function () {
  const bookForm = document.getElementById("bookForm");
  if (bookForm.style.display !== "block") {
    bookForm.style.display = "block";
  } else {
    bookForm.style.display = "none";
  }
});

function displaySortedBook(sortOrder = "asc") {
  // rusiuoja pagal kaina
  BookArray.sort(function (a, b) {
    if (sortOrder === "asc") {
      return parseFloat(a.price) - parseFloat(b.price);
    } else {
      return parseFloat(b.price) - parseFloat(a.price);
    }
  });

  BookArray.forEach(function (singleBook) {
    addToList(singleBook);
  });
}
const sortAscBtn = document.getElementById("sort-asc-btn");
const sortDescBtn = document.getElementById("sort-desc-btn");
const resetSortBtn = document.getElementById("sort-reset-btn");
// rusiuoja pagla kaina didejancia
sortAscBtn.addEventListener("click", function () {
  bookContainer.innerHTML = "";
  displaySortedBook("asc");
});
// rusiuoja pagal kaina mazejancia
sortDescBtn.addEventListener("click", function () {
  bookContainer.innerHTML = "";
  displaySortedBook("desc");
});

resetSortBtn.addEventListener("click", () => {
  location.reload();
});
// Editina knyga
bookContainer.addEventListener("click", editBook);
function editBook(event) {
  if (event.target.id === "edit-btn") {
    const bookItem = event.target.closest(".record-item");
    const bookId = bookItem.querySelector("#book-id-content").textContent;
    const book = BookArray.find((book) => book.id == bookId);
    const bookForm = document.getElementById("bookForm");
    bookForm.style.display = "block";

    // Uzkrauna inputus kuria knyga editina
    id = book.id - 1;
    url.value = book.url;
    title.value = book.title;
    author.value = book.author;
    year.value = book.year;
    price.value = book.price;
    category.value = book.category;

    // Istrina sena knyga ir atnaujina local storage
    BookArray = BookArray.filter((book) => book.id != bookId);
    bookItem.remove();

    // Pakeicia mygtuka
    addBtn.textContent = "Atnaujinti";
  }
}

// atnaujina knyga
function updateBook() {
  if (checkInputFields([url, title, author, year, price, category])) {
    const book = new Book(
      id,
      url.value,
      title.value,
      author.value,
      year.value,
      price.value,
      category.value
    );
    const bookIndex = BookArray.findIndex((book) => book.id == id);
    if (bookIndex !== -1) {
      BookArray[bookIndex] = book;
      localStorage.setItem("books", JSON.stringify(BookArray));
      clearInputFields();
      addToList(book);
    }
  }
}

// filtravimas knygu pagal autoriu ir kategorija
const categoryFilter = document.getElementById("category-filter");
const authorFilter = document.getElementById("author-filter");

function filterBooks() {
  const bookItems = document.querySelectorAll(".record-item");
  const selectedCategory = categoryFilter.value;
  const selectedAuthor = authorFilter.value;

  bookItems.forEach((bookItem) => {
    const bookCategory =
      bookItem.querySelector("#category-content").textContent;
    const bookAuthor = bookItem.querySelector("#name-content").textContent;

    if (
      (selectedCategory === "" || bookCategory === selectedCategory) &&
      (selectedAuthor === "" || bookAuthor === selectedAuthor)
    ) {
      bookItem.style.display = "block";
    } else {
      bookItem.style.display = "none";
    }
  });
}

categoryFilter.addEventListener("change", filterBooks);
authorFilter.addEventListener("change", filterBooks);
const burger = document.getElementById("burger");
const filterMenu = document.getElementsByClassName("filter-menu")[0];

burger.addEventListener("click", function () {
  this.classList.toggle("rotate");
  const h6 = document.getElementById("h6");
  const button = document.getElementById("add-book");
  const searchInput = document.getElementById("search-input");
  const author = document.getElementById("author-filter");
  const filter = document.getElementById("category-filter");
  if (filterMenu.style.display === "block") {
    filterMenu.style.display = "none";
    h6.style.display = "block";
    button.style.display = "block";
    searchInput.style.display = "block";
    author.style.display = "block";
    filter.style.display = "block";
  } else {
    filterMenu.style.display = "block";
    h6.style.display = "none";
    button.style.display = "none";
    searchInput.style.display = "none";
    author.style.display = "none";
    filter.style.display = "none";
  }
});
