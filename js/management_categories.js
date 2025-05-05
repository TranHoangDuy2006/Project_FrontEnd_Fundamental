const addCategoryButton = document.querySelector("#add-category-button")
const saveCategoryButton = document.querySelector("#save-category-button")
const nameCategory = document.querySelector("#category-name")
const emojiCategory = document.querySelector("#category-emoji")
const editCategoryName = document.querySelector("#edit-category-name")
const editCategoryEmoji = document.querySelector("#edit-category-emoji")
const nameStatus = document.querySelector("#category-name-status")
const emojiStatus = document.querySelector("#category-emoji-status")
const listCategory = document.querySelector("#category-table-body")
const prevButton = document.getElementById("prev")
const nextButton = document.getElementById("next")
const confirmDeleteButton = document.getElementById("delete-category-button")
const addCategoryModal = document.getElementById("open-add-category-modal")
const logOutLink = document.getElementById("log-out")
const editTestButton = document.querySelectorAll(".edit-test-button")
const createCategoryToast = document.getElementById("create-category-toast")
const deleteCategoryToast = document.getElementById("delete-category-toast")

logOutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole") 
})

let findCategoryId = null
let currentPage = 1
const rowsPerPage = 8

function getCategoryFromLocalStorage() {
  return JSON.parse(localStorage.getItem("categories")) || []
}

function saveCategoryToLocalStorage(name, emoji) {
  const categories = getCategoryFromLocalStorage()
  const newCategory = {
    id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
    categoryName: name,
    categoryEmoji: emoji
  }
  
  categories.push(newCategory)
  localStorage.setItem("categories", JSON.stringify(categories))
}

function getCategoryNameFromLocalStorage() {
  let categoryList = JSON.parse(localStorage.getItem("categories")) || []
  return categoryList.map(c => c.categoryName)
}

function deleteCategory(categoryId) {
  const categories = getCategoryFromLocalStorage()
  const updatedCategories = categories.filter(cate => cate.id !== categoryId)
  localStorage.setItem("categories", JSON.stringify(updatedCategories))
  displayCategories(currentPage)
}

function updateIdCategories() {
  const categories = getCategoryFromLocalStorage()
  categories.length > 0 ? categories[categories.length - 1].id + 1 : 1
  localStorage.setItem("categories", JSON.stringify(categories))
}

confirmDeleteButton.addEventListener("click", () => {
  if (findCategoryId !== null) {
    let categories = getCategoryFromLocalStorage()
    categories = categories.filter(cate => cate.id !== findCategoryId)

    categories = categories.map((cate, index) => ({
      ...cate,
      id: index + 1
    }))

    localStorage.setItem("categories", JSON.stringify(categories))
    
    const deleteModal = document.getElementById("delete-test-modal")
    const modal = bootstrap.Modal.getInstance(deleteModal)
    modal.hide()

    setTimeout(() => {
      const toast = new bootstrap.Toast(deleteCategoryToast, ({ delay: 1000 }))
      toast.show()
    }, 200)

    displayCategories(currentPage)
    findCategoryId = null
  }
})

function attachDeleteAction() {
  const deleteButtons = document.querySelectorAll(".delete-category-button")
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = parseInt(button.getAttribute("data-id"))
      findCategoryId = categoryId
    })
  })
}

function isEmoji(input) {
  const emojiRegex = /\p{Extended_Pictographic}/u
  return emojiRegex.test(input)
}

nameCategory.addEventListener("change", () => {
  nameStatus.innerHTML = ""
  nameCategory.style.border = "1px solid #E4E4E7"
  nameCategory.style.outline = "none"
})

emojiCategory.addEventListener("change", () => {
  emojiStatus.innerHTML = ""
  emojiCategory.style.border = "1px solid #E4E4E7"
  emojiCategory.style.outline = "none"
})

addCategoryButton.addEventListener("click", () => {
  let isValid = true
  const categoryListName = getCategoryNameFromLocalStorage()
  nameStatus.innerHTML = ""
  emojiStatus.innerHTML = ""

  if (nameCategory.value.trim() === "") {
    nameStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Tên danh mục không được để trống!</span>`
    nameCategory.style.border = "none"
    nameCategory.style.outline = "2px solid red"
    isValid = false
  }

  else if (categoryListName.includes(nameCategory.value.trim())) {
    nameStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Tên danh mục đã tồn tại, vui lòng sử dụng tên danh mục khác!</span>`
    nameCategory.style.border = "none"
    nameCategory.style.outline = "2px solid red"
    isValid = false
  }

  else if (nameCategory.value.trim() === "" || nameCategory.value.trim().length < 5) {
    nameStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Tên danh mục phải có ít nhất 5 ký tự!</span>`
    nameCategory.style.border = "none"
    nameCategory.style.outline = "2px solid red"
    isValid = false
  }
  
  if (emojiCategory.value.trim() === "") {
    emojiStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Emoji của danh mục không được để trống!</span>`
    emojiCategory.style.border = "none"
    emojiCategory.style.outline = "2px solid red"
    isValid = false
  }

  else if (!isEmoji(emojiCategory.value.trim())) {
    emojiStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Emoji không hợp lệ!</span>`
    emojiCategory.style.border = "none"
    emojiCategory.style.outline = "2px solid red"
    isValid = false
  }

  if (isValid) {
    saveCategoryToLocalStorage(nameCategory.value.trim(), emojiCategory.value.trim())
    const modalElement = document.getElementById("open-add-category-modal")
    const modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide()
    nameCategory.value = ""
    emojiCategory.value = ""
    displayCategories(currentPage)
    const toast = new bootstrap.Toast(createCategoryToast, { delay: 2000 })
    toast.show()
  }
})

addCategoryModal.addEventListener("hidden.bs.modal", () => {
  nameCategory.value = ""
  emojiCategory.value = ""
  nameStatus.innerHTML = ""
  emojiStatus.innerHTML = ""
  nameCategory.style.border = ""
  nameCategory.style.outline = ""
  emojiCategory.style.border = ""
  emojiCategory.style.outline = ""
})

saveCategoryButton.addEventListener("click", () => {
  const categories = getCategoryFromLocalStorage()
  const index = categories.findIndex(c => c.id === editingCategoryId)
  if (index !== -1) {
    categories[index].categoryName = editCategoryName.value.trim()
    categories[index].categoryEmoji = editCategoryEmoji.value.trim()
    localStorage.setItem("categories", JSON.stringify(categories))
    displayCategories(currentPage)
    const editModal = document.getElementById("edit-category-modal")
    const modal = bootstrap.Modal.getInstance(editModal)
    modal.hide()
  }
})

function attachEditAction() {
  const editButtons = document.querySelectorAll(".edit-category-button")
  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = parseInt(button.getAttribute("data-id"))
      const categories = getCategoryFromLocalStorage()
      const category = categories.find(c => c.id === categoryId)
      if (category) {
        editCategoryName.value = category.categoryName
        editCategoryEmoji.value = category.categoryEmoji
        editingCategoryId = categoryId
      }
    })
  })
}

function displayCategories(page) {
  const categories = getCategoryFromLocalStorage()
  if (categories === null) return

  const totalPages = Math.ceil(categories.length / rowsPerPage)

  if (page > totalPages && totalPages > 0) {
    currentPage = totalPages
    return displayCategories(currentPage)
  }

  const start = (page - 1) * rowsPerPage
  const end = start + rowsPerPage
  const paginatedCategories = categories.slice(start, end)

  listCategory.innerHTML = ""

  paginatedCategories.forEach(cate => {
    const rowData = `
      <tr>
        <td>${cate.id}</td>
        <td>${cate.categoryEmoji}&nbsp;&nbsp;${cate.categoryName}</td>
        <td>
          <button class="edit-category-button" data-id="${cate.id}" data-bs-toggle="modal" data-bs-target="#edit-category-modal">Sửa</button>
          <button class="delete-category-button" data-id="${cate.id}" data-bs-toggle="modal" data-bs-target="#delete-test-modal" style="margin-left: 5px;">Xoá</button>
        </td>
      </tr>`
    listCategory.innerHTML += rowData
  })

  attachEditAction()
  attachDeleteAction()

  prevButton.disabled = page === 1 // Nếu trang hiện tại là 1 thì vô hiệu hoá
  nextButton.disabled = page === Math.ceil(categories.length / rowsPerPage) || categories.length === 0 // Nếu trang hiện tại là cuối cùng thì vô hiệu hoá hoặc không có danh mục nào
  displayPageNumbers()
}

function displayPageNumbers() {
  const pageNumbers = document.getElementById("page-numbers")
  const categories = getCategoryFromLocalStorage()
  const totalPages = Math.ceil(categories.length / rowsPerPage)
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
      displayCategories(currentPage)
      displayPageNumbers() 
    })

    pageNumbers.appendChild(button)
  }
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--
    displayCategories(currentPage)
  }
})

nextButton.addEventListener("click", () => {
  const categories = getCategoryFromLocalStorage()
  if (currentPage < Math.ceil(categories.length / rowsPerPage)) {
    currentPage++
    displayCategories(currentPage)
  }
})

displayCategories(currentPage)
