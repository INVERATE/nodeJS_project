const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Fonction pour charger le corpus depuis les fichiers du dataset
function loadCorpus() {
    try {
        const datasetsPath = path.join(__dirname, '..', 'datasets');
        const files = [
            '1997-J.-K.-Rowling-Tome-1-Harry-Potter-à-l_école-des-sorciers.txt',
            '1998-J.-K.-Rowling-Tome-2-Harry-Potter-et-la-Chambre-des-secrets.txt',
            '1999-J.-K.-Rowling-Tome-3-Harry-Potter-et-le-Prisonnier-d_Azkaban.txt',
            '2000-J.-K.-Rowling-Tome-4-Harry-Potter-et-la-Coupe-de-feu.txt',
            '2003-J.-K.-Rowling-Tome-5-Harry-Potter-et-l_Ordrephenix.txt',
            '2005-J.-K.-Rowling-Tome-6-Harry-Potter-et-le-Prince-de-sang-mêlé.txt',
            '2007-J.-K.-Rowling-Tome-7-Harry-Potter-et-les-Reliques-de-la-mort.txt',
            '2016-J.-K.txt',
            '2016-J.-K_1.txt'
        ];

        let fullText = '';
        
        files.forEach(file => {
            try {
                const filePath = path.join(datasetsPath, file);
                if (fs.existsSync(filePath)) {
                    fullText += fs.readFileSync(filePath, 'utf-8') + '\n';
                    console.log(`Fichier chargé: ${file}`);
                } else {
                    console.warn(`Fichier introuvable: ${file}`);
                }
            } catch (error) {
                console.error(`Erreur lors de la lecture de ${file}:`, error);
            }
        });

        // Tokenisation simple (à adapter selon les besoins)
        const tokens = fullText
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')  // Supprime la ponctuation
            .split(/\s+/)
            .filter(word => word.length > 0);

        console.log(`Corpus chargé avec ${tokens.length} tokens`);
        return tokens;
    } catch (error) {
        console.error('Erreur lors du chargement du corpus:', error);
        return [];
    }
}

// API Electron existante
contextBridge.exposeInMainWorld('electronAPI', {
    envoyerMessage: (msg) => ipcRenderer.send('mon-message', msg),
    recevoirReponse: (callback) => ipcRenderer.on('reponse-message', (event, data) => callback(data)),
    loadCorpus: () => loadCorpus(),
});
