const container = document.querySelector('#books');
const form = document.forms[0];
let myLibrary = [{
  "title": "Dune",
  "author": "Frank Herbert",
  "page_count": 412,
  "read": true
}, {
  "title": "Dune Messiah",
  "author": "Frank Herbert",
  "page_count": 256,
  "read": false
}];

if (storageAvailable('localStorage')) {
  if (localStorage.getItem("library") === null) {
    localStorage.setItem("library", JSON.stringify(myLibrary));
  }
  myLibrary = JSON.parse(localStorage.getItem("library"));
  console.log(myLibrary);
} else {
  myLibrary = [{
    "title": "Dune",
    "author": "Frank Herbert",
    "page_count": 412,
    "read": true
  }, {
    "title": "Dune Messiah",
    "author": "Frank Herbert",
    "page_count": 256,
    "read": false
  }];
}



function Book(title, author, page_count, read) {
  this.title = title;
  this.author = author;
  this.page_count = parseInt(page_count);
  if (read == "true") {
    this.read = true;
  } else {
    this.read = false;
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book);
}

const bookList = document.createElement("ul");

function printLibrary() {
  myLibrary.forEach(function (book, index) {
    let bookDesc = createBookItem(book)
    let item = createListItem(bookDesc, index);
    bookList.appendChild(item);
  })
}

function createBookItem(book) {
  let bookDesc = book.title + " is a book written by " + book.author + ", it clocks in at " + book.page_count + " pages long.";
  if (book.read) {
    bookDesc += " I have read it."
  } else {
    bookDesc += " I have not yet read it"
  }
  return bookDesc;
}

function createListItem(bookDesc, index) {
  let item = document.createElement('li');
  item.setAttribute("data-index", index)
  item.id = index
  item.textContent = bookDesc;
  let readButton = document.createElement("input");
  readButton.type = "button";
  readButton.classList.add("toggleRead");
  readButton.value = "Change read status";
  readButton.addEventListener('click', event => {
    toggleRead(event.target.parentElement.getAttribute("data-index"));
    let toggledText = createListItem(createBookItem(myLibrary[index]), index);
    let currentText = document.getElementById(index)
    currentText.parentNode.replaceChild(toggledText, currentText);
  })
  item.appendChild(readButton);
  let deleteButton = document.createElement("input");
  deleteButton.type = "button";
  deleteButton.classList.add("delete");
  deleteButton.value = "Remove from library";
  deleteButton.addEventListener('click', event => {
    deleteBook(event.target.parentElement.getAttribute("data-index"));
    event.target.parentElement.parentElement.removeChild(event.target.parentElement);
  })
  item.appendChild(deleteButton)
  return item
}

printLibrary();

container.appendChild(bookList);

document.getElementById("formToggle").onclick = function () {
  document.getElementById("bookForm").classList.toggle("show");
};

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  let newBook = new Book(formData.get("title"), formData.get("author"), formData.get("page_count"), formData.get("read"));
  addBookToLibrary(newBook);
  if (storageAvailable('localStorage')) {
    localStorage.setItem("library", JSON.stringify(myLibrary))
    location.reload();
  }
  let bookDesc = createBookItem(newBook);
  let item = createListItem(bookDesc, myLibrary.length - 1)
  bookList.appendChild(item);
  this.reset()
  document.getElementById("bookForm").classList.toggle("show");
});

function deleteBook(index) {
  if (storageAvailable('localStorage')) {
    myLibrary.splice(index, 1);
    localStorage.setItem("library", JSON.stringify(myLibrary))
    location.reload();
  } else {
    delete myLibrary[index];
  }
}

function toggleRead(index) {
  if (myLibrary[index].read) {
    myLibrary[index].read = false;
  } else {
    myLibrary[index].read = true;
  }
  if (storageAvailable('localStorage')) {
    localStorage.setItem("library", JSON.stringify(myLibrary))
    location.reload();
  }
}

function storageAvailable(type) {
  var storage;
  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch (e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (storage && storage.length !== 0);
  }
}
