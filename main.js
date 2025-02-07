const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const grayMatter = require("gray-matter");
const sqlite3 = require("sqlite3").verbose();
const fsp = require("fs").promises;


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
 console.log("window created\n");
  win.setMenuBarVisibility(false);
  win.setAutoHideMenuBar(true);

  win.loadURL("http://localhost:3000");

  win.webContents.on("did-fail-load", () => {
   console.log("Failed to load content\n");
  });

  win.on("closed", () => {
   console.log("Window closed\n");
  });

  // Database setup
  setupDatabase();
 console.log("Setup Database\n");
}

app.whenReady().then(() => {
 console.log("App is ready\n");

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

ipcMain.on("compare-file", (event, relativePath) => {
  //const vscodePath = "C:/Program Files/Microsoft VS Code/bin/code"; // Adjust if needed
  const absolutePath = path.join(__dirname, relativePath); // Convert to absolute path

  exec(`code --diff "${absolutePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
      return;
    }
    console.log(`File opened successfully in VS Code: ${stdout}`);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
 console.log("App is quitting\n");
});

function setupDatabase() {
  // Path to the books folder
  const booksFolder = path.join(__dirname, "public", "books");

  // Open SQLite database
  let db = new sqlite3.Database("./books.db", (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the SQLite database.");
  });

  // Drop the existing table if it exists
  db.run(`DROP TABLE IF EXISTS books`, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Dropped the existing books table.");

    // Create a new table
    db.run(
        `CREATE TABLE IF NOT EXISTS books (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          author TEXT,
          filename TEXT,
          filepath TEXT
        )`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("Created the books table.");

        // Read files from the books folder and insert data
        insertBooksData(db, booksFolder);
      }
    );
  });
}

async function insertBooksData(db, booksFolder) {
    try {
      const files = await fsp.readdir(booksFolder);
  
      for (const file of files) {
        // Ignore .git file
        if (file === ".git") continue;
  
        // Read the markdown file
        const filePath = path.join(booksFolder, file);
        const fileContents = await fsp.readFile(filePath, "utf8");
  
        // Extract filename without extension
        const filename = path.parse(file).name;
  
        // Remove front matter (tags) before storing content
        const content = fileContents.replace(/^---[\s\S]+?---\s*/, "");
  
        // Parse front matter
        const { data } = grayMatter(fileContents);
  
       // Ensure data contains author
       if (!data.author) {
        console.error(`Missing author in file: ${file}`);
        continue;
      }
  
        // Insert into SQLite
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO books (author, filename, filepath) VALUES (?, ?, ?)`,
            [data.author, filename, filePath],
            (err) => {
              if (err) {
                console.error(err.message);
                reject(err);
              } else {
                console.log(`Inserted ${filename} into the database.`);
                resolve();
              }
            }
          );
        });
      }
  
    console.log("All files have been processed.");
    } catch (err) {
      console.error(err);
    } finally {
      // Close the database connection
      db.close((err) => {
        if (err) console.error(err.message);
        else console.log("Database connection closed.");
      });
    }
  }
