const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const dbPath = path.resolve(__dirname, 'demodb02');
const db = new sqlite3.Database(dbPath);
let api = express();

db.serialize(() => {
    db.run("create table if not exists counts (key text, value int)");
    db.run("insert into counts values (?,?)", "counter", 0);
});

api.get('/data', (req,res) => {
    db.get('select value from counts', (err, row) => {
        if (err) throw err;
        res.json({"count": row.value}); 
    });
});

api.post('/data', (req, res) => {
    db.run("update counts set value = value + 1 where key = ?", "counter", function(err, row){
        if (err){
            console.err(err);
            res.status(500);
        }
        else {
            res.status(202);
        }
        res.end();
    });
})

api.listen(4242)

// use http://localhost:4242/data