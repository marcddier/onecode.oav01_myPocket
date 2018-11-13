const path = require('path')
var sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, 'demodb01')
var db = new sqlite3.Database(dbPath);

db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS demo (runtime REAL)");

    db.run("INSERT INTO demo (runtime) VALUES (?)", new Date().getTime());

    db.each("SELECT runtime FROM demo", function(err, row) {
        console.log("This app was run at " + row.runtime);
    });
});

db.close();

// npm install sqlite3
// npm install https://github.com/mapbox/node-sqlite3/tarball/master