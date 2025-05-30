import * as R from "ramda";

export let wordFrequencyMap = {};
export let markovWordTransitions = {};
export let markovLetterTransitions = {};

/**
 * Initialise la fréquence des mots du corpus
 * @param {string[]} tokens - Liste de tokens extraits du corpus
 */
export function setCorpusWords(tokens) {
    wordFrequencyMap = {};
    tokens.forEach(token => {
        const word = token.toLowerCase();
        wordFrequencyMap[word] = (wordFrequencyMap[word] || 0) + 1;
    });
}

/**
 * Charge les modèles Markov pré-entraînés
 * @param {Object} wordTransitions - Transitions entre mots (bigrammes)
 * @param {Object} letterTransitions - Transitions entre lettres
 */
export function loadMarkovModels(wordTransitions, letterTransitions) {
    markovWordTransitions = wordTransitions;
    markovLetterTransitions = letterTransitions;
}

/**
 * Prédit les prochaines lettres en combinant contexte, transitions de mots et transitions de lettres
 * @param {string[]} context - Contexte précédent (mots avant le mot actuel)
 * @param {string} currentPrefix - Début du mot en cours d'écriture
 * @returns {Object} - Objet { lettre: probabilité } trié par probabilité décroissante
 */
export function predictNextLetters(context, currentPrefix) {
    const currentPrefixLower = currentPrefix.toLowerCase();
    const contextLower = context.map(w => w.toLowerCase());

    // 1. Probabilités basées sur la complétion de mot (sans contexte)
    const wordCompletionProbs = getWordCompletionProbs(currentPrefixLower);

    // 2. Probabilités basées sur le contexte (bigrammes de mots)
    const contextBasedProbs = getContextBasedProbs(contextLower, currentPrefixLower);

    // 3. Probabilités basées sur les transitions de lettres
    const letterTransitionProbs = getLetterTransitionProbs(currentPrefixLower);

    // Combinaison pondérée des modèles
    const combinedProbs = combineProbabilities(
        wordCompletionProbs,
        contextBasedProbs,
        letterTransitionProbs
    );

    return combinedProbs;
}

function getWordCompletionProbs(prefix) {
    const counts = {};
    let total = 0;

    Object.entries(wordFrequencyMap).forEach(([word, freq]) => {
        if (word.startsWith(prefix) && word.length > prefix.length) {
            const nextChar = word[prefix.length];
            counts[nextChar] = (counts[nextChar] || 0) + freq;
            total += freq;
        }
    });

    return total > 0
        ? normalizeProbs(counts, total)
        : {};
}

function getContextBasedProbs(context, prefix) {
    if (context.length === 0) return {};

    // Utilise les 2 derniers mots du contexte
    const contextKey = context.slice(-2).join(' ');
    const nextWordDist = markovWordTransitions[contextKey] || {};

    // Filtre les mots commençant par le préfixe
    const filteredWords = Object.entries(nextWordDist)
        .filter(([word]) => word.startsWith(prefix))
        .filter(([word]) => word.length > prefix.length);

    // Agrège par prochaine lettre
    const counts = {};
    let total = 0;

    filteredWords.forEach(([word, prob]) => {
        const nextChar = word[prefix.length];
        counts[nextChar] = (counts[nextChar] || 0) + prob;
        total += prob;
    });

    return total > 0
        ? normalizeProbs(counts, total)
        : {};
}

function getLetterTransitionProbs(prefix) {
    if (prefix.length === 0) return {};

    // Prend les 2 derniers caractères du préfixe
    const lastChars = prefix.slice(-2);
    const transitions = markovLetterTransitions[lastChars] || {};

    return normalizeProbs(transitions, Object.values(transitions).reduce((a, b) => a + b, 0));
}

function combineProbabilities(probsA, probsB, probsC) {
    const weights = { A: 0.4, B: 0.4, C: 0.2 }; // Poids ajustables
    const combined = {};
    const allKeys = new Set([
        ...Object.keys(probsA),
        ...Object.keys(probsB),
        ...Object.keys(probsC)
    ]);

    allKeys.forEach(key => {
        combined[key] =
            (probsA[key] || 0) * weights.A +
            (probsB[key] || 0) * weights.B +
            (probsC[key] || 0) * weights.C;
    });

    // Normalisation finale
    return normalizeAndSort(combined);
}

function normalizeProbs(counts, total) {
    return Object.fromEntries(
        Object.entries(counts).map(([key, value]) => [key, value / total])
    );
}

function normalizeAndSort(probs) {
    const total = Object.values(probs).reduce((sum, val) => sum + val, 0);
    if (total <= 0) return { ' ': 1 }; // Cas par défaut

    //trier selon la probabilité
    const normalized = R.pipe(
        R.mapObjIndexed(val => val / total),
        R.toPairs,
        R.sortBy(R.last),
        R.reverse,
        R.fromPairs
    )(probs);



    return normalized;
}