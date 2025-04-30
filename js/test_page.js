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
  const scorePercentage = document.getElementById("score-percentage")
  const correctAnswers = document.getElementById("correct-answers")
  const wrongAnswers = document.getElementById("wrong-answers")
  const tryAgainButton = document.getElementById("try-again-button")

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
        currentQuestionIndex++
        showQuestion(currentQuestionIndex)
    }
  })

  const totalMinutes = parseInt(currentTest.playTime)
  let remainingSeconds = totalMinutes * 60

  function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60

    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds

    timeField.innerHTML = `
      <div>
        <p>Thời gian test: <strong>${totalMinutes} phút</strong></p>
        <p style="margin-top: 16px;">Còn lại: <strong>${minutes} phút ${formattedSeconds} giây</strong></p>
      </div>
    `
  }

  updateTimerDisplay()

  function calculateResult() {
    let correctCount = 0
  
    currentTest.questions.forEach((question, index) => {
      const correctAnswers = question.answers.map(a => a.isCorrected)
      const userAnswers = answeredQuestions[index] || []
  
      const isCorrect = correctAnswers.every((val, i) => val === !!userAnswers[i]) && userAnswers.every((val, i) => val === !!correctAnswers[i])
      if (isCorrect) correctCount++
    })
  
    const total = currentTest.questions.length
    const wrongCount = total - correctCount
    const scorePercent = Math.round((correctCount / total) * 100)
  
    scorePercentage.innerText = `${scorePercent}%`
    totalQuestions.innerText = total
    correctAnswers.innerText = correctCount
    wrongAnswers.innerText = wrongCount

    currentTest.playAmount--
    if (currentTest.playAmount < 0) {
      currentTest.playAmount = 0
    }

    const testIndex = tests.findIndex(test => test.testName === currentTestName)
    if (testIndex !== -1) {
      tests[testIndex] = currentTest
      localStorage.setItem('tests', JSON.stringify(tests))
    } 
  }

  let timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--
      updateTimerDisplay()
    } else {
      clearInterval(timerInterval)
      calculateResult()
      const result = new bootstrap.Modal(resultModal)
      result.show()
    }
  }, 1000)

  completeButton.addEventListener("click", () => { 
    clearInterval(timerInterval)
    calculateResult()
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
  
  tryAgainButton.addEventListener("click", () => {
    // Reset dữ liệu đã trả lời
    answeredQuestions = []
    for (let i = 0; i < currentTest.questions.length; i++) {
      answeredQuestions[i] = []
    }
  
    // Reset câu hỏi hiện tại và hiển thị lại
    currentQuestionIndex = 0
    showQuestion(currentQuestionIndex)
  
    // Reset style nút câu hỏi
    updateAnsweredStatus()
  
    // Reset thời gian và khởi động lại timer
    remainingSeconds = parseInt(currentTest.playTime) * 60
    updateTimerDisplay()
  
    clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--
        updateTimerDisplay()
      } else {
        clearInterval(timerInterval)
        calculateResult()
        const result = new bootstrap.Modal(resultModal)
        result.show()
      }
    }, 1000)
  
    const modal = bootstrap.Modal.getInstance(resultModal)
    if (modal) {
      modal.hide()
    }

    showQuestion(0)

    const allQuestionsButton = listQuestionField.querySelectorAll(".redirect-button")
    allQuestionsButton[0].classList.add("question-clicked")
    for (let i = 1; i < allQuestionsButton.length; i++) {
      allQuestionsButton[i].classList.remove("question-clicked")
    }
  })
} 