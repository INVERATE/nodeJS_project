// generateMarkovData.js
import fs from 'fs';

// Lire corpus
const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// Tokenisation
function tokenize(text) {
    return text.toLowerCase().replace(/[.,!?;:()"'-]/g, '').split(/\s+/);
}
const tokens = tokenize(corpus);

// Transitions de mots
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
for (const [key, nextWords] of wordTransitions.entries()) {
    const total = Object.values(nextWords).reduce((a, b) => a + b, 0);
    for (let word in nextWords) {
        nextWords[word] /= total;
    }
}

// Transitions de lettres
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
for (let char in letterTransitions) {
    const total = Object.values(letterTransitions[char]).reduce((a, b) => a + b, 0);
    for (let next in letterTransitions[char]) {
        letterTransitions[char][next] /= total;
    }
}

// Sauvegarde en JSON
fs.writeFileSync('./markov_word_transitions.json', JSON.stringify(Object.fromEntries(wordTransitions)));
fs.writeFileSync('./markov_letter_transitions.json', JSON.stringify(letterTransitions));

console.log("Markov data saved!");
