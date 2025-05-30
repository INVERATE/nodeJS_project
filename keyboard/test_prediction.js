import {
    loadMarkovModels,
    predictNextLetters,
    setCorpusWords,
} from "./predictionRamda.mjs";
import fs from "fs/promises"; // version promise-friendly

async function init() {
    // 1) Charge et tokenise le corpus
    const files = [
        '../datasets/1997-J.-K.-Rowling-Tome-1-Harry-Potter-à-l_école-des-sorciers.txt',
        '../datasets/1998-J.-K.-Rowling-Tome-2-Harry-Potter-et-la-Chambre-des-secrets.txt',
        '../datasets/1999-J.-K.-Rowling-Tome-3-Harry-Potter-et-le-Prisonnier-d_Azkaban.txt',
        '../datasets/2000-J.-K.-Rowling-Tome-4-Harry-Potter-et-la-Coupe-de-feu.txt',
        '../datasets/2003-J.-K.-Rowling-Tome-5-Harry-Potter-et-l_Ordrephenix.txt',
        '../datasets/2005-J.-K.-Rowling-Tome-6-Harry-Potter-et-le-Prince-de-sang-mêlé.txt',
        '../datasets/2007-J.-K.-Rowling-Tome-7-Harry-Potter-et-les-Reliques-de-la-mort.txt',
        '../datasets/2016-J.-K.txt',
        '../datasets/2016-J.-K_1.txt'
    ];
    const raws = await Promise.all(files.map(path => fs.readFile(path, 'utf-8')));
    const corpus = raws.join(' ');
    const tokens = tokenizeText(corpus);
    setCorpusWords(tokens);
    console.log("Corpus chargé avec", tokens.length, "tokens.");

    // 2) Charge et parse tes JSON de Markov
    const [wordJson, letterJson] = await Promise.all([
        fs.readFile('./markov_word_transitions.json', 'utf-8'),
        fs.readFile('./markov_letter_transitions.json', 'utf-8')
    ]);
    const wordTransitions = JSON.parse(wordJson);
    const letterTransitions = JSON.parse(letterJson);

    // 3) Normalise la casse et charge dans le module
    //    (optionnel mais fortement conseillé pour matcher "tu es" → "tu es")
    const lowerWordTrans = Object.fromEntries(
        Object.entries(wordTransitions).map(([k, dist]) => [
            k.toLowerCase(),
            Object.fromEntries(
                Object.entries(dist).map(([w, p]) => [w.toLowerCase(), p])
            )
        ])
    );
    loadMarkovModels(lowerWordTrans, letterTransitions);

    // 4) Fais ta prédiction
    const context = ["suis", "Harry"];
    const currentWord = "p";
    const nextLetterProbs = predictNextLetters(context, currentWord);
    console.log("Probabilités :", nextLetterProbs);
}

init().catch(console.error);

// ta fonction tokenizeText reste inchangée
function tokenizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s!:;,]/gi, ' ')
        .split(/\s+/)
        .filter(Boolean);
}
