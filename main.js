const { app, BrowserWindow } = require("electron");
const path = require("path");
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
      webSecurity: true, // 
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

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  createWindow();
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
