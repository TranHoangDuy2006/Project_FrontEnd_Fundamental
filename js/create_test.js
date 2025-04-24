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
const questionTableBody = document.querySelector("#questions-table-body")
const questionNameStatus = document.querySelector("#question-name-status")
const addQuestionModal = document.getElementById("add-question-modal")
const confirmDeleteButton = document.getElementById("delete-question-button")
const addMoreAnswerButton = document.getElementById("add-more-answer-button")
const answersBodyField = document.getElementById("answers-body-field")

let findQuestionId = null

function renderQuestionTable() {
    const listQuestion = getQuestionsFromLocalStorage()
  
    if (questionTableBody) {
      questionTableBody.innerHTML = ""
      
      listQuestion.forEach(question => {     
        const rowData = `
          <td>${question.id}</td>
          <td>${question.questionName}</td>
          <td>
            <button type="button" class="edit-question-button" data-bs-toggle="modal" data-bs-target="#edit-question-modal">Sửa</button>
            <button class="delete-question-button" data-id="${question.id}" data-bs-toggle="modal" data-bs-target="#delete-question-modal" style="margin-left: 5px;">Xoá</button>
          </td>
        `
        questionTableBody.innerHTML += rowData
        attachDeleteAction()
      })
    }
  }

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
    }
})

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
    return category.map(c => c.categoryName)
}

function addOptionValues() {
    const list = getCategoryNameFromLocalStorage()
    categoryList.innerHTML = ""
    list.forEach(category => {
        const option = `<option value="${category}">${category}</option>`
        categoryList.innerHTML += option
    })
}

addOptionValues()

// function saveTestsToLocalStorage(name, time, amount) {
//     const tests = getTestsFromLocalStorage()
//     const newTest = {
//       id: tests.length > 0 ? tests[tests.length - 1].id + 1 : 1,
//       testName: name,
//       playTime: time,
//       playAmount: amount,
//       questions: [
        
//       ]
//     }
//     tests.push(newTest)
//     localStorage.setItem("tests", JSON.stringify(tests))
//   }

 function saveQuestionToLocalStorage(name) {
    const listQuestion = getQuestionsFromLocalStorage()
    const newQuestion = {
      id: listQuestion.length > 0 ? listQuestion[listQuestion.length - 1].id + 1 : 1,
      questionName: name
    }
    listQuestion.push(newQuestion)
    localStorage.setItem("questions", JSON.stringify(listQuestion))
  }



renderQuestionTable()

saveButton.addEventListener("click", () => {
    questionNameStatus.innerHTML = ""
    check = true
    if(addQuestion.value.trim() === "") {
      questionNameStatus.innerHTML = `<span style="color: red; display: block; margin-top: 15px;">Câu hỏi không được để trống!</span>`
      addQuestion.style.border = "none"
      addQuestion.style.outline = "1px solid red"
      check = false
    }

    if (check) {
      saveQuestionToLocalStorage(addQuestion.value.trim())
      const modalElement = addQuestionModal
      const modal = bootstrap.Modal.getInstance(modalElement)
      modal.hide()
      addQuestion.value = ""
      questionNameStatus.innerHTML = ""
      addQuestion.style.border = ""
      addQuestion.style.outline = ""
      renderQuestionTable()
    }
})

addQuestionModal.addEventListener("hidden.bs.modal", () => {
  addQuestion.value = ""
  questionNameStatus.innerHTML = ""
  addQuestion.style.border = ""
  addQuestion.style.outline = ""
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