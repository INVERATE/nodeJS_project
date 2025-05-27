import fs from 'fs';
import readline from 'readline';

// === 1. Lire le corpus ===
const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// === 2. Tokenisation ===
function tokenize(text) {
    return text.toLowerCase().replace(/[.,!?;:()"'-]/g, '').split(/\s+/);
}
const tokens = tokenize(corpus);

// === 3. Chaîne de Markov sur les mots ===
const wordTransitions = new Map();

for (let n = 1; n <= 5; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
        const key = tokens.slice(i, i + n).join(' ');
        const next = tokens[i + n];
        if (!next) continue;

        if (!wordTransitions.has(key)) wordTransitions.set(key, {});
        const nextWords = wordTransitions.get(key);
        nextWords[next] = (nextWords[next] || 0) + 1;
    }
}

// Normalisation
for (const [key, nextWords] of wordTransitions.entries()) {
    const total = Object.values(nextWords).reduce((a, b) => a + b, 0);
    for (let word in nextWords) {
        nextWords[word] /= total;
    }
}

// === 4. Chaîne de Markov sur les lettres ===
const letterTransitions = {};

for (let word of tokens) {
    word += ' '; // espace = fin de mot
    for (let i = 0; i < word.length - 1; i++) {
        const curr = word[i];
        const next = word[i + 1];
        if (!letterTransitions[curr]) letterTransitions[curr] = {};
        letterTransitions[curr][next] = (letterTransitions[curr][next] || 0) + 1;
    }
}

// Normalisation
for (let char in letterTransitions) {
    const total = Object.values(letterTransitions[char]).reduce((a, b) => a + b, 0);
    for (let next in letterTransitions[char]) {
        letterTransitions[char][next] /= total;
    }
}

// === 5. Fonctions de prédiction ===

function getNextWordProbabilities(context) {
    for (let n = context.length; n > 0; n--) {
        const key = context.slice(-n).join(' ');
        const options = wordTransitions.get(key);
        if (options) return { options, contextUsed: n };
    }
    return { options: null, contextUsed: 0 };
}

function completeWord(prefix, options) {
    let best = null;
    let bestProb = 0;

    for (let word in options) {
        if (word.startsWith(prefix)) {
            if (options[word] > bestProb) {
                bestProb = options[word];
                best = word;
            }
        }
    }

    return best ? best.slice(prefix.length) : null;
}

function predictLetterCompletion(wordSoFar) {
    let result = '';
    let current = wordSoFar[wordSoFar.length - 1] || '';
    while (true) {
        const nextOptions = letterTransitions[current];
        if (!nextOptions) break;

        let best = null;
        let bestProb = 0;

        for (let letter in nextOptions) {
            if (nextOptions[letter] > bestProb) {
                bestProb = nextOptions[letter];
                best = letter;
            }
        }

        if (best === ' ' || !best) break;
        result += best;
        current = best;
        if (result.length > 15) break; // sécurité anti boucle infinie
    }

    return result;
}

// ** Nouvelle fonction : probas des prochaines lettres selon mots candidats **
function predictNextLetterProbs(currentPrefix, options) {
    const letterProbs = {};
    let totalWeight = 0;

    for (let word in options) {
        if (!word.startsWith(currentPrefix)) continue;

        const nextLetter = word[currentPrefix.length];
        if (!nextLetter) continue;

        const wordProb = options[word];
        totalWeight += wordProb;

        if (!letterProbs[nextLetter]) letterProbs[nextLetter] = 0;
        letterProbs[nextLetter] += wordProb;
    }

    // Normalisation
    for (let l in letterProbs) {
        letterProbs[l] /= totalWeight;
    }

    return letterProbs;
}

// === 6. Interface interactive ===

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let phrase = [];
let currentWord = '';

function askLetter() {
    const context = [...phrase];

    rl.question(`Lettre (ou " " pour valider le mot, "stop" pour quitter) : `, function(input) {
        if (input === 'stop') {
            console.log(`\n✅ Phrase finale : ${[...phrase, currentWord].join(' ')}`);
            rl.close();
            return;
        }

        if (input === ' ') {
            if (currentWord.length > 0) {
                phrase.push(currentWord);
                currentWord = '';
                console.log(`📌 Phrase : ${phrase.join(' ')}\n`);
            }

            const { options, contextUsed } = getNextWordProbabilities(phrase);
            if (options) {
                const predictions = Object.entries(options).sort((a, b) => b[1] - a[1]).slice(0, 3);
                console.log(`🔮 Prochain(s) mot(s) possible(s) : ${predictions.map(([w, p]) => `${w} (${p.toFixed(2)})`).join(', ')}`);
            } else {
                console.log('❌ Aucune prédiction disponible pour ce contexte.');
            }

            askLetter();
            return;
        }

        currentWord += input.toLowerCase();

        const { options } = getNextWordProbabilities(phrase);

        // Suggestion complétion mot
        let suggestion = options ? completeWord(currentWord, options) : null;

        // Affichage proba prochaines lettres selon mots candidats
        if (options) {
            const nextLetterProbs = predictNextLetterProbs(currentWord, options);
            if (Object.keys(nextLetterProbs).length > 0) {
                console.log(`📈 Probabilités des prochaines lettres :`);
                const sorted = Object.entries(nextLetterProbs)
                    .sort((a, b) => b[1] - a[1])
                    .map(([l, p]) => ({
                        lettre: l === ' ' ? '(espace)' : l,
                        probabilité: p.toFixed(3)
                    }));
                console.table(sorted);
            } else {
                console.log(`❌ Aucune lettre probable à cette position`);
            }
        } else {
            // fallback
            suggestion = predictLetterCompletion(currentWord);
        }

        console.log(`✏️ Mot en cours : ${currentWord}${suggestion ? ` → ${currentWord + suggestion}` : ''}`);
        askLetter();
    });
}

console.log('\n--- 🤖 Assistant de rédaction intelligent ---');
console.log('💡 Tape chaque lettre, " " pour valider un mot, "stop" pour finir. \n');
askLetter();
