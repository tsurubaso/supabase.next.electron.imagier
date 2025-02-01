const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

const logStream = fs.createWriteStream(path.join(__dirname, 'electron-log.txt'), { flags: 'a' });

function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");
  logStream.write(`Resolved Preload Path: ${preloadPath}\n`);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath, 
      contextIsolation: true, 
      enableRemoteModule: false, 
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  logStream.write('App is ready\n');
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("quit", () => {
  logStream.write('App is quitting\n');
  logStream.end();
});
