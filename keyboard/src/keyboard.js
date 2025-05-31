import { loadMarkovModels, predictNextLetters, setCorpusWords } from '../predictionRamda.mjs';

// Variables pour l'état d'initialisation, en résumé voir si les modèles sont chargés
let isInitialized = false;

// Fonction pour initialiser les modèles de prédiction
async function initializePredictionModels() {
    if (isInitialized) {
        console.log('Les modèles sont déjà initialisés');
        return;
    }

    try {
        console.log('Vérification de predictionAPI...');
        if (!window.predictionAPI) {
            throw new Error('predictionAPI n\'est pas disponible dans le contexte de rendu');
        }

        console.log('Chargement du corpus...');
        const corpusText = await window.predictionAPI.loadCorpus();

        if (!corpusText) {
            throw new Error('Le corpus est vide');
        }

        console.log('Corpus chargé, tokenisation en cours...');
        // Tokenisation du texte, permet d'obtenir un tableau de mots
        const tokens = corpusText
            .toLowerCase()
            .replace(/[^a-z0-9\s!:;,]/gi, ' ')
            .split(/\s+/)
            .filter(Boolean);

        console.log(`Corpus tokenisé: ${tokens.length} tokens`);
        setCorpusWords(tokens);

        console.log('Chargement des modèles Markov...');
        const markovData = await window.predictionAPI.loadMarkovData();

        if (!markovData || !markovData.wordTransitions || !markovData.letterTransitions) {
            throw new Error('Données Markov invalides');
        }

        const { wordTransitions, letterTransitions } = markovData;

        console.log('Normalisation des modèles Markov...');
        // Normalisation des clés en minuscules
        const lowerWordTrans = Object.fromEntries(
            Object.entries(wordTransitions).map(([k, dist]) => [
                k.toLowerCase(),
                Object.fromEntries(
                    Object.entries(dist).map(([w, p]) => [w.toLowerCase(), p])
                )
            ])
        );

        console.log('Chargement des modèles...');
        loadMarkovModels(lowerWordTrans, letterTransitions);
        isInitialized = true;
        console.log('Modèles de prédiction initialisés avec succès');
    } catch (error) {
        console.error('Erreur critique lors de l\'initialisation des modèles:', error);
        // Ne pas lancer l'application si l'initialisation échoue
        throw new Error(`Impossible d'initialiser les modèles de prédiction: ${error.message}`);
    }
}


// Initialiser le clavier
const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        capsKey: null,
    },

    properties: {
        value: "",
        capsLock: false,
        keyboardInputs: null,
        keyLayout: [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "a", "z", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "q", "s", "d", "f", "g", "h", "j", "k", "l", "m", "enter",
            "done", "w", "x", "c", "v", "b", "n", ",", ".", "?", "'", "space",
        ],
    },

    init() {
        // create and setup main element
        this.elements.main =
            document.createElement("div");
        this.elements.main.classList
            .add("keyboard");
        document.body
            .appendChild(this.elements.main);

        // create and setup child container component
        this.elements.keysContainer =
            document.createElement("div");
        this.elements.keysContainer
            .classList.add("keyboard__keys");
        this.elements.main
            .appendChild(this.elements.keysContainer);

        // create and setup key elements
        this.elements.keysContainer
            .appendChild(this._createKeys());
        this.elements.keys =
            this.elements.keysContainer
                .querySelectorAll(".keyboard__key");

        // open keyboard for elements with .use-keyboard-input
        this.properties.keyboardInputs =
            document.querySelectorAll(
                ".use-keyboard-input"
            );
        this.properties
            .keyboardInputs
            .forEach((element) => {
                element.addEventListener("focus", () => {
                    this
                        .open(element.value, (currentValue) => {
                            element.value = currentValue;
                        });
                });
            });
    },

    _createIconHTML(icon_name) {
        return `<span class="material-icons">${icon_name}</span>`;
    },

    _createKeyBtn(iconName = "", class1 = "", onclick = () => {}, class2 = "", dataChar = null) {
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

    // Mise à jour des surlignages des touches du clavier selon la probabilité des lettres suivantes
    _updateKeyHighlights(context, lastWord) {
        if (!isInitialized) return;

        try {
            const letterProbs = predictNextLetters(context, lastWord);

            this.elements.keys.forEach((keyEl) => {
                const char = (keyEl.dataset.char || keyEl.textContent.trim()).toLowerCase();

                if (!letterProbs[char]) {
                    keyEl.classList.remove("activeYellow", "activePurple");
                    return;
                }

                const prob = letterProbs[char];
                if (prob > 0.2) {
                    keyEl.classList.add("activePurple");
                    keyEl.classList.remove("activeYellow");
                } else if (prob > 0.1 && prob <= 0.2) {
                    keyEl.classList.add("activeYellow");
                    keyEl.classList.remove("activePurple");
                } else {
                    keyEl.classList.remove("activeYellow", "activePurple");
                }
            });
        } catch (error) {
            console.error("Erreur lors de la mise à jour des surlignages:", error);
        }
    },


    // Création des touches du clavier
    _createKeys() {
        const fragment =
            document.createDocumentFragment();

        this.properties.keyLayout.forEach((key) => {
            const insertLineBreak =
                ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            switch (key) {
                case "backspace":
                    this._createKeyBtn(
                        "backspace", "keyboard__key--wide",
                        () => {
                            this.properties.value = this.properties.value.slice(0, -1);
                            this._updateValueInTarget();

                            const currentValue = this.properties.value.trim().split(/\s+/);
                            const lastWord = currentValue[currentValue.length - 1] || "";
                            const context = currentValue.slice(0, -1);

                            this._updateKeyHighlights(context, lastWord);
                        }
                    );
                    break;

                case "caps":
                    this._createKeyBtn(
                        "keyboard_capslock",
                        "keyboard__key--activatable",
                        () => {
                            this.elements.capsKey
                                .classList
                                .toggle("keyboard__key--active");
                            this._toggleCapsLock();
                        },
                        "keyboard__key--wide"
                    );
                    this.elements.capsKey = this.keyElement;
                    break;

                case "enter":
                    this._createKeyBtn(
                        "keyboard_return", "keyboard__key--wide",
                        () => {
                            this.properties.value += "\n";
                            this._updateValueInTarget();
                        });
                    break;

                case "space":
                    const spaceBtn = this._createKeyBtn(
                        "space_bar",
                        "keyboard__key--extra--wide",
                        () => {
                            this.properties.value += " ";
                            this._updateValueInTarget();

                            // Préparer un nouveau contexte pour prédiction d’un nouveau mot
                            const currentValue = this.properties.value.trim().split(/\s+/);
                            const context = currentValue; // dernier mot étant vide
                            const lastWord = ""; // nouveau mot vide

                            this._updateKeyHighlights(context, lastWord);
                        },
                        "", // pas de class2
                        " " // data-char pour la touche espace
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
                        // Ajout du caractère
                        this.properties.value += this.properties.capsLock
                            ? key.toUpperCase()
                            : key.toLowerCase();

                        this._updateValueInTarget();

                        // Trouver le mot actuel
                        const currentValue = this.properties.value.trim().split(/\s+/);
                        const lastWord = currentValue[currentValue.length - 1] || "";
                        const context = currentValue.slice(0, -1);

                        this._updateKeyHighlights(context, lastWord);
                    });

                    // Affichage de la lettre sur la touche
                    this.keyElement.textContent = key.toLowerCase();
                    break;

            }

            fragment.appendChild(this.keyElement);

            if (insertLineBreak) {
                fragment
                    .appendChild(document.createElement("br"));
            }
        });
        return fragment;


    },

    _updateValueInTarget() {
        this.properties
            .keyboardInputs
            .forEach((keyboard) => {
                keyboard.value =
                    this.properties.value;
            });
    },

    _toggleCapsLock() {
        this.properties.capsLock =
            !this.properties.capsLock;

        for (let key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent =
                    this.properties.capsLock
                        ? key.textContent.toUpperCase()
                        : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput) {
        this.properties.value =
            initialValue || "";
        this.elements.main
            .classList
            .remove("keyboard--hidden");
        this.elements.main.classList.add("keyboard--visible");
    },

    close() {
        this.elements.main.classList.remove("keyboard--visible");
        this.properties.value = this.properties.value;
        this.elements.main
            .classList.add("keyboard--hidden");
    },


};


// Initialiser le clavier et les modèles de prédiction
window.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log('Initialisation des modèles de prédiction...');
        await initializePredictionModels();

        console.log('Initialisation du clavier...');
        Keyboard.init();

        console.log('Application prête !');
    } catch (error) {
        console.error('Erreur critique lors du démarrage de l\'application:', error);
        // Afficher un message d'erreur à l'utilisateur si nécessaire
        alert('Une erreur est survenue lors du démarrage de l\'application');
    }
});




