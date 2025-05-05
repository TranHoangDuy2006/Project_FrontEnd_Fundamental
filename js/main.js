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