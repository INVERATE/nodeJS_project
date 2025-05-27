import fs from 'fs';
import readline from 'readline';

// 1. Lire le corpus depuis le fichier texte
const corpus = fs.readFileSync('./datasets/lacomediehumaine.txt', 'utf-8');

// 2. Tokenisation du texte
function tokenize(text) {
    return text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
}

const tokens = tokenize(corpus);

// 3. Construire les transitions entre les mots
const transitions = {};
for (let i = 0; i < tokens.length - 1; i++) {
    const current = tokens[i];
    const next = tokens[i + 1];
    if (!transitions[current]) transitions[current] = {};
    transitions[current][next] = (transitions[current][next] || 0) + 1;
}

// 4. Normaliser les probabilités
for (let current in transitions) {
    const total = Object.values(transitions[current]).reduce((a, b) => a + b, 0);
    for (let next in transitions[current]) {
        transitions[current][next] /= total;
    }
}

// 5. Interface utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez un mot : ', function(input) {
    const word = input.toLowerCase();
    const options = transitions[word];

    if (options) {
        console.log(`\nProbabilités normalisées pour "${word}" :`);
        let sum = 0;
        let maxProb = 0;
        let bestNext = null;

        for (let next in options) {
            const prob = options[next];
            sum += prob;

            console.log(`→ ${next} : ${prob.toFixed(4)}`);

            if (prob > maxProb) {
                maxProb = prob;
                bestNext = next;
            }
        }

        console.log(`\n✔ Somme totale : ${sum.toFixed(4)}`);
        console.log(`⭐ Mot avec la plus forte probabilité : "${bestNext}" (${maxProb.toFixed(4)})`);
    } else {
        console.log(`\nAucune donnée disponible pour "${word}".`);
    }

    rl.close();
});
