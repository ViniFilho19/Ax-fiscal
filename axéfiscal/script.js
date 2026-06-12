const btn = document.getElementById("selectBtn");
const list = document.getElementById("dropdownList");
const label = document.getElementById("selectLabel");
const btnEntrar = document.getElementById("btnEntrar");

let tipoAcesso = "contador";

btn.addEventListener("click", () => {
  const open = list.classList.toggle("show");
  btn.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
});

list.querySelectorAll(".dropdown-item").forEach((item) => {
  item.addEventListener("click", () => {
    label.textContent = item.textContent;
    tipoAcesso = item.dataset.value;

    list.classList.remove("show");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  });
});

document.addEventListener("click", (e) => {
  if (!btn.contains(e.target) && !list.contains(e.target)) {
    list.classList.remove("show");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  }
});

btnEntrar.addEventListener("click", () => {
  if (tipoAcesso === "contador") {
    window.location.href = "contador/dashboard-contador.html";
  } else {
    window.location.href = "dashboard/dashboard.html";
  }
});
