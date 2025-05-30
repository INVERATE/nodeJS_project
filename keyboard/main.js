const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname,'src', 'preload.js'),
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
