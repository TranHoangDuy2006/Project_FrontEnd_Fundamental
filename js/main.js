function checkAccountStatus() {
  const isLogged = localStorage.getItem("isLogged") === "true"
  const currentUserRole = localStorage.getItem("currentUserRole")

  if (!isLogged) {
    location.href = "../pages/Login.html"
  } else if (currentUserRole === "admin") {
    location.href = "../pages/Management_Categories.html"
  } else if (currentUserRole === "user") {
    location.href = "../pages/Home.html"
  } else {
    location.href = "../pages/Login.html"
  }
}
  
checkAccountStatus()

localStorage.removeItem("editTestId")
localStorage.removeItem("currentTestName")

// Tạo sẵn tài khoản admin nếu chưa tồn tại

function createAdminAccount() {
  const users = JSON.parse(localStorage.getItem("users")) || []

  const adminExists = users.some(user => user.role === "admin")
  if (adminExists) return

  const secretKey = "DoYouWantToSeeMyPassword?"

  // Mật khẩu tài khoản admin (AdminPage123) được mã hóa bằng AES

  const secretPassword = CryptoJS.AES.encrypt("AdminPage123", secretKey).toString()

  const adminAccount = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    fullName: 'Admin',
    email: 'AdminPage@gmail.com',
    password: secretPassword,
    role: "admin"
  }

  users.push(adminAccount)
  localStorage.setItem("users", JSON.stringify(users))
}

createAdminAccount()
