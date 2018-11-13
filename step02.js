const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');

const dbPath = path.resolve(__dirname, 'step02User');
const db = new sqlite3.Database(dbPath);
let api = express();
// init the tables
db.serialize(() => {
    db.run("create table if not exists users (id integer primary key autoincrement, nickname char(45), email char(100), password char(16))");
    db.get('select count(*) as value from users', (err, row) => {
        if (err) throw err;
        console.log('nb: ' + row.value) 
    });
});

// read
// usage: curl -X GET 'http://localhost:4242/users'
// usage: curl -X GET 'http://localhost:4242/users/:<id>' (where id = your id)
api.get(['/users','/users/:id'], (req,res) => {
    console.log(req.params);
    let request = `select id, nickname, email, password from users`
    if (req.params.id) {
        request += ` where id = ${req.params.id.slice(1)}`
    }
    db.all(request, (err, row) => {
        if (err) throw err;
        res.json(row);
    });
});

// insert
// usage: curl -X POST 'http://localhost:4242/users?name=<name>&email=<mail>&password=<psw>'
api.post('/users', (req, res) => {
    console.log(req.query);
    if(!req.query.name || !req.query.email || !req.query.password) {
        console.log('noooooooooooooooooo')
        res.status(500)
        res.end()
    } else {
        db.run("insert into users (nickname, email, password) values (?,?,?)", req.query.name,req.query.email,req.query.password, function(err, row){
            if (err){
                console.error(err);
                res.status(500);
            }
            else {
                res.status(202);
            }
            res.end();
        });
        console.log('post');
    }
});

// update
// usage: curl -X PUT 'http://localhost:4242/users/:<id>?newpassword=<psw>'
// api.put('/users/:id', (req, res) => {
//     console.log(req.query);
//     let body = '';
//     for (let item in req.query) {
//         body += ` ${item} = ${req.query[item]} and `
//     }

//     db.run(`update users set ${body.slice(0,-4)} where id = ${req.params.id.slice(1)}`, function(err, row){
//         if (err){
//             console.error(err);
//             res.status(500);
//         }
//         else {
//             res.status(202);
//         }
//     });
//     res.end();
// });
api.put(['/users', '/users/:id'], (req, res)=>{
    db.run("UPDATE users SET nickname = ?", req.query.nickname, (err, row)=>{
        if (err) res.status(500);
        else res.status(202);
        res.end();
    });
});



// delete
// usage: curl -X DELETE 'http://localhost:4242/users/:<id>'
api.delete('/users/:id', (req, res) => {
    db.run(`delete from users where id = ? `, req.params.id.slice(1), (err, row) => {
        if (err) {
            console.log(err)
            res.status(500);
        } else {
            console.log('oui')
            res.status(202);
        }
        res.end();
    });
});


api.listen(4242)