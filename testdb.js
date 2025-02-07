const sqlite3 = require('sqlite3').verbose();

function checkDatabase() {
    let db = new sqlite3.Database('./books.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Checking database content...');
    });

    db.all(`SELECT * FROM books`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (rows.length === 0) {
            console.log("No data found in books table.");
        } else {
            console.log("Database contents:");
            console.table(rows);
        }
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
}

// Run the function
checkDatabase();
