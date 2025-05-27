import fs from 'fs';
import readline from 'readline';

// 1. Lire le corpus
const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// 2. Tokenisation
function tokenize(text) {
    return text.toLowerCase().replace(/[.,!?;:()"'-]/g, '').split(/\s+/);
}

const tokens = tokenize(corpus);

// 3. Construire les transitions dynamiques (n-grammes de taille variable)
const transitions = new Map();

for (let n = 1; n <= 5; n++) { // on limite à 5-grammes pour éviter trop de rareté
    for (let i = 0; i <= tokens.length - n; i++) {
        const key = tokens.slice(i, i + n).join(' ');
        const next = tokens[i + n];
        if (!next) continue;

        if (!transitions.has(key)) transitions.set(key, {});
        const nextWords = transitions.get(key);
        nextWords[next] = (nextWords[next] || 0) + 1;
    }
}

// 4. Normaliser les probabilités
for (const [key, nextWords] of transitions.entries()) {
    const total = Object.values(nextWords).reduce((a, b) => a + b, 0);
    for (let word in nextWords) {
        nextWords[word] /= total;
    }
}

// 5. Fonction pour récupérer la meilleure prédiction selon le contexte maximal
function getBestPrediction(contextWords) {
    for (let n = contextWords.length; n > 0; n--) {
        const key = contextWords.slice(-n).join(' ');
        const options = transitions.get(key);
        if (options) {
            let bestWord = null;
            let bestProb = 0;
            for (let next in options) {
                if (options[next] > bestProb) {
                    bestProb = options[next];
                    bestWord = next;
                }
            }
            return { suggestion: bestWord, n };
        }
    }
    return { suggestion: null, n: 0 };
}

// 6. Interface interactive
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let phrase = [];

function askWord() {
    rl.question(`Entrez un mot (ou "stop" pour finir) : `, function(input) {
        const word = input.toLowerCase();

        if (word === 'stop') {
            console.log(`\n✅ Phrase finale : ${phrase.join(' ')}`);
            rl.close();
            return;
        }

        phrase.push(word);

        const { suggestion, n } = getBestPrediction(phrase);

        console.log(`🔍 Contexte utilisé (n=${n}) : "${phrase.slice(-n).join(' ')}"`);
        console.log(`✨ Suggestion : ${suggestion ?? 'aucune'}`);
        console.log(`📌 Phrase actuelle : ${phrase.join(' ')}\n`);

        askWord(); // Continuer
    });
}

console.log('--- ✍️ Construction de phrase assistée par Markov (contexte variable) ---');
console.log('💡 Tape "stop" pour terminer.\n');
askWord();
