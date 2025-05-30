import {
    predictNextLetters,
    setCorpusWords,
} from "../keyboard/predictionRamda.mjs";
import fs from "fs";

let tokens = []; // Rendons "tokens" global pour pouvoir l'utiliser dans Keyboard

function tokenizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s!:;,]/gi, ' ') // conserve lettres accentuées
        .split(/\s+/)
        .filter(Boolean);
}

async function loadMarkovData() {
    try {
        const corpus1 = fs.readFileSync('../datasets/1997-J.-K.-Rowling-Tome-1-Harry-Potter-à-l_école-des-sorciers.txt', 'utf-8');
        const corpus2 = fs.readFileSync('../datasets/1998-J.-K.-Rowling-Tome-2-Harry-Potter-et-la-Chambre-des-secrets.txt', 'utf-8');
        const corpus3 = fs.readFileSync('../datasets/1999-J.-K.-Rowling-Tome-3-Harry-Potter-et-le-Prisonnier-d_Azkaban.txt', 'utf-8');
        const corpus4 = fs.readFileSync('../datasets/2000-J.-K.-Rowling-Tome-4-Harry-Potter-et-la-Coupe-de-feu.txt', 'utf-8');
        const corpus5 = fs.readFileSync('../datasets/2003-J.-K.-Rowling-Tome-5-Harry-Potter-et-l_Ordrephenix.txt', 'utf-8');
        const corpus6 = fs.readFileSync('../datasets/2005-J.-K.-Rowling-Tome-6-Harry-Potter-et-le-Prince-de-sang-mêlé.txt', 'utf-8');
        const corpus7 = fs.readFileSync('../datasets/2007-J.-K.-Rowling-Tome-7-Harry-Potter-et-les-Reliques-de-la-mort.txt', 'utf-8');
        const corpus8 = fs.readFileSync('../datasets/2016-J.-K.txt', 'utf-8');
        const corpus9 = fs.readFileSync('../datasets/2016-J.-K_1.txt', 'utf-8');

        const corpus = corpus1 + corpus2 + corpus3 + corpus5;// Ou ton chemin correct vers le corpus
        tokens = tokenizeText(corpus);
        setCorpusWords(tokens);
        console.log("Corpus chargé avec", tokens.length, "tokens.");
    } catch (err) {
        console.error("Erreur lors du chargement du corpus :", err);
    }
}

loadMarkovData();

const currentWord = "";
const context = ["je", "suis"];
const nextLetterProbs = predictNextLetters(context, currentWord);
console.log("Probabilités des lettres suivantes pour", currentWord, ":", nextLetterProbs);