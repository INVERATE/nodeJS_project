import readline from 'readline';

// Corpus d'exemple
const corpus = `le chat mange une souris. le chien aboie fort. le chat dort. le chien court vite.`;

// Tokenisation
function tokenize(text) {
    return text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/);
}

const tokens = tokenize(corpus);

// Construire les transitions (bigrammes)
const transitions = {};
for (let i = 0; i < tokens.length - 1; i++) {
    const current = tokens[i];
    const next = tokens[i + 1];
    if (!transitions[current]) transitions[current] = {};
    transitions[current][next] = (transitions[current][next] || 0) + 1;
}

// Normaliser les probabilités
for (let current in transitions) {
    const total = Object.values(transitions[current]).reduce((a, b) => a + b, 0);
    for (let next in transitions[current]) {
        transitions[current][next] /= total;
    }
}

// Prédiction
function predictNext(word) {
    const options = transitions[word.toLowerCase()];
    if (!options) return null;

    const rand = Math.random();
    let cumulative = 0;

    for (let next in options) {
        cumulative += options[next];
        if (rand < cumulative) return next;
    }
    return null;
}

// Interface utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez un mot : ', function(input) {
    const prediction = predictNext(input);
    if (prediction) {
        console.log(`Mot suivant possible après "${input}": ${prediction}`);
    } else {
        console.log(`Aucune prédiction disponible pour "${input}".`);
    }
    console.log(transitions)
    rl.close();
});
