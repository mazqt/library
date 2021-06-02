class Book {
  constructor(title, author, page_count, read) {
    this.title = title;
    this.author = author;
    this.page_count = parseInt(page_count);
    if (read == "true") {
      this.read = true;
    } else {
      this.read = false;
    }
  }

  createBookItem() {
    let bookDesc = this.title + " is a book written by " + this.author + ", it clocks in at " + this.page_count + " pages long.";
    if (this.read) {
      bookDesc += " I have read it."
    } else {
      bookDesc += " I have not yet read it"
    }
    return bookDesc;
  }

}

class Library {

  constructor(listOfBooks) {
    this.books = listOfBooks
  }

  set books(listOfBooks) {
    this._books = listOfBooks
  }

  get books() {
    return this._books;
  }

  addBookToLibrary(book) {
    this.books.push(book);
  }

  printLibrary() {
    this.books.forEach(function (book, index) {
      let bookDesc = book.createBookItem()
      let item = createListItem(bookDesc, index);
      bookList.appendChild(item);
    })
  }

  deleteBook(index) {
    if (storageAvailable('localStorage')) {
      this.books.splice(index, 1);
      localStorage.setItem("mylibrary", JSON.stringify(this.books));
      location.reload();
    } else {
      delete this.books[index];
    }
  }

  toggleRead(index) {
    if (this.books[index].read) {
      this.books[index].read = false;
    } else {
      this.books[index].read = true;
    }
    if (storageAvailable('localStorage')) {
      localStorage.setItem("mylibrary", JSON.stringify(this.books))
      location.reload();
    }
  }

}

const book1 = new Book("Dune", "Frank Herbert", "412", "true");
const book2 = new Book("Dune Messiah", "Frank Herbert", "256", "false");
let myLibrary = new Library([book1, book2]);


if (storageAvailable('localStorage')) {
  if (localStorage.getItem("mylibrary") === null) {
    localStorage.setItem("mylibrary", JSON.stringify(myLibrary.books));
    }
    console.log(myLibrary)
    myBooks = JSON.parse(localStorage.getItem("mylibrary"));
    myLibrary = myBooks.map(book => {
      return bookObj = Object.assign(new Book, book);
    })
    myLibrary = new Library(myLibrary);
    console.log(myLibrary);
} else {
    const book1 = new Book("Dune", "Frank Herbert", "412", "true");
    const book2 = new Book("Dune Messiah", "Frank Herbert", "256", "false");
    myLibrary = new Library([book1, book2]);
}

bookList = document.createElement("ul");


//Did not put this within either function as it takes data from both and is just working on the dom. I could've made a class for display or the like but I chose to just leave it exposed.
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
    myLibrary.toggleRead(event.target.parentElement.getAttribute("data-index"));
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
    myLibrary.deleteBook(event.target.parentElement.getAttribute("data-index"));
    event.target.parentElement.parentElement.removeChild(event.target.parentElement);
  })
  item.appendChild(deleteButton)
  return item
}

myLibrary.printLibrary();

const container = document.getElementById("books")
const form = document.forms[0]

container.appendChild(bookList);

document.getElementById("formToggle").onclick = function () {
  document.getElementById("bookForm").classList.toggle("show");
};

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let formData = new FormData(this);
  let newBook = new Book(formData.get("title"), formData.get("author"), formData.get("page_count"), formData.get("read"));
  myLibrary.addBookToLibrary(newBook);
  console.log(myLibrary);
  if (storageAvailable('localStorage')) {
    localStorage.setItem("mylibrary", JSON.stringify(myLibrary.books))
    location.reload();
  }
});

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
