function loadProjectCSS(cssPath) {
  const old = document.getElementById("project-css");
  if (old) old.remove();
  if (!cssPath) return;
  const link = document.createElement("link");
  link.id = "project-css";
  link.rel = "stylesheet";
  link.href = cssPath;
  document.head.appendChild(link);
}

function hexToRgbTriplet(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

function setAccentColor(color, colorDark) {
  document.documentElement.style.setProperty(
    "--accent",
    hexToRgbTriplet(color || "#7c3aed"),
  );
  document.documentElement.style.setProperty(
    "--accent-d",
    hexToRgbTriplet(colorDark || color || "#a78bfa"),
  );
}

function showProject(nomFichier, btn, cssPath, color, colorDark) {
  setAccentColor(color, colorDark);
  loadProjectCSS(cssPath);
  fetch(`projets/${nomFichier}.html`)
    .then((response) => {
      if (!response.ok) throw new Error("Fichier non trouvé");
      return response.text();
    })
    .then((htmlContenu) => {
      const container = document.getElementById("project-content");
      container.innerHTML = htmlContenu;
      container.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
      });
    })
    .catch(() => {
      document.getElementById("project-content").innerHTML =
        "<p>Impossible de charger le projet.</p>";
    });
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

window.onload = function () {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    document.getElementById("toggle-dark").textContent = "☀️";
  }
  fetch("projets/index.json")
    .then((res) => res.json())
    .then((projets) => {
      const nav = document.querySelector(".project-tabs");
      nav.innerHTML = "";
      projets.forEach((projet, i) => {
        const btn = document.createElement("button");
        btn.className = "tab-btn";
        btn.textContent = projet.label;
        btn.style.setProperty("--btn-color", projet.color || "#7c3aed");
        btn.style.setProperty(
          "--btn-color-dark",
          projet.colorDark || projet.color || "#a78bfa",
        );
        btn.onclick = () =>
          showProject(
            projet.id,
            btn,
            projet.css,
            projet.color,
            projet.colorDark,
          );
        nav.appendChild(btn);
        if (i === 0)
          showProject(
            projet.id,
            btn,
            projet.css,
            projet.color,
            projet.colorDark,
          );
      });
    })
    .catch(() => {
      document.getElementById("project-content").innerHTML =
        "<p>Impossible de charger la liste des projets.</p>";
    });
};

function slideMove(btn, dir) {
  const track = btn.parentElement.querySelector(".slider-track");
  const total = track.children.length;
  let current = parseInt(track.dataset.current || 0) + dir;
  if (current < 0) current = total - 1;
  if (current >= total) current = 0;
  track.dataset.current = current;
  track.style.transform = `translateX(-${current * 100}%)`;
}

function openLightbox(img) {
  document.getElementById("lightbox-img").src = img.src;
  document.getElementById("lightbox").classList.add("open");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}

function toggleDark() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
  document.getElementById("toggle-dark").textContent = isDark ? "☀️" : "🌙";
}
