import {getNextWordProbabilities, predictNextLetterProbs} from "./predictionTest_v2";

this.keyElement
    .addEventListener("click", () => {
        const currentValue = this.properties.value.trim().split(/\s+/);
        const lastWord = currentValue[currentValue.length - 1] || "";

        const { options } = getNextWordProbabilities(currentValue);
        if (options) {
            const suggestions = predictNextLetterProbs(lastWord, options);

            this.elements.keys.forEach((keyEl) => {
                const char = keyEl.textContent.toLowerCase();
                if (suggestions[char]) {
                    keyEl.classList.add("active"); // ou change la taille/style
                } else {
                    keyEl.classList.remove("active");
                }
            });
        }

        // Ajout de la lettre tapée
        this.properties.value +=
            this.properties.capsLock
                ? key.toUpperCase()
                : key.toLowerCase();

        this._updateValueInTarget();
    });



this._createKeyBtn("", "", () => {
    // Ajout du caractère
    this.properties.value += this.properties.capsLock
        ? key.toUpperCase()
        : key.toLowerCase();

    this._updateValueInTarget();

    // Trouver le mot actuel
    const words = this.properties.value.trim().split(/\s+/);
    const currentWord = words[words.length - 1] || "";

    // Calcul des prédictions
    const { options } = getNextWordProbabilities(words);
    if (!options) return;

    const suggestions = predictNextLetterProbs(currentWord, options);

    // Nettoyer les anciennes suggestions
    this.elements.keys.forEach((keyEl) => {
        keyEl.classList.remove("active");
    });

    // Ajouter les nouvelles suggestions
    this.elements.keys.forEach((keyEl) => {
        const char = keyEl.textContent.toLowerCase();
        if (suggestions[char]) {
            console.log("🔍 Ajout de la classe active sur :", keyEl.textContent);
            console.log(`✅ ${char} suggéré avec ${suggestions[char]}`);
            keyEl.classList.add("active");
        }
    });
});

// Affichage de la lettre sur la touche
this.keyElement.textContent = key.toLowerCase();
