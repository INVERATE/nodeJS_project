
// 5. Fonctions de prédiction
import * as R from "ramda";

let wordTransitions = {};
let letterTransitions = {};

export async function loadMarkovData() {
    const wordRes = await fetch('./markov_word_transitions.json');
    const letterRes = await fetch('./markov_letter_transitions.json');
    wordTransitions = await wordRes.json();
    letterTransitions = await letterRes.json();
}


export function getNextWordProbabilities(context) {
    for (let n = R.length(context); n > 0; n--) {
        const key = R.pipe(
            R.takeLast(n),
            R.join(' ')
        )(context);
        const options = wordTransitions[key];
        if (options) return { options, contextUsed: n };
    }
    return { options: null, contextUsed: 0 };
}

export function completeWord(prefix, options) {
    let best = null;
    let bestProb = 0;

    for (let word in options) {
        if (R.startsWith(prefix)(word)) {
            if (options[word] > bestProb) {
                bestProb = options[word];
                best = word;
            }
        }
    }

    return best ? best.slice(R.length(prefix)) : null;
}

export function predictLetterCompletion(wordSoFar) {
    let result = '';
    let current = wordSoFar[R.length(wordSoFar) - 1] || '';
    while (true) {
        const nextOptions = letterTransitions[current];
        if (!nextOptions) break;

        let best = null;
        let bestProb = 0;

        for (let letter in nextOptions) {
            if (nextOptions[letter] > bestProb) {
                bestProb = nextOptions[letter];
                best = letter;
            }
        }

        if (best === ' ' || !best) break;
        result += best;
        current = best;
        if (R.length(result) > 15) break; // sécurité anti boucle infinie
    }

    return result;
}

/**
 * Predicts the next most probable letters based on context and current word prefix
 * @param {string} currentPrefix - The current partial word being typed
 * @param {Object} wordOptions - Word transition probabilities from the context
 * @param {string} context - The context (previous words)
 * @returns {Object} Object with letters as keys and their probabilities as values
 */
/**
 * @param {string} currentPrefix
 * @param {Object<string, number>} wordOptions – dictionnaire mot → proba
 * @returns {Object<string, number>} – top 5 lettres suivantes + leur proba normalisée
 */

export function predictNextLetterProbs(currentPrefix, wordOptions = {}, context = '') {
    const letterProbs = {};
    let totalWeight = 0;

    // 1) mots issus du contexte
    for (let word in wordOptions) {
        if (!word.startsWith(currentPrefix)) continue;
        const nextLetter = word[currentPrefix.length];
        if (!nextLetter) continue;
        const wp = wordOptions[word];
        totalWeight += wp;
        letterProbs[nextLetter] = (letterProbs[nextLetter] || 0) + wp;
    }

    // 2) transitions de lettres (dernière lettre du préfixe)
    if (currentPrefix.length > 0) {
        const lastChar = currentPrefix[currentPrefix.length - 1].toLowerCase();
        const letterOptions = letterTransitions[lastChar] || {};
        for (let l in letterOptions) {
            const lp = letterOptions[l];
            totalWeight += lp;
            letterProbs[l] = (letterProbs[l] || 0) + lp * 0.7;
        }
    }

    // 3) fallback si aucune proba
    if (Object.keys(letterProbs).length === 0) {
        const commonStarts = letterTransitions[''] || {};
        for (let l in commonStarts) {
            letterProbs[l] = commonStarts[l];
            totalWeight += commonStarts[l];
        }
    }

    // 4) normalisation
    if (totalWeight > 0) {
        for (let l in letterProbs) {
            letterProbs[l] /= totalWeight;
        }
    }

    // 5) on ne garde que les 5 lettres les plus probables
    return Object.fromEntries(
        Object.entries(letterProbs)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .filter(([, p]) => p > 0.05) // seulement si la proba est > 0.05

    );
}



export function getMostProbableNextLetter(currentPrefix, options) {
    const letterProbs = predictNextLetterProbs(currentPrefix, options);

    let bestLetter = null;
    let bestProb = 0;

    for (let letter in letterProbs) {
        if (letterProbs[letter] > bestProb) {
            bestProb = letterProbs[letter];
            bestLetter = letter;
        }
    }

    return bestLetter;
}

