//chargement dans terminal long du a la longeur des textes

import fs from 'fs';
import readline from 'readline';
import * as R from "ramda";

// === 1. Lire le corpus ===
const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// === 2. Tokenisation ===
function tokenize(text) {
    return R.split(/\s+/,
        R.replace(/[.,!?;:()"'-]/g, '',
            R.toLower(text)));
}

const tokens = tokenize(corpus);

// === 3. Chaîne de Markov sur les mots ===
const wordTransitions = new Map();
//on prend en comppte les 5 mot avant dans la phrase
for (let n = 1; n <= 5; n++) {
    for (let i = 0; i <= R.length(tokens) - n; i++) {
        const key = R.join(' ', R.slice(i, i + n, tokens));
        const next = tokens[i + n];
        if (!next) continue;

        if (!wordTransitions.has(key)) wordTransitions.set(key, {});
        const nextWords = wordTransitions.get(key);
        nextWords[next] = (nextWords[next] || 0) + 1;
    }
}

// Normalisation
for (const [key, nextWords] of wordTransitions.entries()) {
    const total = R.pipe(
        R.values,
        R.sum
    )(nextWords);
    for (let word in nextWords) {
        nextWords[word] /= total;
    }
}


//  4. Chaîne de Markov sur les lettres
const letterTransitions = {};

for (let word of tokens) {
    word += ' '; // espace = fin de mot
    for (let i = 0; i < R.length(word) - 1; i++) {
        const curr = word[i];
        const next = word[i + 1];
        if (!letterTransitions[curr]) letterTransitions[curr] = {};
        letterTransitions[curr][next] = (letterTransitions[curr][next] || 0) + 1;
    }
}

// Normalisation
for (let char in letterTransitions) {
    const total = R.pipe(
        R.values,
        R.sum
    )(letterTransitions[char]);
    for (let next in letterTransitions[char]) {
        letterTransitions[char][next] /= total;
    }
}

// Sauvegarde en JSON
fs.writeFileSync('./markov_word_transitions.json', JSON.stringify(Object.fromEntries(wordTransitions)));
fs.writeFileSync('./markov_letter_transitions.json', JSON.stringify(letterTransitions));

