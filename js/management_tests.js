const logOutLink = document.getElementById("log-out")
const listTests = document.querySelector("#tests-table")
const prevButton = document.getElementById("prev")
const nextButton = document.getElementById("next")
const addTestButton = document.getElementById("add-test-button")
const confirmDeleteTestButton = document.getElementById("delete-test-confirm-button")
const deleteTestModal = document.getElementById("delete-test-modal")
const searchTestField = document.getElementById("search-test-name")
const sortTestOption = document.getElementById("test")
const logo = document.getElementById("logo")
const deleteTestToast = document.getElementById("delete-test-toast")

let currentPage = 1
const rowsPerPage = 8
let findTestId = null
let filteredTests = null

logOutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole")
})

addTestButton.addEventListener("click", () => {
  location.href = "../pages/Create_Test.html"
})

logo.addEventListener("click", () => {
  location.href = "../pages/Home.html"
})

function sortTests() {
  filteredTests = filteredTests || getTestsFromLocalStorage()
  const sortOption = sortTestOption.value

  if (sortOption === "nameTestASC") {
    filteredTests.sort((a, b) => a.testName.localeCompare(b.testName))
  } else if (sortOption === "nameTestDES") {
    filteredTests.sort((a, b) => b.testName.localeCompare(a.testName))
  } else if (sortOption === "timeTestASC") {
    filteredTests.sort((a, b) => a.playTime - b.playTime)
  } else if (sortOption === "timeTestDES") {
    filteredTests.sort((a, b) => b.playTime - a.playTime)
  }

  displayTests(currentPage)
}

sortTestOption.addEventListener("change", () => {
  sortTests()
  currentPage = 1
})

function searchTestByName() {
  const tests = getTestsFromLocalStorage()
  const searchTestName = searchTestField.value.trim().toLowerCase()
  
  if (searchTestName === "") {
    filteredTests = null
  } else {
    filteredTests = tests.filter(test => test.testName.toLowerCase().includes(searchTestName))
  }

  currentPage = 1
  displayTests(currentPage)
}

searchTestField.addEventListener("keydown", function(e) {
  if(e.key === "Enter") {
    searchTestByName()
  }
})

searchTestField.addEventListener("blur", function(e) {
  searchTestByName()
})

function getTestsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tests")) || []
}

function deleteTest(testId) {
  const tests = getTestsFromLocalStorage()
  const updatedTests = tests
    .filter(test => test.id !== testId)              
    .sort((a, b) => a.id - b.id)                     
    .map((test, index) => ({                         
      ...test,
      id: index + 1
    }))

  localStorage.setItem("tests", JSON.stringify(updatedTests))
  displayTests(currentPage)
}

confirmDeleteTestButton.addEventListener("click", () => {
  if (findTestId !== null) {
    deleteTest(findTestId)
    const deleteTestConfirmModal = deleteTestModal
    const modal = bootstrap.Modal.getInstance(deleteTestConfirmModal)
    modal.hide()
    const toast = new bootstrap.Toast(deleteTestToast, ({ delay: 1500 }))
    toast.show()
    findTestId = null
  }
})

function attachDeleteAction() {
  const deleteTestButtons = document.querySelectorAll(".delete-test-button")
  deleteTestButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const testId = parseInt(button.getAttribute("data-id"))
      findTestId = testId
    })
  })
}

function attachEditTestAction() {
  const editTestButtons = document.querySelectorAll(".edit-test-button")
  editTestButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const testId = parseInt(button.getAttribute("data-id"))
      localStorage.setItem("editTestId", testId)
      location.href = "../pages/Create_Test.html"
    })
  })
}

function displayTests(page) {
  const tests = filteredTests || getTestsFromLocalStorage()

  if (tests === null) return

  const totalPages = Math.ceil(tests.length / rowsPerPage)

  if (page > totalPages && totalPages > 0) {
    currentPage = totalPages
    return displayTests(currentPage)
  }

  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const paginatedTests = tests.slice(start, end)

  listTests.innerHTML = ""

  paginatedTests.forEach(test => {
    const rowData = `
      <tr>
        <td>${test.id}</td>
        <td>${test.testName}</td>
        <td>${test.categoryEmoji}&nbsp;&nbsp;${test.categoryName}</td>
        <td>${test.numberOfQuestions}</td>
        <td>${parseInt(test.playTime)} phút</td>
        <td>
          <button class="edit-test-button" data-id="${test.id}" data-bs-toggle="modal" data-bs-target="#edit-test-modal">Sửa</button>
          <button class="delete-test-button" data-id="${test.id}" data-bs-toggle="modal" data-bs-target="#delete-test-modal" style="margin-left: 5px;">Xoá</button>
      </tr>`
    listTests.innerHTML += rowData
  })

  attachDeleteAction()
  attachEditTestAction()

  prevButton.disabled = page === 1 // Nếu trang hiện tại là 1 thì vô hiệu hoá
  nextButton.disabled = page === Math.ceil(tests.length / rowsPerPage) || tests.length === 0 // Nếu trang hiện tại là cuối cùng thì vô hiệu hoá hoặc không có bài test nào
  displayPageNumbers()
}

function displayPageNumbers() {
  const pageNumbers = document.getElementById("page-numbers")
  const tests = filteredTests || getTestsFromLocalStorage()
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

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    displayTests(currentPage)
  }
})

nextButton.addEventListener("click", () => {
  const tests = getTestsFromLocalStorage()
  if (currentPage < Math.ceil(tests.length / rowsPerPage)) {
    currentPage++
    displayTests(currentPage)
  }
})

displayTests(currentPage)