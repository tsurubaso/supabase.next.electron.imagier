const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const logStream = fs.createWriteStream(
  path.join(__dirname, "electron-log.txt"),
  { flags: "a" }
);

function createWindow() {
  const preloadPath = path.join(__dirname, "preload.js");

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath, //
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: true, /////////////////////
    },
  });

  win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);

  win.loadURL("http://localhost:3000");

  win.webContents.on("did-fail-load", () => {
    logStream.write("Failed to load content\n");
  });

  win.on("closed", () => {
    logStream.write("Window closed\n");
  });
}

app.whenReady().then(() => {
  logStream.write("App is ready\n");

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

ipcMain.on("open-file", (event, relativePath) => {
  const libreOfficePath = "C:/Program Files/LibreOffice/program/soffice.exe"; // Adjust the path if necessary
  const absolutePath = path.join(__dirname, relativePath); // Convert to absolute path
  exec(`"${libreOfficePath}" "${absolutePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      return;
    }
    console.log(`File opened successfully: ${stdout}`);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  logStream.write("App is quitting\n");
  logStream.end();
});
