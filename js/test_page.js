const testName = document.getElementById("test-name-field")
const listQuestionField = document.getElementById("list-question-field")
const questionAnswerField = document.getElementById("question-answer-field")
const timeField = document.getElementById("time-field")
const questionNumber = document.getElementById("question-number")
const questionText = document.getElementById("question-text")
const previousButton = document.getElementById("previous-button")
const nextButton = document.getElementById("next-button")
const resultModal = document.getElementById("test-result-modal")
const homeButton = document.getElementById("home-button")
const totalQuestions = document.getElementById("total-questions")
const completeButton = document.getElementById("complete-button")
const logoutButton = document.getElementById("log-out")

let currentQuestionIndex = 0
let answeredQuestions = []

homeButton.addEventListener("click", () => {
  setTimeout(() => {
    location.href = "../pages/Home.html"
  }, 1000)
})

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
  localStorage.removeItem("currentUserRole")
  location.href = "../pages/Login.html"
})

function showQuestion(index) {
  const questionData = currentTest.questions[index]
  currentQuestionIndex = index

  questionNumber.innerHTML = `Câu hỏi ${index + 1} trên ${currentTest.questions.length}:`
  questionText.innerHTML = `${questionData.content}`

  let answersHTML = ""
  questionData.answers.forEach((answer, idx) => {
    const isChecked = answeredQuestions[index][idx] ? 'checked' : ''
    answersHTML += `
      <div style="height: 24px;">
        <label>
          <input type="checkbox" value="${idx}" class="answer-checkbox" ${isChecked}> ${answer.answer}
        </label>
      </div>
    `
  })

  questionAnswerField.innerHTML = answersHTML

  const checkboxes = document.querySelectorAll(".answer-checkbox")
  checkboxes.forEach((checkbox, idx) => {
    checkbox.addEventListener("change", () => {
      answeredQuestions[currentQuestionIndex][idx] = checkbox.checked

      let anyChecked = false
      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          anyChecked = true
          break
        }
      }
      updateAnsweredStatus()
    })
  })
}


const currentTestName = localStorage.getItem("currentTestName")
const tests = JSON.parse(localStorage.getItem("tests")) || []

const currentTest = tests.find(test => test.testName === currentTestName)

if (currentTest) {
  testName.innerHTML = currentTest.testName
  const questionsCount = currentTest.questions.length
  listQuestionField.innerHTML = ""
  for (let i = 0; i < questionsCount; i++) {
    answeredQuestions[i] = []
    const question = document.createElement("button")
    question.className = "redirect-button"
    question.innerHTML = `${i + 1}`

    nextButton.addEventListener("click", () => {
      showQuestion(i + 1)
    })

    question.addEventListener("click", () => {
      showQuestion(i)

      const allButtons = document.querySelectorAll(".redirect-button")
      allButtons.forEach(btn => btn.classList.remove("question-clicked"))

      question.classList.add("question-clicked")
    })

    listQuestionField.appendChild(question)
  }

  showQuestion(0)

  previousButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
})

  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
})
  
//   const fastTestMode = true; // <<< Bạn chỉ cần bật/tắt chỗ này thôi

//   const totalMinutes = fastTestMode ? (5 / 60) : parseInt(currentTest.playTime); 
//   let remainingSeconds = fastTestMode ? 5 : totalMinutes * 60;

  const totalMinutes = parseInt(currentTest.playTime)
  let remainingSeconds = totalMinutes * 60


  function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60

    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds

    timeField.innerHTML = `
      <div>
        <p>Thời gian test: ${totalMinutes} phút</p>
        <p style="margin-top: 16px;">Còn lại: ${minutes} phút ${formattedSeconds} giây</p>
      </div>
    `
  }

  updateTimerDisplay()

  const timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateTimerDisplay()
    } else {
      clearInterval(timerInterval)
      totalQuestions.innerHTML = currentTest.questions.length
      const result = new bootstrap.Modal(resultModal)
      result.show()
    }
  }, 1000)

  completeButton.addEventListener("click", () => { 
    clearInterval(timerInterval)
    const result = new bootstrap.Modal(resultModal)
    result.show()
  })

  // setInterval: chạy một đoạn code lặp đi lặp lại sau một khoảng thời gian nhất định
  // clearInterval: dừng setInterval ( khi thời gian = 0 )

  function updateAnsweredStatus() {
    const allButtons = listQuestionField.querySelectorAll(".redirect-button")
    allButtons.forEach((btn, idx) => {
      const answers = answeredQuestions[idx] || []
      const isAnswered = answers.some(ans => ans === true)
      if (isAnswered) {
        btn.classList.add("answered")
      } else {
        btn.classList.remove("answered")
      }
    })
  }    
} 