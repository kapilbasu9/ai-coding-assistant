const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, 'dist/index.html'));

  // Auto-updater listeners
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. Downloading now...',
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. It will be installed on restart.',
    }).then(() => autoUpdater.quitAndInstall());
  });
}

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
