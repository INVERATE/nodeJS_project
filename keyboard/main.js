const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

async function createWindow() {
    // Attendre que le bundle preload soit construit
    await new Promise(resolve => setTimeout(resolve, 1000));
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'dist', 'preload.bundle.js'),
            contextIsolation: true,
            nodeIntegration: false
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
