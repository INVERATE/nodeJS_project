const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    console.log('Démarrage de l\'application...');
    console.log('Chemin du preload:', path.join(__dirname, 'src', 'preload.js'));
    
    // Vérifier si le fichier preload existe
    const preloadPath = path.join(__dirname, 'src', 'preload.js');
    try {
        require('fs').accessSync(preloadPath);
        console.log('Fichier preload trouvé avec succès');
    } catch (err) {
        console.error('Erreur: Le fichier preload est introuvable à l\'emplacement:', preloadPath);
        console.error('Dossier courant:', __dirname);
    }

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            sandbox: false
        }
    });


    win.loadFile('keyboard.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Utilisation de ipcMain
ipcMain.on('mon-message', (event, arg) => {
    console.log('Message reçu depuis le renderer:', arg);
});
