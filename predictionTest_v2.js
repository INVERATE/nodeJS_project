import fs from 'fs';

// 1. Lire le corpus
const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// 2. Tokenisation
function tokenize(text) {
    return text.toLowerCase().replace(/[.,!?;:()"'-]/g, '').split(/\s+/);
}
const tokens = tokenize(corpus);

// 3. Chaîne de Markov sur les mots
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

// Normalisation des mots
for (const [key, nextWords] of wordTransitions.entries()) {
    const total = Object.values(nextWords).reduce((a, b) => a + b, 0);
    for (let word in nextWords) {
        nextWords[word] /= total;
    }
}

// 4. Chaîne de Markov sur les lettres
const letterTransitions = {};

for (let word of tokens) {
    word += ' ';
    for (let i = 0; i < word.length - 1; i++) {
        const curr = word[i];
        const next = word[i + 1];
        if (!letterTransitions[curr]) letterTransitions[curr] = {};
        letterTransitions[curr][next] = (letterTransitions[curr][next] || 0) + 1;
    }
}

// Normalisation des lettres
for (let char in letterTransitions) {
    const total = Object.values(letterTransitions[char]).reduce((a, b) => a + b, 0);
    for (let next in letterTransitions[char]) {
        letterTransitions[char][next] /= total;
    }
}

// Fonctions exportables

export function getNextWordProbabilities(context) {
    for (let n = context.length; n > 0; n--) {
        const key = context.slice(-n).join(' ');
        const options = wordTransitions.get(key);
        if (options) return { options, contextUsed: n };
    }
    return { options: null, contextUsed: 0 };
}

export function completeWord(prefix, options) {
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

export function predictLetterCompletion(wordSoFar) {
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
        if (result.length > 15) break;
    }

    return result;
}

export function predictNextLetterProbs(currentPrefix, options) {
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

    for (let l in letterProbs) {
        letterProbs[l] /= totalWeight;
    }

    return letterProbs;
}