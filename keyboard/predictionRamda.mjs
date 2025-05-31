import * as R from "ramda";

export let wordFrequencyMap = {};
export let markovWordTransitions = {};
export let markovLetterTransitions = {};

/**
 * Initialise la fréquence des mots du corpus
 * @param {string[]} tokens - Liste de tokens extraits du corpus
 */
export const setCorpusWords = (tokens) => {
    wordFrequencyMap = R.countBy(R.toLower)(tokens); // Compte les occurrences de chaque mot pour favorer les mots les plus fréquents
};

/**
 * Charge les modèles Markov
 * @param {Object} wordTransitions - Transitions entre mots (bigrammes)
 * @param {Object} letterTransitions - Transitions entre lettres
 */
export const loadMarkovModels = (wordTransitions, letterTransitions) => {
    markovWordTransitions = wordTransitions;
    markovLetterTransitions = letterTransitions;
};

/**
 * Prédit les prochaines lettres en combinant contexte, transitions de mots et transitions de lettres
 * @param {string[]} context - Contexte précédent (mots avant le mot actuel)
 * @param {string} currentPrefix - Début du mot en cours d'écriture
 * @returns {Object} - Objet { lettre: probabilité } trié par probabilité décroissante
 */
export const predictNextLetters = (context, currentPrefix) => {
    const currentPrefixLower = currentPrefix.toLowerCase();
    const contextLower = context.map(R.toLower);

    const wordCompletionProbs = getWordCompletionProbs(currentPrefixLower);
    const contextBasedProbs = getContextBasedProbs(contextLower, currentPrefixLower);
    const letterTransitionProbs = getLetterTransitionProbs(currentPrefixLower);

    return combineProbabilities(wordCompletionProbs, contextBasedProbs, letterTransitionProbs);
};

const getWordCompletionProbs = (prefix) => {
    // Filtrer mots commençant par prefix et plus longs, récupérer la lettre suivante + fréquence
    const filtered = R.pipe(
        R.toPairs,
        R.filter(([word]) => word.startsWith(prefix) && word.length > prefix.length),
        R.reduce((acc, [word, freq]) => {
            const nextChar = word[prefix.length];
            acc[nextChar] = (acc[nextChar] || 0) + freq;
            return acc;
        }, {})
    )(wordFrequencyMap);

    const total = R.sum(R.values(filtered));
    return total > 0 ? normalizeProbs(filtered, total) : {};
};

const getContextBasedProbs = (context, prefix) => {
    if (context.length === 0) return {};

    const contextKey = R.takeLast(2, context).join(" "); // Derniers deux mots
    const nextWordDist = markovWordTransitions[contextKey] || {};

    const filtered = R.pipe(
        R.toPairs,
        R.filter(([word]) => word.startsWith(prefix) && word.length > prefix.length),
        R.reduce((acc, [word, prob]) => {
            const nextChar = word[prefix.length];
            acc[nextChar] = (acc[nextChar] || 0) + prob;
            return acc;
        }, {})
    )(nextWordDist);

    const total = R.sum(R.values(filtered));
    return total > 0 ? normalizeProbs(filtered, total) : {};
};

const getLetterTransitionProbs = (prefix) => {
    if (prefix.length === 0) return {};

    const lastChars = prefix.slice(-2); // Derniers deux caractères
    const transitions = markovLetterTransitions[lastChars] || {};

    const total = R.sum(R.values(transitions));
    return total > 0 ? normalizeProbs(transitions, total) : {};
};

const combineProbabilities = (probsA, probsB, probsC) => {
    const weights = { A: 0.4, B: 0.4, C: 0.2 }; // Coefficients de poids qui permettent de modifier l'importance des modèles
    // A+B+C = 1 !!!!
    // A pour privilégier le mot le plus fréquent existant dans le corpus
    // B pour privilégier le contexte
    // C pour privilégier la transition des lettres
    const allKeys = R.uniq([
        ...R.keys(probsA), // trois petits points (...) permettent de concattener les tableaux
        ...R.keys(probsB),
        ...R.keys(probsC),
    ]);

    const combined = R.reduce(
        (acc, key) => ({
            ...acc,
            [key]:
                (probsA[key] || 0) * weights.A +
                (probsB[key] || 0) * weights.B +
                (probsC[key] || 0) * weights.C,
        }),
        {},
        allKeys
    );

    return normalizeAndSort(combined);
};

const normalizeProbs = (counts, total) =>
    R.map((v) => v / total, counts);

const normalizeAndSort = (probs) => {
    const total = R.sum(R.values(probs));
    if (total <= 0) return { " ": 1 }; // cas particulier lorsque probs est vide, permet de passer au mot suivant

    return R.pipe(
        R.map((v) => v / total),
        R.toPairs,
        R.sortBy(R.last), // tri par probabilité
        R.reverse,
        R.fromPairs
    )(probs);
};
