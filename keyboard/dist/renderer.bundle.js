(() => {
  // predictionRamda.mjs
  var wordFrequencyMap = {};
  var markovWordTransitions = {};
  var markovLetterTransitions = {};
  function setCorpusWords(tokens) {
    wordFrequencyMap = {};
    tokens.forEach((token) => {
      const word = token.toLowerCase();
      wordFrequencyMap[word] = (wordFrequencyMap[word] || 0) + 1;
    });
  }
  function loadMarkovModels(wordTransitions, letterTransitions) {
    markovWordTransitions = wordTransitions;
    markovLetterTransitions = letterTransitions;
  }

  // keyboard.js
  var modelsInitialized = false;
  async function initializePredictionModels() {
    if (modelsInitialized) return;
    try {
      if (!window.predictionAPI) {
        throw new Error("Impossible d'acc\xE9der \xE0 l'API de pr\xE9diction");
      }
      console.log("Chargement du corpus...");
      const corpusTokens = await window.predictionAPI.loadCorpus();
      if (corpusTokens.length === 0) {
        throw new Error("Le corpus est vide");
      }
      setCorpusWords(corpusTokens);
      console.log(`Corpus initialis\xE9 avec ${corpusTokens.length} tokens`);
      console.log("Chargement des mod\xE8les Markov...");
      const { wordTransitions, letterTransitions } = await window.predictionAPI.loadMarkovModels();
      loadMarkovModels(wordTransitions, letterTransitions);
      modelsInitialized = true;
      console.log("Mod\xE8les de pr\xE9diction initialis\xE9s avec succ\xE8s");
    } catch (error) {
      console.error("Erreur lors de l'initialisation des mod\xE8les:", error);
    }
  }
  var Keyboard = {
    elements: {
      main: null,
      keysContainer: null,
      keys: [],
      capsKey: null
    },
    properties: {
      value: "",
      capsLock: false,
      keyboardInputs: null,
      keyLayout: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "backspace",
        "a",
        "z",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "caps",
        "q",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        "m",
        "enter",
        "done",
        "w",
        "x",
        "c",
        "v",
        "b",
        "n",
        ",",
        ";",
        ":",
        "!",
        "space"
      ]
    },
    async init() {
      await initializePredictionModels();
      this.elements.main = document.createElement("div");
      this.elements.main.classList.add("keyboard");
      document.body.appendChild(this.elements.main);
      this.elements.keysContainer = document.createElement("div");
      this.elements.keysContainer.classList.add("keyboard__keys");
      this.elements.main.appendChild(this.elements.keysContainer);
      this.elements.keysContainer.appendChild(this._createKeys());
      this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
      this.properties.keyboardInputs = document.querySelectorAll(
        ".use-keyboard-input"
      );
      this.properties.keyboardInputs.forEach((element) => {
        element.addEventListener("focus", () => {
          this.open(element.value, (currentValue) => {
            element.value = currentValue;
          });
        });
      });
    },
    _createIconHTML(icon_name) {
      return `<span class="material-icons">${icon_name}</span>`;
    },
    _createKeyBtn(iconName = "", class1 = "", onclick = () => {
    }, class2 = "", dataChar = null) {
      this.keyElement = document.createElement("button");
      this.keyElement.setAttribute("type", "button");
      this.keyElement.classList.add("keyboard__key");
      if (class1) this.keyElement.classList.add(class1);
      if (class2) this.keyElement.classList.add(class2);
      if (iconName) {
        this.keyElement.innerHTML = this._createIconHTML(iconName);
      }
      if (dataChar !== null) {
        this.keyElement.dataset.char = dataChar;
      }
      this.keyElement.addEventListener("click", onclick);
      return this.keyElement;
    },
    _createKeys() {
      const fragment = document.createDocumentFragment();
      this.properties.keyLayout.forEach((key) => {
        const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
        switch (key) {
          case "backspace":
            this._createKeyBtn(
              "backspace",
              "keyboard__key--wide",
              () => {
                this.properties.value = this.properties.value.slice(0, -1);
                this._updateValueInTarget();
              }
            );
            break;
          case "caps":
            this._createKeyBtn(
              "keyboard_capslock",
              "keyboard__key--activatable",
              () => {
                this.elements.capsKey.classList.toggle("keyboard__key--active");
                this._toggleCapsLock();
              },
              "keyboard__key--wide"
            );
            this.elements.capsKey = this.keyElement;
            break;
          case "enter":
            this._createKeyBtn(
              "keyboard_return",
              "keyboard__key--wide",
              () => {
                this.properties.value += "\n";
                this._updateValueInTarget();
              }
            );
            break;
          case "space":
            const spaceBtn = this._createKeyBtn(
              "space_bar",
              "keyboard__key--extra--wide",
              () => {
                this.properties.value += " ";
                this._updateValueInTarget();
              },
              "",
              // pas de class2
              " "
              // data-char pour la touche espace
            );
            fragment.appendChild(spaceBtn);
            break;
          case "done":
            this._createKeyBtn(
              "check_circle",
              "keyboard__key--dark",
              () => {
                this.close();
                this._updateValueInTarget();
              },
              "keyboard__key--wide"
            );
            break;
          default:
            this._createKeyBtn("", "", () => {
              this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
              this._updateValueInTarget();
              const currentValue = this.properties.value.trim().split(/\s+/);
              const lastWord = currentValue[currentValue.length - 1] || "";
              const context = currentValue.slice(0, -1);
              const { options } = getNextWordProbabilities(context);
              const word = completeWord(lastWord, options);
              console.log("Valeur tap\xE9e :", this.properties.value);
              console.log("Mot en cours :", lastWord);
              console.log("Contexte :", context);
              console.log("Options:", options);
              console.log("Mots en train de taper pr\xE9dit:", word);
              console.log("Letter probs (filtered):", predictNextLetterProbs(lastWord, options));
              console.log("most probable letter:", getMostProbableNextLetter(lastWord, options));
              let letterProbs = predictNextLetterProbs(lastWord, options);
              this.elements.keys.forEach((keyEl) => {
                const char = (keyEl.dataset.char || keyEl.textContent.trim()).toLowerCase();
                if (!letterProbs[char]) {
                  keyEl.classList.remove("activeYellow");
                  keyEl.classList.remove("activePurple");
                }
                const prob = letterProbs[char];
                if (prob > 0.2) {
                  keyEl.classList.add("activePurple");
                  keyEl.classList.remove("activeYellow");
                } else if (prob > 0 && prob <= 0.2) {
                  keyEl.classList.add("activeYellow");
                  keyEl.classList.remove("activePurple");
                } else {
                  keyEl.classList.remove("activeYellow");
                  keyEl.classList.remove("activePurple");
                }
              });
            });
            this.keyElement.textContent = key.toLowerCase();
            break;
        }
        fragment.appendChild(this.keyElement);
        if (insertLineBreak) {
          fragment.appendChild(document.createElement("br"));
        }
      });
      return fragment;
    },
    _updateValueInTarget() {
      this.properties.keyboardInputs.forEach((keyboard) => {
        keyboard.value = this.properties.value;
      });
    },
    _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;
      for (let key of this.elements.keys) {
        if (key.childElementCount === 0) {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    },
    open(initialValue, oninput) {
      this.properties.value = initialValue || "";
      this.elements.main.classList.remove("keyboard--hidden");
      this.elements.main.classList.add("keyboard--visible");
    },
    close() {
      this.elements.main.classList.remove("keyboard--visible");
      this.properties.value = this.properties.value;
      this.elements.main.classList.add("keyboard--hidden");
    }
  };
  window.addEventListener("DOMContentLoaded", async () => {
    await loadMarkovData();
    Keyboard.init();
    setTimeout(() => {
      Keyboard.elements.main.classList.add("keyboard--visible");
    }, 100);
  });
})();
//# sourceMappingURL=renderer.bundle.js.map
