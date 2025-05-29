let R = null;

export function setRamda(ramdaLib) {
    R = ramdaLib;
}

// Exemple d'utilisation
export function exampleRamdaUsage() {
    const data = [1, 2, 3, 4];
    const squared = R.map(x => x * x, data);
    console.log(squared); // [1, 4, 9, 16]
}
let wordTransitions = {};
let letterTransitions = {};

export async function loadMarkovData() {
    const wordRes = await fetch('./markov_word_transitions.json');
    const letterRes = await fetch('./markov_letter_transitions.json');
    wordTransitions = await wordRes.json();
    letterTransitions = await letterRes.json();
}

export function getNextWordProbabilities(context) {
    for (let n = context.length; n > 0; n--) {
        const key = context.slice(-n).join(' ');
        const options = wordTransitions[key];
        if (options) return { options, contextUsed: n };
    }
    return { options: null, contextUsed: 0 };
}

export function completeWord(prefix, options) {
    let best = null;
    let bestProb = 0;

    for (let word in options) {
        if (word.startsWith(prefix)) {
            if (options[word] > bestProb) {
                bestProb = options[word];
                best = word;
            }
        }
    }

    return best ? best.slice(prefix.length) : null;
}

export function predictLetterCompletion(wordSoFar) {
    let result = '';
    let current = wordSoFar[wordSoFar.length - 1] || '';
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
        if (result.length > 15) break;
    }

    return result;
}

export function predictNextLetterProbs(currentPrefix, options) {
    const letterProbs = {};
    let totalWeight = 0;

    for (let word in options) {
        if (!word.startsWith(currentPrefix)) continue;

        const nextLetter = word[currentPrefix.length];
        if (!nextLetter) continue;

        const wordProb = options[word];
        totalWeight += wordProb;

        if (!letterProbs[nextLetter]) letterProbs[nextLetter] = 0;
        letterProbs[nextLetter] += wordProb;
    }

    // Normalisation
    for (let l in letterProbs) {
        letterProbs[l] /= totalWeight;
    }
    console.log(letterProbs);
    return letterProbs;
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
