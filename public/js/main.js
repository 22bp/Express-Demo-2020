const navItems = document.getElementsByClassName("nav-item");

for (let i = 0; i < navItems.length; i++) {
  navItems[i].addEventListener("click", activeMenu);
}

function activeMenu() {
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove("active");
  }

  this.classList.add("active");
}
