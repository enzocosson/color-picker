const addBtn = document.querySelector(".btn_add");
const inputColor = document.querySelector(".input_add");
const colorDisplay = document.querySelector(".affichage_couleur");
const paletteDiv = document.querySelector(".container_choice_colors");

const savedButtons = JSON.parse(localStorage.getItem("colorButtons")) || [];

for (const hexColor of savedButtons) {
  const newBtn = createColorButton(hexColor);
  paletteDiv.appendChild(newBtn);
}

addBtn.addEventListener("click", () => {
  const hexColor = inputColor.value;
  const hexRegex = /^#[0-9a-fA-F]{6}$/;
  if (!hexRegex.test(hexColor)) {
    alert("La couleur saisie n'est pas au format hexadécimal !");
    return;
  }
  if (savedButtons.includes(hexColor)) {
    alert("La couleur saisie existe déjà !");
    return;
  }
  const newBtn = createColorButton(hexColor);
  paletteDiv.appendChild(newBtn);

  savedButtons.push(hexColor);
  localStorage.setItem("colorButtons", JSON.stringify(savedButtons));
});

paletteDiv.addEventListener("click", (event) => {
  if (event.target.classList.contains("choice_color")) {
    const hexColor = event.target.style.backgroundColor;
    colorDisplay.style.backgroundColor = hexColor;
  }
});

function createColorButton(hexColor) {
  const newBtn = document.createElement("button");
  newBtn.type = "button";
  newBtn.classList.add("choice_color");
  newBtn.style.backgroundColor = hexColor;

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.classList.add("delete_button");
  deleteBtn.textContent = "x";
  newBtn.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", () => {
    newBtn.remove();

    const index = savedButtons.indexOf(hexColor);
    if (index > -1) {
      savedButtons.splice(index, 1);
      localStorage.setItem("colorButtons", JSON.stringify(savedButtons));
    }
  });

  return newBtn;
}

const clearBtn = document.querySelector(".tout_supprimer");

clearBtn.addEventListener("click", () => {
  while (paletteDiv.childNodes.length > 0) {
    paletteDiv.removeChild(paletteDiv.firstChild);
  }

  savedButtons.splice(0, savedButtons.length);

  localStorage.setItem("colorButtons", JSON.stringify(savedButtons));
});

const affichageCouleur = document.querySelector(".affichage_couleur");
const h3 = affichageCouleur.querySelector(".hexadecimal");

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.attributeName === "style") {
      const bgColor = window
        .getComputedStyle(affichageCouleur)
        .getPropertyValue("background-color");
      const hexColor = rgbToHex(bgColor);
      h3.textContent = hexColor;
      break;
    }
  }
});

observer.observe(affichageCouleur, { attributes: true });

function rgbToHex(rgb) {
  const rgbValues = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!rgbValues) {
    return rgb;
  }

  const hex = (x) => {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  };

  return "#" + hex(rgbValues[1]) + hex(rgbValues[2]) + hex(rgbValues[3]);
}
