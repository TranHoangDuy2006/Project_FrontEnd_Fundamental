const logOutLink = document.getElementById("log-out")

logOutLink.addEventListener("click", () => {
  localStorage.removeItem("isLogged")
})