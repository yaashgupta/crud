const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser")

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"crud"
})

db.connect((err)=>{
    if(err){
        console.log("Database connection failed", err.stack);
        return  ;
    }
    console.log("Connected to MySql Database")
})



// Creating users /Post user

app.post('/users', (req, res)=>{
    const { name, email, age } = req.body;
    const query = 'INSERT INTO users(name, email, age) VALUES(?,?,?)'
    db.query(query,[name, email, age], (err, result)=>{
        if (err){
            return res.json(500).json({error:err.message})
        }
        res.status(201).json({id:result.insertId, name, email, age })
    })
})

// Get users

app.get('/users',(req, res)=>{
    const query = 'SELECT * FROM users';
    db.query(query,(err,results)=>{
        if (err){
            return res.status(500).json({error:err.message})
        }
        res.json(results)
    })
})

// Read a single user by ID

app.get('/users/:id', (res, req)=>{
    const {id} = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], (err , result)=>{
        if (err){
            return res.status(500).json({error:err.message})
        }
        if(result.length === 0){
            return res.status(400)({error:"User not found"})
        }
        res.json(result[0])
    })
})

// Update a user by id

app.put('/users/:id', (req, res)=>{
    const {id} = req.params;
    const {name , email, age} = req.body;
    const query = "UPDATE users SET name = ? , email = ? , age =? WHERE id = ?";
    db.query(query,[name, email, age, id],(err, result)=>{
        if(err){
            return res.status(500).json({error:err.message})
        }
        if (result.affectedRows ===0){
            return res.status(400).json({error:"User not found"})
        }
        res.json({id,name,email,age})
    } )
})

// Delete user 

app.delete("/users/:id", (req, res)=>{
    const {id} = req.params;
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query,[id], (err, result)=>{
        if (err){
            return res.status(500).json({error:err.message})
        }
    })
})

app.listen(8081, () => {
    console.log(`Server is running`);
  });