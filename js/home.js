const logOutLink = document.getElementById("log-out")
const listTestsField = document.getElementById("test-list-field")
const assendingButton = document.getElementById("assending-button")
const descendingButton = document.getElementById("descending-button")
const prevButton = document.getElementById("prev")
const nextButton = document.getElementById("next")
const logoutLink = document.getElementById("log-out")

logoutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole")
  location.href = "../pages/Login.html"
})

function sortTestAmountAsscending() {
  const tests = getTestsFromLocalStorage()
  tests.sort((a, b) => a.playAmount - b.playAmount)
  localStorage.setItem("tests", JSON.stringify(tests))
  displayTests(currentPage)
}

function sortTestAmountDescending() {
  const tests = getTestsFromLocalStorage()
  tests.sort((a, b) => b.playAmount - a.playAmount)
  localStorage.setItem("tests", JSON.stringify(tests)) 
  displayTests(currentPage)
}

assendingButton.addEventListener("click", () => {
  sortTestAmountAsscending()
  assendingButton.classList.add("active")
  descendingButton.classList.remove("active")
})

descendingButton.addEventListener("click", () => {
  sortTestAmountDescending()
  descendingButton.classList.add("active")
  assendingButton.classList.remove("active")
})

logOutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole")
})

let currentPage = 1
const rowsPerPage = 8

function getTestsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tests")) || []
}

function displayTests(page) {
  const tests = getTestsFromLocalStorage()
  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const paginatedTests = tests.slice(start, end)

  listTestsField.innerHTML = ""

  paginatedTests.forEach(test => {
    const data = `
      <div class="test-container">
        <img src="${test.image}" alt="error-image-link">
        <div class="test-info">
          <p>${test.categoryEmoji}&nbsp;&nbsp;${test.categoryName}</p>
          <h1>${test.testName}</h1>
          <p>${test.numberOfQuestions} câu hỏi - ${test.playAmount} lượt chơi</p>
        </div>
        <button type="button" class="play-button" data-test-name="${test.testName}">Chơi</button>
      </div>`
    listTestsField.innerHTML += data
  })

  const playButtons = document.querySelectorAll(".play-button")
  playButtons.forEach(button => {
  button.addEventListener("click", () => {
    const testName = button.getAttribute("data-test-name")
    localStorage.setItem("currentTestName", testName)
    location.href = "test_page.html"
  })
})

  prevButton.disabled = page === 1 // Nếu trang hiện tại là 1 thì vô hiệu hoá
  nextButton.disabled = page === Math.ceil(tests.length / rowsPerPage) || tests.length === 0 // Nếu trang hiện tại là cuối cùng thì vô hiệu hoá hoặc không có bài test nào
  displayPageNumbers()
}

function displayPageNumbers() {
  const pageNumbers = document.getElementById("page-numbers")
  const tests = getTestsFromLocalStorage()
  const totalPages = Math.ceil(tests.length / rowsPerPage)
  pageNumbers.innerHTML = ""

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button")
    button.className = "page"
    button.innerHTML = `<span style="color: white; font-size: 16px; font-weight: 400;">${i}</span>`

    if (i === currentPage) {
      button.classList.add("active-page")
    }

    else if (i !== currentPage) {
      button.classList.add("inactive-page")
      button.innerHTML = `<span style="color: #0d6efd; font-size: 16px; font-weight: 400;">${i}</span>`
    }

    button.addEventListener("click", () => {
      currentPage = i
      displayTests(currentPage)
      displayPageNumbers() 
    })

    pageNumbers.appendChild(button)
  }
}

displayTests(currentPage)