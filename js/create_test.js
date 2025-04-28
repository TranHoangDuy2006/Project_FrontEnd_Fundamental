const addQuestionButton = document.querySelector("#add-question-button")
const addQuestion = document.querySelector("#add-question")
const firstAnswer = document.querySelector("#answer-question-1")
const secondAnswer = document.querySelector("#answer-question-2")
const thirdAnswer = document.querySelector("#answer-question-3")
const fourthAnswer = document.querySelector("#answer-question-4")

const editAnswer = document.querySelector("#edit-answer-question-1")
const editAnswer2 = document.querySelector("#edit-answer-question-2")
const editAnswer3 = document.querySelector("#edit-answer-question-3")
const editAnswer4 = document.querySelector("#edit-answer-question-4")

const categoryList = document.querySelector("#category-list")
const saveButton = document.querySelector("#save-button")
const editSaveButton = document.querySelector("#edit-save-button")
const editQuestionNameStatus = document.querySelector("#edit-question-name-status")
const editCheckAnswerStatus = document.querySelector("#edit-check-answer-status")
const questionTableBody = document.querySelector("#questions-table-body")
const questionNameStatus = document.querySelector("#question-name-status")
const checkAnswerStatus = document.querySelector("#check-answer-status")
const addQuestionModal = document.getElementById("add-question-modal")
const editQuestionModal = document.getElementById("edit-questions-modal")
const confirmDeleteButton = document.getElementById("delete-question-button")
const addMoreAnswerButton = document.getElementById("add-more-answer-button")
const answersBodyField = document.getElementById("answers-body-field")
const saveTestButton = document.getElementById("end-save-button")
const logOutLink = document.getElementById("log-out")

const testName = document.querySelector("#test-name")
const testNameStatus = document.querySelector("#test-name-status")
const testTime = document.querySelector("#test-time")
const categoryName = document.querySelector("category-list")
const editQuestion = document.getElementById("edit-question")

const createTestToast = document.getElementById("create-test-toast")
const createQuestionToast = document.getElementById("create-question-toast")
const deleteQuestionToast = document.getElementById("delete-question-toast")
const listAnswers = document.querySelectorAll(".form-control")
const listCheckBox = document.querySelectorAll('input[type="checkbox"]')
const title = document.getElementById("title")
const testImageLink = document.querySelector("#test-image")

let findQuestionId = null

testName.addEventListener("input", () => {
  testNameStatus.innerHTML = ""
})

function validateTime() {
  let value = parseInt(testTime.value)
  
  if (isNaN(value) || value < 15) {
    testTime.value = 15
  }
  else if (value > 60) {
    testTime.value = 60
  }
}

testTime.addEventListener("change", validateTime)
testTime.addEventListener("input", validateTime)

addQuestionButton.addEventListener("click", () => {
  testNameStatus.innerHTML = ""
  listAnswers.forEach(answer => {
    answer.value = ""
  })
  listCheckBox.forEach(checkBox => {
    checkBox.checked = false
  })
})

addQuestion.addEventListener("change", () => {
  addQuestion.style.outline = ""
  questionNameStatus.innerHTML = ""
})

logOutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole")
})

function getTestsFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tests")) || []
}

function attachEditAction() {
  const editButtons = document.querySelectorAll(".edit-question-button")
  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      const questionId = parseInt(button.getAttribute("data-id"))
      const questions = getQuestionsFromLocalStorage()
      const question = questions.find(q => q.id === questionId)

      if (question) {
        const editQuestionInput = document.querySelector("#edit-question")
        editQuestionInput.value = question.questionName

        const answerInputs = [
          { input: editAnswer, checkbox: editAnswer.previousElementSibling.querySelector("input[type='checkbox']") },
          { input: editAnswer2, checkbox: editAnswer2.previousElementSibling.querySelector("input[type='checkbox']") },
          { input: editAnswer3, checkbox: editAnswer3.previousElementSibling.querySelector("input[type='checkbox']") },
          { input: editAnswer4, checkbox: editAnswer4.previousElementSibling.querySelector("input[type='checkbox']") },
        ]

        answerInputs.forEach((item, index) => {
          const answer = question.answers[index]
          if (answer) {
            item.input.value = answer.text
            item.checkbox.checked = answer.isCorrect
          } else {
            item.input.value = ""
            item.checkbox.checked = false
          }
        })

        findQuestionId = questionId
      }
    })
  })
}

function renderQuestionTable() {
    const listQuestion = getQuestionsFromLocalStorage()
    title.innerHTML = "Tạo bài test"
  
    if (questionTableBody) {
      questionTableBody.innerHTML = ""
      
      listQuestion.forEach(question => {     
        const rowData = `
          <td>${question.id}</td>
          <td>${question.questionName}</td>
          <td>
            <button type="button" class="edit-question-button" id="edit-question-answer-button" data-id="${question.id}" data-bs-toggle="modal" data-bs-target="#edit-questions-modal">Sửa</button>
            <button class="delete-question-button" data-id="${question.id}" data-bs-toggle="modal" data-bs-target="#delete-question-modal" style="margin-left: 5px;">Xoá</button>
          </td>
        `
        questionTableBody.innerHTML += rowData
        attachDeleteAction()
        attachEditAction()
      })
    }
}

renderQuestionTable()

function deleteQuestion(questionId) {
  const questions = getQuestionsFromLocalStorage()
  const updatedQuestions = questions.filter(ques => ques.id !== questionId)
  localStorage.setItem("questions", JSON.stringify(updatedQuestions))
  renderQuestionTable()
}

confirmDeleteButton.addEventListener("click", () => {
  if (findQuestionId !== null) {
    deleteQuestion(findQuestionId)
    const deleteQuestionModal = document.getElementById("delete-question-modal")
    const modal = bootstrap.Modal.getInstance(deleteQuestionModal)
    modal.hide()
    findQuestionId = null
    const toast = new bootstrap.Toast(deleteQuestionToast, { delay: 2000 }) 
    toast.show()
  }
})

function clearForm() {
  addQuestion.value = ""
  questionNameStatus.innerHTML = ""
  checkAnswerStatus.innerHTML = ""
  addQuestion.style.border = ""
  addQuestion.style.outline = ""
}

function clearEditForm() {
  editQuestion.value = ""
  editQuestionNameStatus.innerHTML = ""
  editCheckAnswerStatus.innerHTML = ""
  editQuestion.style.border = ""
  editQuestion.style.outline = ""
}

function attachDeleteAction() {
    const deleteQuestionButtons = document.querySelectorAll(".delete-question-button")
    deleteQuestionButtons.forEach((but) => {
      but.addEventListener("click", () => {
        const questionId = parseInt(but.getAttribute("data-id"))
        findQuestionId = questionId
      })
    })
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem("questions")) || []
}

function getCategoryNameFromLocalStorage() {
  let category = JSON.parse(localStorage.getItem("categories")) || []
  return category.map(c => {
    return {
      categoryName: c.categoryName,
      categoryEmoji: c.categoryEmoji
    }
  })
}

function renderCategoryList() {
  const categories = getCategoryNameFromLocalStorage();
  categoryList.innerHTML = categories.map(c => `
    <option value='${JSON.stringify(c)}'>
      ${c.categoryEmoji} ${c.categoryName}
    </option>
  `).join("")
}

renderCategoryList()

function saveTestsToLocalStorage() {
  const tests = getTestsFromLocalStorage()
  const questions = getQuestionsFromLocalStorage()
  const name = document.querySelector("#test-name").value
  const time = document.querySelector("#test-time").value
  const imageLink = document.querySelector("#test-image").value
  const selectedCategory = JSON.parse(categoryList.value)
  
  const newTest = {
      id: tests.length > 0 ? tests[tests.length - 1].id + 1 : 1,
      testName: name,
      categoryName: selectedCategory.categoryName,
      categoryEmoji: selectedCategory.categoryEmoji,
      image: imageLink,
      playTime: time,
      playAmount: 3,
      numberOfQuestions: questions.length,
      questions: questions.map(q => {
          return {
              content: q.questionName,
              answers: q.answers.map(a => {
                  return {
                      answer: a.text,
                      isCorrected: a.isCorrect
                  }
              })
          }
      })
  }
  
  tests.push(newTest)
  localStorage.setItem("tests", JSON.stringify(tests))
  
  localStorage.removeItem("questions")
  
  testName.value = ""
  testTime.value = "15"
  testImageLink.value = ""
  questionTableBody.innerHTML = ""
}

saveTestButton.addEventListener("click", () => {
  testNameStatus.innerHTML = ""
  const questions = getQuestionsFromLocalStorage()
  const tests = getTestsFromLocalStorage()
  let valid = true
  if (testName.value.trim() === "") {
    testNameStatus.innerHTML = `<span style="color: red; display: block; margin: 15px 0 0 15px;">Tên bài test không được để trống!</span>`
    valid = false
  }

  else if (tests.some(test => test.testName.toLowerCase() === testName.value.trim().toLowerCase())) {
    testNameStatus.innerHTML = `<span style="color: red; display: block; margin: 15px 0 0 15px;">Tên bài test đã tồn tại, vui lòng sử dụng tên bài test khác!</span>`
    valid = false
  }

  else if (questions.length < 1) {
    testNameStatus.innerHTML = `<span style="color: red; display: block; margin: 15px 0 0 15px;">Phải có ít nhất một câu hỏi cho bài test!</span>`
    valid = false
  }

  else if (testImageLink.value.trim() === "") {
    testNameStatus.innerHTML = `<span style="color: red; display: block; margin: 15px 0 0 15px;">Link ảnh bài test không được để trống!</span>`
    valid = false
  }

  if (valid) {
    saveTestsToLocalStorage()
    const toast = new bootstrap.Toast(createTestToast, { delay: 2000 }) 
    toast.show()

    testName.value = ""
    testTime.value = "15"
    testImageLink.value = ""
    categoryList.value = categoryList[0].value
  }
})

function saveQuestionToLocalStorage(questionName, answers) {
  const listQuestion = getQuestionsFromLocalStorage()
  const newQuestion = {
      id: listQuestion.length > 0 ? listQuestion[listQuestion.length - 1].id + 1 : 1,
      questionName: questionName,
      answers: answers
  }

  listQuestion.push(newQuestion)
  localStorage.setItem("questions", JSON.stringify(listQuestion))
}

saveButton.addEventListener("click", () => {
  questionNameStatus.innerHTML = ""
  let check = true

  if (addQuestion.value.trim() === "") {
      questionNameStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Câu hỏi không được để trống!</span>`
      addQuestion.style.border = "none"
      addQuestion.style.outline = "1px solid red"
      check = false
  }

  const answers = []
  const answersGroup = document.querySelectorAll("#answers-body-field .input-group")

  answersGroup.forEach(group => {
    const checkBox = group.querySelector("input[type='checkbox']")
    const answerInput = group.querySelector("input.form-control")

    if (answerInput && answerInput.value.trim() !== "") {
      answers.push({
          text: answerInput.value.trim(),
          isCorrect: checkBox.checked
      })
    }
  })

  if (answers.length < 2) {
    checkAnswerStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Câu hỏi phải có ít nhất hai đáp án để lựa chọn!</span>`
    check = false
  }

  const oneCorrect = answers.some(ans => ans.isCorrect)
  if (oneCorrect === false) {
    checkAnswerStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Câu hỏi phải có ít nhất một đáp án đúng!</span>`
    check = false
  }

  if (check) {
    saveQuestionToLocalStorage(addQuestion.value.trim(), answers)

    const modalElement = addQuestionModal
    const modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide()

    clearForm()

    renderQuestionTable()

    const toast = new bootstrap.Toast(createQuestionToast, { delay: 2000 }) 
    toast.show()
  }
})

editSaveButton.addEventListener("click", () => {
  const editQuestionInput = document.querySelector("#edit-question")
  const answersGroup = document.querySelectorAll("#edit-questions-modal .input-group")

  let valid = true

  if (editQuestionInput.value.trim() === "") {
    editQuestionNameStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Câu hỏi không được để trống!</span>`
    valid = false
  }

  const updatedAnswers = []
  answersGroup.forEach(group => {
    const checkBox = group.querySelector("input[type='checkbox']")
    const answerInput = group.querySelector("input.form-control")
    
    if (answerInput && answerInput.value.trim() !== "") {
      updatedAnswers.push({
        text: answerInput.value.trim(),
        isCorrect: checkBox.checked
      })
    }
  })

  if (updatedAnswers.length < 2) {
    editCheckAnswerStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Câu hỏi phải có ít nhất hai đáp án để lựa chọn!</span>`
    valid = false
  } else if (!updatedAnswers.some(a => a.isCorrect)) {
    editCheckAnswerStatus.innerHTML = `<span style="color: red; margin-top: 15px;">Câu hỏi phải có ít nhất một đáp án đúng!</span>`
    valid = false
  }

  if (!valid || findQuestionId === null) return

  const questions = getQuestionsFromLocalStorage()
  const questionIndex = questions.findIndex(q => q.id === findQuestionId)

  if (questionIndex !== -1) {
    questions[questionIndex].questionName = editQuestionInput.value.trim()
    questions[questionIndex].answers = updatedAnswers

    localStorage.setItem("questions", JSON.stringify(questions))

    const modalElement = editQuestionModal
    const modal = bootstrap.Modal.getInstance(modalElement)
    modal.hide()

    clearEditForm()

    renderQuestionTable()
  }
})


editQuestionModal.addEventListener("hidden.bs.modal", () => {
  clearEditForm()
})

addMoreAnswerButton.addEventListener("click", () => {
  addMoreAnswerButton.insertAdjacentHTML("beforebegin", `
    <div class="input-group mb-3">
      <div class="input-group-text">
        <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" placeholder="Nhập câu trả lời">
        <i class="fa-solid fa-trash-can"></i>
      </div>
      <input type="text" class="form-control" aria-label="Text input with checkbox">
    </div>
  `)
})

answersBodyField.addEventListener("click", function(event) {
  if (event.target.classList.contains("fa-trash-can")) {
    const inputGroup = event.target.closest(".input-group")
    if (inputGroup) {
      inputGroup.remove()
    }
  }
})

const answersGroup = document.querySelectorAll(".input-group")
const answers = []

answersGroup.forEach(group => {
  const checkBox = group.querySelector("input[type='checkbox']")
  const answer = group.querySelector("input[type='text']")
  if (answer.value.trim() !== "") {
    answers.push({
      answer: answer.value.trim(),
      isCorrect: checkBox.checked
    })
  }
})

function loadEditTestData() {
  const editTestId = localStorage.getItem("editTestId")
  if (editTestId) {
    title.innerHTML = "Chỉnh sửa bài test"
    const tests = getTestsFromLocalStorage()
    const test = tests.find(t => t.id === parseInt(editTestId))
    if (test) {
      document.getElementById("test-name").value = test.testName
      document.getElementById("test-time").value = test.playTime

      const selectedCategory = {
        categoryName: test.categoryName,
        categoryEmoji: test.categoryEmoji
      }
      const optionValue = JSON.stringify(selectedCategory)
      const options = document.querySelectorAll("#category-list option")
      options.forEach(opt => {
        if (opt.value === optionValue) {
          opt.selected = true
        }
      })

      const questions = test.questions.map((q, index) => ({
        id: index + 1,
        questionName: q.content,
        answers: q.answers.map(ans => ({
          text: ans.answer,
          isCorrect: ans.isCorrected
        }))
      }))

      localStorage.setItem("questions", JSON.stringify(questions))
      renderQuestionTable()
    }

    localStorage.removeItem("editTestId")

  } else {
    localStorage.removeItem("questions")
  }
}

renderCategoryList()
loadEditTestData()