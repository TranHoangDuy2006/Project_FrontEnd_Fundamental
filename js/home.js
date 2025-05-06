const listTestsField = document.getElementById("test-list-field")
const assendingButton = document.getElementById("assending-button")
const descendingButton = document.getElementById("descending-button")
const prevButton = document.getElementById("prev")
const nextButton = document.getElementById("next")
const logOutLink = document.getElementById("log-out")
const searchTestField = document.getElementById("search-test-field")
const playAmountToast = document.getElementById("play-amount-toast")
const loginToPlayTest = document.getElementById("login-to-play-test")
const randomButton = document.getElementById("random-button")
const searchIcon = document.getElementById("search-icon")
const testLink = document.getElementById("test-link")

if (!sessionStorage.getItem("isLogged") && !localStorage.getItem("isLogged")) {
  location.href = "../pages/Login.html"
}

searchIcon.addEventListener("click", () => {
  searchTestField.focus()
})

function checkSessionUser() {
  const isLogged = sessionStorage.getItem("isLogged")
  const currentUserRole = sessionStorage.getItem("currentUserRole")

  if (isLogged === "true" || currentUserRole !== null) {
    const Toast = new bootstrap.Toast(loginToPlayTest, { delay: 2000 })
    Toast.show()
    setTimeout(() => {
      location.href = "../pages/Login.html"
    },2500)
    return false
  }
  return true
}

function checkRole() {
  const currentUserRole = localStorage.getItem("currentUserRole")
  const isLogged = localStorage.getItem("isLogged")
  if (currentUserRole === "admin" && isLogged === "true") {
    testLink.style.display = "inline-block"
  } else {
    testLink.style.display = "none"
  }
}

checkRole()

randomButton.addEventListener("click", () => {
  const tests = getTestsFromLocalStorage()
  if (!tests || tests.length === 0) return

  const playableTests = tests.filter(test => test.playAmount > 0)
  if (playableTests.length === 0) {
    const toast = new bootstrap.Toast(playAmountToast, { delay: 2000 }) 
    toast.show()
    return
  }

  const randomIndex = Math.floor(Math.random() * playableTests.length)
  const randomTest = playableTests[randomIndex]

  localStorage.setItem("currentTestName", randomTest.testName)

  const session = checkSessionUser()
  if (!session) return

  setTimeout(() => {
    location.href = "test_page.html"
  }, 1000)
})

document.addEventListener("DOMContentLoaded", (defaultSort))

function defaultSort() {
  const tests = getTestsFromLocalStorage()
  tests.sort((a, b) => a.id - b.id)
  localStorage.setItem("tests", JSON.stringify(tests))
  displayTests(currentPage)
}

searchTestField.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    listTestsField.innerHTML = ""
    const searchText = searchTestField.value
    const tests = getTestsFromLocalStorage()
    const filteredTests = tests.filter(test => test.testName.toLowerCase().includes(searchText.toLowerCase()))
    renderTest(filteredTests)
  }
})

searchTestField.addEventListener("change", function() {
  listTestsField.innerHTML = ""
    const searchText = searchTestField.value
    const tests = getTestsFromLocalStorage()
    const filteredTests = tests.filter(test => test.testName.toLowerCase().includes(searchText.toLowerCase()))
    renderTest(filteredTests)
})

logOutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole")
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

function renderTest(tests) {
  listTestsField.innerHTML = ""

  tests.forEach(test => {
    const data = `
      <div class="test-container">
        <img src="${test.image}" alt="&nbsp;&nbsp;&nbsp;error-image-link">
        <div class="test-info">
          <p>${test.categoryEmoji}&nbsp;&nbsp;${test.categoryName}</p>
          <h1>${test.testName}</h1>
          <p>${test.numberOfQuestions} câu hỏi - ${test.playAmount} lượt chơi</p>
        </div>
        <button type="button" class="play-button" id="${test.id}" data-test-name="${test.testName}"><i class="fa-solid fa-gamepad"></i>&nbsp;&nbsp;Chơi</button>
      </div>`
    listTestsField.innerHTML += data
  })

  const playButtons = document.querySelectorAll(".play-button")
  playButtons.forEach(button => {
  button.addEventListener("click", () => {
    const session1 = checkSessionUser()
    if (!session1) return
    const testName = button.getAttribute("data-test-name")
    const tests = getTestsFromLocalStorage()
    const selectedTest = tests.find(test => test.testName === testName)
    selectedTest.playAmount--
    localStorage.setItem("tests", JSON.stringify(tests))
    if (selectedTest && selectedTest.playAmount > 0) {
      localStorage.setItem("currentTestName", testName)
      setTimeout(() => {
        location.href = "test_page.html"
      , 1500})
    }
    else {
      const toast = new bootstrap.Toast(playAmountToast, { delay: 2000 }) 
      toast.show()
    }
  })
})
}

function displayTests(page) {
  const tests = getTestsFromLocalStorage()
  if (tests === null) return

  const totalPages = Math.ceil(tests.length / rowsPerPage)

  if (page > totalPages && totalPages > 0) {
    currentPage = totalPages
    return displayTests(currentPage)
  }

  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const paginatedTests = tests.slice(start, end)

  renderTest(paginatedTests)

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