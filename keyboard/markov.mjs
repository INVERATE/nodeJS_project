//chargement dans terminal long du a la longeur des textes

import fs from 'fs';
import readline from 'readline';
import * as R from "ramda";

// === 1. Lire le corpus ===
// === 1. Lire le corpus ===
const corpus1 = fs.readFileSync('../datasets/1997-J.-K.-Rowling-Tome-1-Harry-Potter-à-l_école-des-sorciers.txt', 'utf-8');
const corpus2 = fs.readFileSync('../datasets/1998-J.-K.-Rowling-Tome-2-Harry-Potter-et-la-Chambre-des-secrets.txt', 'utf-8');
const corpus3 = fs.readFileSync('../datasets/1999-J.-K.-Rowling-Tome-3-Harry-Potter-et-le-Prisonnier-d_Azkaban.txt', 'utf-8');
const corpus4 = fs.readFileSync('../datasets/2000-J.-K.-Rowling-Tome-4-Harry-Potter-et-la-Coupe-de-feu.txt', 'utf-8');
const corpus5 = fs.readFileSync('../datasets/2003-J.-K.-Rowling-Tome-5-Harry-Potter-et-l_Ordrephenix.txt', 'utf-8');
const corpus6 = fs.readFileSync('../datasets/2005-J.-K.-Rowling-Tome-6-Harry-Potter-et-le-Prince-de-sang-mêlé.txt', 'utf-8');
const corpus7 = fs.readFileSync('../datasets/2007-J.-K.-Rowling-Tome-7-Harry-Potter-et-les-Reliques-de-la-mort.txt', 'utf-8');
const corpus8 = fs.readFileSync('../datasets/2016-J.-K.txt', 'utf-8');
const corpus9 = fs.readFileSync('../datasets/2016-J.-K_1.txt', 'utf-8');

const corpus = corpus1 + corpus2 + corpus3 + corpus5 ;
//const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// === 2. Tokenisation ===
function tokenize(text) {
    return R.split(/\s+/,
        R.replace(/[.?()"'-]/g, ' ',
            R.toLower(text)));
}

const tokens = tokenize(corpus);

// === 3. Chaîne de Markov sur les mots ===
const wordTransitions = new Map();
//on prend en compte les 5 mots avant dans la phrase
for (let n = 1; n <= 2; n++) {
    for (let i = 0; i <= tokens.length - n - 1; i++) {
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

