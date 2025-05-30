const email = document.querySelector("#login-email")
const password = document.querySelector("#login-password")
const emailError = document.querySelector("#login-email-error")
const passwordError = document.querySelector("#login-password-error")
const loginButton = document.querySelector("#login-button")

document.querySelectorAll(".toggle-password").forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
      const input = document.querySelector(eyeIcon.getAttribute("toggle"))
      const isPassword = input.type === "password"
      input.type = isPassword ? "text" : "password"
      eyeIcon.classList.toggle("fa-eye")
      eyeIcon.classList.toggle("fa-eye-slash")
  })
})

function getAccountFromLocalStorage() {
  return JSON.parse(localStorage.getItem("users")) || []
}

function removeSessionStorageUser() {
  sessionStorage.removeItem("isLogged")
  sessionStorage.removeItem("currentUserRole")
}

removeSessionStorageUser()

const secretKey = "DoYouWantToSeeMyPassword?"

email.addEventListener("change", () => {
  emailError.innerHTML = ""
  email.style.border = "1px solid #E4E4E7"
  email.style.outline = "none"
})

password.addEventListener("change", () => {
  passwordError.innerHTML = ""
  password.style.border = "1px solid #E4E4E7"
  password.style.outline = "none"
})

loginButton.addEventListener("click", () => {
  let check = true

  emailError.innerHTML = ""
  passwordError.innerHTML = ""

  const users = getAccountFromLocalStorage()
  const user = users.find(user => user.email === email.value.trim())

  if (!email.value.trim()) {
    emailError.innerHTML = `<span style="color: red; margin: 0 0 20px 18px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Địa chỉ email không được để trống!</span>`
    email.style.border = "none"
    email.style.outline = "2px solid red"
    check = false
  } else if (!user) {
    emailError.innerHTML = `<span style="color: red; margin: 0 0 20px 18px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Email không tồn tại!</span>`
    email.style.border = "none"
    email.style.outline = "2px solid red"
    check = false
  }

  if (!password.value.trim()) {
    passwordError.innerHTML = `<span style="color: red; margin: 0 0 20px 18px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Mật khẩu không được để trống!</span>`
    password.style.border = "none"
    password.style.outline = "2px solid red"
    check = false
  } else if (user) {
    const bytes = CryptoJS.AES.decrypt(user.password, secretKey)
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8)
  
    if (decryptedPassword !== password.value.trim()) {
      passwordError.innerHTML = `<span style="color: red; margin: 0 0 20px 18px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Mật khẩu không đúng, vui lòng thử lại!</span>`
      password.style.border = "none"
      password.style.outline = "2px solid red"
      check = false
    }
  }

  if (check) {
    localStorage.setItem("isLogged", true)
    localStorage.setItem("currentUserRole", user.role)
    sessionStorage.removeItem("isLogged")
    sessionStorage.removeItem("currentUserRole")
    const loginToast = document.getElementById("login-toast")
    const toast = new bootstrap.Toast(loginToast, { delay: 2000 })
    toast.show()

    email.value = ""
    password.value = ""

    setTimeout(() => {
      if (user.role === "admin") {
        location.href = "../pages/Management_Categories.html"
      } else if (user.role === "user") {
        location.href = "../pages/Home.html"
      }
    }, 2500)
  }
})
