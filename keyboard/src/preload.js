const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');

// Fonction pour charger le corpus depuis les fichiers texte
async function loadCorpus() {
    try { // oui, il y a beaucoup de petits points de suspension ici
        const files = [
            path.join(__dirname, '..', '..', 'datasets', '1997-J.-K.-Rowling-Tome-1-Harry-Potter-à-l_école-des-sorciers.txt'),
            path.join(__dirname, '..', '..', 'datasets', '1998-J.-K.-Rowling-Tome-2-Harry-Potter-et-la-Chambre-des-secrets.txt'),
            path.join(__dirname, '..', '..', 'datasets', '1999-J.-K.-Rowling-Tome-3-Harry-Potter-et-le-Prisonnier-d_Azkaban.txt'),
            path.join(__dirname, '..', '..', 'datasets', '2000-J.-K.-Rowling-Tome-4-Harry-Potter-et-la-Coupe-de-feu.txt'),
            path.join(__dirname, '..', '..', 'datasets', '2003-J.-K.-Rowling-Tome-5-Harry-Potter-et-l_Ordrephenix.txt'),
            path.join(__dirname, '..', '..', 'datasets', '2005-J.-K.-Rowling-Tome-6-Harry-Potter-et-le-Prince-de-sang-mêlé.txt'),
            path.join(__dirname, '..', '..', 'datasets', '2007-J.-K.-Rowling-Tome-7-Harry-Potter-et-les-Reliques-de-la-mort.txt'),
            path.join(__dirname, '..', '..', 'datasets', '2016-J.-K.txt'),
            path.join(__dirname, '..', '..', 'datasets', '2016-J.-K_1.txt')
        ];

        const raws = await Promise.all(
            files.map(file => fs.readFile(file, 'utf-8').catch(err => {
                console.error(`Erreur lors de la lecture de ${file}:`, err);
                return '';
            }))
        );
        
        return raws.join(' ');
    } catch (error) {
        console.error('Erreur lors du chargement du corpus:', error);
        throw error;
    }
}

// Fonction pour charger les modèles Markov
async function loadMarkovData() {
    try {
        const [wordJson, letterJson] = await Promise.all([
            fs.readFile(path.join(__dirname, '..', 'markov_word_transitions.json'), 'utf-8'),
            fs.readFile(path.join(__dirname, '..', 'markov_letter_transitions.json'), 'utf-8')
        ]);
        return {
            wordTransitions: JSON.parse(wordJson),
            letterTransitions: JSON.parse(letterJson)
        };
    } catch (error) {
        console.error('Erreur lors du chargement des modèles Markov:', error);
        throw error;
    }
}

// Exposer les fonctions au contexte du rendu
try {
    console.log('Préparation de l\'exposition des APIs...');
    
    contextBridge.exposeInMainWorld('predictionAPI', {
        loadCorpus: async () => {
            console.log('loadCorpus appelé depuis le rendu');
            try {
                const result = await loadCorpus();
                console.log('loadCorpus réussi');
                return result;
            } catch (error) {
                console.error('Erreur dans loadCorpus:', error);
                throw error;
            }
        },
        loadMarkovData: async () => {
            console.log('loadMarkovData appelé depuis le rendu');
            try {
                const result = await loadMarkovData();
                console.log('loadMarkovData réussi');
                return result;
            } catch (error) {
                console.error('Erreur dans loadMarkovData:', error);
                throw error;
            }
        }
    });
    
    console.log('APIs exposées avec succès');
} catch (error) {
    console.error('Erreur lors de l\'exposition des APIs:', error);
}

