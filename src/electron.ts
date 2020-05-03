import { app, BrowserWindow } from 'electron';
import path from 'path';

const DEV_MODE = process.env.NODE_ENV !== 'prod';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
    });

    mainWindow.loadFile('../public/index.html');

    if (DEV_MODE) {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
