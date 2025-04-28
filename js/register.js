const nameRegister = document.querySelector("#name-register")
const emailRegister = document.querySelector("#email-register")
const passwordRegister = document.querySelector("#password-register")
const confirmPassword = document.querySelector("#confirmPassword")
const nameError = document.querySelector("#name-error")
const emailError = document.querySelector("#email-error")
const passwordError = document.querySelector("#password-error")
const confirmPasswordError = document.querySelector("#confirmPassword-error")
const registerButton = document.querySelector("#register-button")
const registerToast = document.getElementById("register-toast")

function getAccountFromLocalStorage() {
    return JSON.parse(localStorage.getItem("users")) || []
}
  
  function saveAccountToLocalStorage(name, email, password) {
    const users = getAccountFromLocalStorage()
  
    const newUser = {
      id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
      fullName: name,
      email: email,
      password: password,
      role: "user"
    }
  
    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
}

nameRegister.addEventListener("change", () => {
  nameError.innerHTML = ""
  nameRegister.style.border = "1px solid #E4E4E7"
  nameRegister.style.outline = "none"
})

emailRegister.addEventListener("change", () => {
  emailError.innerHTML = ""
  emailRegister.style.border = "1px solid #E4E4E7"
  emailRegister.style.outline = "none"
})

passwordRegister.addEventListener("change", () => {
  passwordError.innerHTML = ""
  passwordRegister.style.border = "1px solid #E4E4E7"
  passwordRegister.style.outline = "none"
})

confirmPassword.addEventListener("change", () => {
  confirmPasswordError.innerHTML = ""
  confirmPassword.style.border = "1px solid #E4E4E7"
  confirmPassword.style.outline = "none"
})

registerButton.addEventListener("click", () => {
  let valid = true

  nameError.innerHTML = ""
  emailError.innerHTML = ""
  passwordError.innerHTML = ""
  confirmPasswordError.innerHTML = ""

  if (nameRegister.value.trim() === "") {
    nameError.innerHTML = `<span style="color: red; margin: 0 0 24px 24px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Họ và tên không được để trống!</span>`
    nameRegister.style.border = "none"
    nameRegister.style.outline = "1px solid red"
    valid = false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // ^[^\s@]+ → Bắt đầu chuỗi, chứa ít nhất một ký tự không phải khoảng trắng và không phải dấu @.

  // @ → Bắt buộc có dấu @.

  // [^\s@]+ → Sau @, tiếp tục là một chuỗi không chứa khoảng trắng và @.

  // \. → Phải có dấu chấm.

  // [^\s@]+$ → Cuối cùng là phần domain (ví dụ .com, .vn…), không có khoảng trắng hoặc @.

  const registeredEmails = getAccountFromLocalStorage().map(user => user.email)
  if (emailRegister.value.trim() === "") {
    emailError.innerHTML = `<span style="color: red; margin: 0 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Địa chỉ email không được để trống!</span>`
    emailRegister.style.border = "none"
    emailRegister.style.outline = "1px solid red"
    valid = false
  } else if (!emailPattern.test(emailRegister.value.trim())) {
    emailError.innerHTML = `<span style="color: red; margin: 0 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Email không đúng định dạng!</span>`
    emailRegister.style.border = "none"
    emailRegister.style.outline = "1px solid red"
    valid = false
  } else if (registeredEmails.includes(emailRegister.value.trim())) {
    emailError.innerHTML = `<span style="color: red; margin: 0 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Email đã được sử dụng, vui lòng sử dụng địa chỉe Email khác!</span>`
    emailRegister.style.border = "none"
    emailRegister.style.outline = "1px solid red"
    valid = false
  }

  if (passwordRegister.value.trim() === "") {
    passwordError.innerHTML = `<span style="color: red; margin: 0 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Mật khẩu không được để trống!</span>`
    passwordRegister.style.border = "none"
    passwordRegister.style.outline = "1px solid red"
    valid = false
  } else if (passwordRegister.value.length < 8) {
    passwordError.innerHTML = `<span style="color: red; margin: 0 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Mật khẩu phải có ít nhất 8 ký tự!</span>`
    passwordRegister.style.border = "none"
    passwordRegister.style.outline = "1px solid red"
    valid = false
  }

  if (confirmPassword.value.trim() === "") {
    confirmPasswordError.innerHTML = `<span style="color: red; margin: 20px 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Xác nhận mật khẩu không được để trống!</span>`
    confirmPassword.style.border = "none"
    confirmPassword.style.outline = "1px solid red"
    valid = false
  } else if (confirmPassword.value !== passwordRegister.value) {
    confirmPasswordError.innerHTML = `<span style="color: red; margin: 20px 0 24px 20px !important; display: inline-block;"><i class="fa-solid fa-xmark"></i> Mật khẩu xác nhận không khớp với mật khẩu đã đăng ký!</span>`
    confirmPassword.style.border = "none"
    confirmPassword.style.outline = "1px solid red"
    valid = false
  }

  if (valid) {
    saveAccountToLocalStorage(nameRegister.value.trim(), emailRegister.value.trim(), passwordRegister.value.trim())
    nameRegister.value = ""
    emailRegister.value = ""
    passwordRegister.value = ""
    confirmPassword.value = ""
    const toast = new bootstrap.Toast(registerToast, { delay: 2000 }) 
    toast.show()

    setTimeout(() => {
      location.href = "../pages/Login.html"
    }, 2500)
  }
})